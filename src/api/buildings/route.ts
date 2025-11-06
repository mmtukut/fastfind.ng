import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import Papa from 'papaparse';

// Function to parse WKT POLYGON string into GeoJSON coordinates
function parseWktPolygon(wkt: string): number[][][] {
  const coordString = wkt.replace(/^POLYGON\s*\(\(\s*|\s*\)\)$/g, '');
  const pairs = coordString.split(', ');
  const coordinates = pairs.map(pair => {
    const [lng, lat] = pair.split(' ').map(Number);
    return [lng, lat];
  });
  return [coordinates];
}

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), 'public', 'data', 'buildings', 'gombe_buildings.csv');
    const csvFile = await fs.readFile(csvFilePath, 'utf8');

    const parsed = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    
    if (parsed.errors.length) {
      console.error('CSV Parsing Errors:', parsed.errors);
      throw new Error('Failed to parse CSV file');
    }

    const buildingTypes = ['residential', 'commercial', 'industrial', 'institutional'];

    const features = parsed.data.map((row: any, index: number) => {
        const geometry = row.geometry ? parseWktPolygon(row.geometry) : [];
        // Assign a random building type since it's not in the CSV
        const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];

        return {
            type: 'Feature',
            id: row.full_plus_code || index,
            properties: {
                area_in_meters: row.area_in_meters,
                confidence: row.confidence,
                type: type,
                // keep other properties as well
                ...row
            },
            geometry: {
                type: 'Polygon',
                coordinates: geometry,
            },
        };
    });

    const geojsonData = {
      type: 'FeatureCollection',
      features: features,
    };
    
    return NextResponse.json(geojsonData);
  } catch (error) {
    console.error('Failed to fetch building data:', error);
    return new NextResponse('Failed to fetch building data', { status: 500 });
  }
}
