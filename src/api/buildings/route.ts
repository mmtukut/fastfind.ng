import { NextRequest, NextResponse } from 'next/server';

const buildingTypes = ['residential', 'commercial', 'industrial', 'institutional'];

function getRandomBuildingType(seed: number) {
  // Simple pseudo-random generator based on a seed for consistency
  const x = Math.sin(seed) * 10000;
  const index = Math.floor((x - Math.floor(x)) * buildingTypes.length);
  return buildingTypes[index];
}

async function parseCSV(csv: string, bounds: { north: number, south: number, east: number, west: number } | null) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const features = [];

  const latIndex = headers.indexOf('latitude');
  const lonIndex = headers.indexOf('longitude');
  
  if (latIndex === -1 || lonIndex === -1) {
    throw new Error('CSV must contain latitude and longitude columns');
  }

  // Use a map for faster header index lookup
  const headerMap = headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {} as {[key: string]: number});

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',').map(d => d.trim());
    if (data.length !== headers.length) continue;

    const latitude = parseFloat(data[headerMap['latitude']]);
    const longitude = parseFloat(data[headerMap['longitude']]);

    if (bounds) {
        if (latitude > bounds.north || latitude < bounds.south || longitude > bounds.east || longitude < bounds.west) {
            continue;
        }
    }
    
    if (!isNaN(longitude) && !isNaN(latitude)) {
      const properties: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        const value = data[index];
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && (header === 'area_in_meters' || header === 'confidence' || header === 'latitude' || header === 'longitude')) {
          properties[header] = numValue;
        } else {
          properties[header] = value;
        }
      });
      
      // Assign a consistent "random" type based on coordinates for filtering
      properties['type'] = getRandomBuildingType(latitude + longitude);
      
      features.push({
        type: 'Feature',
        id: properties['full_plus_code'] || `building-${i}`,
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        properties: {
          id: properties['full_plus_code'] || `building-${i}`,
          ...properties
        }
      });
    }
  }
  return features;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');

    const bounds = north && south && east && west 
        ? {
            north: parseFloat(north),
            south: parseFloat(south),
            east: parseFloat(east),
            west: parseFloat(west),
        } : null;

    const response = await fetch('https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347', { 
      // Using cache: 'force-cache' as the file is static. Can be changed if data updates frequently.
      cache: 'force-cache' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    const features = await parseCSV(csvData, bounds);

    const geojsonData = {
      type: 'FeatureCollection',
      features: features,
    };

    return NextResponse.json(geojsonData);
  } catch (error) {
    console.error('Failed to fetch or parse building data:', error);
    let errorMessage = 'Failed to fetch or parse building data';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(errorMessage, { status: 500 });
  }
}
