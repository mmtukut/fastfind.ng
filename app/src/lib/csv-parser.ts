import Papa from 'papaparse';
import { Building } from '@/types';

/**
 * Parses a WKT (Well-Known Text) POLYGON string into GeoJSON Polygon coordinates.
 * CRITICAL: This handles newlines that might exist within coordinate numbers in the CSV.
 * @param wkt - The WKT string, e.g., "POLYGON((lon lat, lon lat, ...))"
 * @returns GeoJSON coordinates array or null if parsing fails.
 */
function parseWKTPolygon(wkt: string): number[][][] | null {
  if (!wkt || typeof wkt !== 'string') return null;

  // 1. CRITICAL: Remove all newline characters and trim whitespace
  const cleanWkt = wkt.replace(/[\r\n]+/g, '').trim();

  // 2. Extract coordinate pairs string using a robust regex
  const match = cleanWkt.match(/POLYGON\s*\(\((.*)\)\)/i);
  if (!match || !match[1]) return null;

  // 3. Split into individual coordinate pairs
  const coordPairs = match[1].split(',').map(pair => pair.trim());
  if (coordPairs.length < 3) return null; // A polygon needs at least 3 points

  // 4. Parse each pair into [lon, lat] numbers
  const coordinates: number[][] = coordPairs
    .map(pair => {
      const parts = pair.trim().split(/\s+/).filter(p => p.length > 0);
      if (parts.length !== 2) return null; // Each pair must have lon and lat

      const lon = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);

      // 5. Validate coordinates
      if (isNaN(lon) || isNaN(lat) || lon < 10 || lon > 13 || lat < 9 || lat > 12) {
          // console.warn(`Invalid or out-of-bounds coordinate found: [${parts[0]}, ${parts[1]}]`);
          return null;
      }
      return [lon, lat];
    })
    .filter((coord): coord is number[] => coord !== null);

  // A valid polygon needs at least 3 valid coordinate pairs
  if (coordinates.length < 3) return null;

  // 6. Close the polygon if it's not already closed
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    coordinates.push([...firstPoint]);
  }

  return [coordinates]; // GeoJSON Polygon format is an array of rings
}

/**
 * Classifies a building based on its area and other properties.
 * @param area - The area of the building in square meters.
 * @returns A building classification.
 */
function classifyBuilding(area: number): Building['properties']['classification'] {
    // These rules are simplified based on the guide.
    // A more complex implementation could use nearRoad and shapeRegularity.
    if (area > 1000) return 'industrial';
    if (area > 500) return 'institutional';
    if (area > 200) return 'commercial';
    if (area < 50) return 'mixed'; // Assuming very small structures might be mixed-use sheds/shops
    return 'residential';
}

/**
 * Estimates the value of a building based on its classification and area.
 * @param classification - The building's classification.
 * @param area - The building's area in square meters.
 * @returns The estimated value in Naira.
 */
function estimateValue(classification: Building['properties']['classification'], area: number): number {
    switch(classification) {
        case 'residential': return area * 500;
        case 'commercial': return area * 1200;
        case 'industrial': return area * 600;
        case 'institutional': return area * 800;
        case 'mixed': return area * 700;
        default: return area * 500;
    }
}


/**
 * Parses the Gombe Buildings CSV content into an array of Building objects.
 * Uses a streaming approach for better performance with large files.
 * @param csvText - The raw string content of the CSV file.
 * @param limit - Optional limit for the number of rows to parse.
 * @returns A promise that resolves to an array of Building objects.
 */
export function parseGombeBuildingsCSV(csvText: string, limit = 50000): Promise<Building[]> {
  return new Promise((resolve, reject) => {
    const buildings: Building[] = [];
    let rowCount = 0;

    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      worker: true, // Use a web worker for parsing to not block the main thread
      step: (results) => {
        if (rowCount >= limit) {
          return;
        }

        const row = results.data as any;
        
        if (!row.geometry || !row.full_plus_code) {
          return; // Skip rows with missing essential data
        }

        try {
          const geometryCoords = parseWKTPolygon(row.geometry);
          if (!geometryCoords) {
            return; // Skip if WKT parsing fails
          }

          const area = parseFloat(row.area_in_meters) || 0;
          const classification = classifyBuilding(area);
          const estimatedValue = estimateValue(classification, area);
          
          // Use a unique ID for each building
          const buildingId = `${row.full_plus_code}-${rowCount}`;

          const building: Building = {
            id: buildingId,
            geometry: {
              type: 'Polygon',
              coordinates: geometryCoords,
            },
            properties: {
              area_in_meters: area,
              classification: classification,
              confidence: parseFloat(row.confidence) || 0,
              estimatedValue: estimatedValue,
              detectedAt: new Date().toISOString(), // Placeholder
              full_plus_code: row.full_plus_code,
              // These properties are not in the CSV but required by the type
              nearRoad: Math.random() > 0.5, // Placeholder
            },
          };
          buildings.push(building);
          rowCount++;

          if (rowCount % 10000 === 0) {
            console.log(`Parsed ${rowCount} buildings...`);
          }

        } catch (error) {
          // console.error('Error processing row:', row, error);
        }
      },
      complete: () => {
        console.log(`Finished parsing. Total buildings: ${buildings.length}`);
        resolve(buildings);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
