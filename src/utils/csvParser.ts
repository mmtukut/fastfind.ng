import Papa from 'papaparse';
import { Building, BuildingClassification } from '@/types';
import { estimateValue } from './buildingClassifier';

function parseWKTPolygon(wkt: string): number[][][] | null {
  if (!wkt || typeof wkt !== 'string') return null;
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

        if (lon < 10 || lon > 12 || lat < 9 || lat > 11.5) return null;
        
        return [lon, lat];
      })
      .filter((coord): coord is number[] => coord !== null);

    if (coordinates.length < 3) return null;

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

// A simple rule-based classifier that runs on the server.
function classifyBuilding(area: number): BuildingClassification {
    if (area > 2000) return 'industrial';
    if (area > 800) return 'commercial';
    if (area > 500) return 'institutional';
    if (area > 300) return 'mixed';
    return 'residential';
}


// This function now runs on the server and returns a promise with the fully parsed data.
export function parseGombeBuildingsCSV(csvText: string): Promise<Building[]> {
  return new Promise((resolve, reject) => {
    let buildings: Building[] = [];

    Papa.parse(csvText, {
      header: true,
      worker: false, // Run in the same thread on the server
      step: (results) => {
        const row = results.data as any;
        const area = parseFloat(row.area_in_meters);
        const confidence = parseFloat(row.confidence);
        const wkt = row.geometry;
        const id = row.full_plus_code;

        if (!isNaN(area) && wkt && id) {
          const coordinates = parseWKTPolygon(wkt);
          if (coordinates) {
            const classification = classifyBuilding(area);
            const estimatedValue = estimateValue(classification, area);

            buildings.push({
              id: id,
              type: 'Feature', // Added for GeoJSON compatibility
              geometry: { type: 'Polygon', coordinates },
              properties: {
                id: id, // Also include id in properties for easier access
                area_in_meters: area,
                confidence: confidence,
                classification: classification,
                nearRoad: false, // Placeholder
                estimatedValue,
                detectedAt: new Date().toLocaleDateString(), // Placeholder
              },
            });
          }
        }
      },
      complete: () => {
        resolve(buildings);
      },
      error: (error: any) => {
        console.error('PapaParse Error:', error);
        reject(error);
      }
    });
  });
}
