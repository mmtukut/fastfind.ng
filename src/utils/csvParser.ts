import Papa from 'papaparse';
import { Building, BuildingClassification } from '@/types';
import { estimateValue } from './buildingClassifier';

function parseWKTPolygon(wkt: string): number[][][] | null {
  if (!wkt || typeof wkt !== 'string') return null;
  // CRITICAL: Remove all newlines and trim, especially those within coordinate numbers
  const cleanWkt = wkt.replace(/[\r\n\s\t]+/g, ' ').trim();
  const match = cleanWkt.match(/POLYGON\s?\(\((.*)\)\)/);

  if (!match || !match[1]) return null;

  try {
    const coordPairs = match[1].split(',');
    const coordinates = coordPairs
      .map(pair => {
        const parts = pair.trim().split(' ').filter(p => p.length > 0);
        if (parts.length !== 2) return null;
        
        const lon = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);

        if (isNaN(lon) || isNaN(lat)) return null;

        // Basic validation for Gombe, Nigeria
        if (lon < 10 || lon > 12 || lat < 9 || lat > 11.5) return null;
        
        return [lon, lat];
      })
      .filter((coord): coord is number[] => coord !== null);

    if (coordinates.length < 3) return null;

    // Ensure polygon is closed
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push([...first]);
    }

    return [coordinates];
  } catch(e) {
    console.error("Error parsing WKT:", wkt, e);
    return null;
  }
}

// Type for the raw row data before classification
type UnclassifiedBuildingRow = {
  id: string;
  area: number;
  confidence: number;
  wkt: string;
}

const BATCH_SIZE = 500; // Number of buildings to send for classification at once

export function parseGombeBuildingsCSV(
  csvText: string,
  onUpdate: (buildings: Building[], progress: number) => void
) {
  let buildings: Building[] = [];
  let rowCount = 0;
  const totalRows = csvText.split('\n').length;
  let unclassifiedBatch: UnclassifiedBuildingRow[] = [];

  const classifyAndAddBatch = async () => {
    if (unclassifiedBatch.length === 0) return;

    // Create instances for the Vertex AI model
    const instances = unclassifiedBatch.map(row => ({
      // Your model expects features. Adapt this structure to match your model's input.
      // For example, if it's a simple model based on area:
      "area_in_meters": row.area,
      "confidence": row.confidence,
    }));

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || 'Batch classification failed');
      }

      const { predictions } = await response.json();

      if (!predictions || predictions.length !== unclassifiedBatch.length) {
         throw new Error('Mismatched number of predictions received from model.');
      }
      
      const classifiedBuildings = unclassifiedBatch.map((row, index) => {
        const coordinates = parseWKTPolygon(row.wkt);
        // The model prediction might be a simple string or a more complex object.
        // Adapt this based on your model's exact output format.
        const classification = (predictions[index] || 'unknown') as BuildingClassification;
        
        if (coordinates) {
          const estimatedValue = estimateValue(classification, row.area);
          return {
            id: row.id,
            geometry: { type: 'Polygon', coordinates },
            properties: {
              area_in_meters: row.area,
              confidence: row.confidence,
              classification: classification,
              nearRoad: false,
              estimatedValue,
              detectedAt: new Date().toLocaleDateString(),
            },
          } as Building;
        }
        return null;
      }).filter((b): b is Building => b !== null);

      buildings = buildings.concat(classifiedBuildings);
      
    } catch (error) {
      console.error("Error during batch classification:", error);
      // Handle error, maybe retry or skip batch
    } finally {
      // Clear batch for next set of rows
      unclassifiedBatch = [];
    }
  };


  Papa.parse(csvText, {
    header: true,
    worker: true,
    step: async (results) => {
      const row = results.data as any;
      rowCount++;
      
      const area = parseFloat(row.area_in_meters);
      const confidence = parseFloat(row.confidence);
      const wkt = row.geometry;

      if (!isNaN(area) && wkt && row.full_plus_code) {
        unclassifiedBatch.push({
          id: row.full_plus_code,
          area: area,
          confidence: confidence,
          wkt: wkt
        });
      }
      
      // When batch is full, send for classification
      if (unclassifiedBatch.length >= BATCH_SIZE) {
        await classifyAndAddBatch();
        const progress = Math.min(99, Math.round((rowCount / totalRows) * 100));
        onUpdate([...buildings], progress);
      }
    },
    complete: async () => {
      // Process any remaining items in the last batch
      if (unclassifiedBatch.length > 0) {
        await classifyAndAddBatch();
      }
      console.log(`Parsing complete. Found ${buildings.length} valid buildings.`);
      onUpdate([...buildings], 100);
    },
    error: (error: any) => {
        console.error('PapaParse Error:', error);
    }
  });
}
