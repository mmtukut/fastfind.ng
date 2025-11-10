import Papa from 'papaparse';
import { Building } from '@/types';
import { classifyBuilding, estimateValue } from './buildingClassifier';

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

export function parseGombeBuildingsCSV(
  csvText: string,
  onUpdate: (buildings: Building[], progress: number) => void
) {
  const buildings: Building[] = [];
  let rowCount = 0;
  // Estimate total rows for progress calculation (adjust if needed)
  const totalRows = csvText.split('\n').length;
  const updateInterval = Math.max(1000, Math.floor(totalRows / 100));

  Papa.parse(csvText, {
    header: true,
    worker: true, // Use a web worker for performance
    step: (results) => {
      const row = results.data as any;
      rowCount++;
      
      const area = parseFloat(row.area_in_meters);
      const confidence = parseFloat(row.confidence);
      const wkt = row.geometry;

      if (!isNaN(area) && !isNaN(confidence) && wkt && row.full_plus_code) {
        const coordinates = parseWKTPolygon(wkt);

        if (coordinates) {
          const classification = classifyBuilding(area);
          const estimatedValue = estimateValue(classification, area);

          buildings.push({
            id: row.full_plus_code,
            geometry: {
              type: 'Polygon',
              coordinates,
            },
            properties: {
              area_in_meters: area,
              confidence,
              classification,
              nearRoad: false, // Placeholder, as this info is not in the CSV
              estimatedValue,
              detectedAt: new Date().toLocaleDateString(), // Placeholder
            },
          });
        }
      }
      
      // Provide progress updates without overwhelming the main thread
      if (rowCount % updateInterval === 0 || rowCount === totalRows - 1) {
        const progress = Math.min(99, Math.round((rowCount / totalRows) * 100));
        onUpdate([...buildings], progress);
      }
    },
    complete: () => {
      console.log(`Parsing complete. Found ${buildings.length} valid buildings.`);
      onUpdate([...buildings], 100);
    },
    error: (error: any) => {
        console.error('PapaParse Error:', error);
    }
  });
}
