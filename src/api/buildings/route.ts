import { NextResponse } from 'next/server';

function parseCSV(csv: string) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const features = [];

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',').map(d => d.trim());
    if (data.length !== headers.length) continue;

    const properties: { [key: string]: any } = {};
    let longitude: number | null = null;
    let latitude: number | null = null;

    headers.forEach((header, index) => {
      const value = data[index];
      if (header === 'longitude') {
        longitude = parseFloat(value);
      } else if (header === 'latitude') {
        latitude = parseFloat(value);
      } else if (header === 'confidence') {
        // The confidence from the CSV is 0-100, the app expects 0-1
        properties[header] = parseFloat(value) / 100;
      } else if (header === 'area_in_meters') {
        properties[header] = parseFloat(value);
      } else if (header === 'classification') {
        // The CSV uses 'classification', the app uses 'type'
        properties['type'] = value.toLowerCase() || 'mixed-use';
        properties[header] = value;
      } else {
        properties[header] = value;
      }
    });

    if (longitude !== null && latitude !== null && !isNaN(longitude) && !isNaN(latitude)) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        properties: {
          id: properties.id || `building-${i}`,
          ...properties
        }
      });
    }
  }
  return features;
}

export async function GET() {
  try {
    const response = await fetch('https://github.com/mmtukut/Fastfind-360/raw/refs/heads/main/public/data/buildings/gombe_buildings.csv', { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    const features = parseCSV(csvData);

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
