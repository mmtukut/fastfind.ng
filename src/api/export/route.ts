import { NextRequest, NextResponse } from 'next/server';

const buildingTypes = ['residential', 'commercial', 'industrial', 'institutional'];

function getRandomBuildingType(seed: number) {
  const x = Math.sin(seed) * 10000;
  const index = Math.floor((x - Math.floor(x)) * buildingTypes.length);
  return buildingTypes[index];
}

async function getBuildingData(filters: any) {
  // This function fetches ALL data and then filters.
  // For very large datasets, filtering should be done at the source if possible.
  const response = await fetch('https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347');
  const csvData = await response.text();
  
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  let allFeatures: any[] = [];

  const headerMap = headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {} as {[key: string]: number});

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',').map(d => d.trim());
    if (data.length !== headers.length) continue;

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
      properties['type'] = getRandomBuildingType(properties['latitude'] + properties['longitude']);
      allFeatures.push(properties);
  }
  
  let features = allFeatures;

  if (filters.types) {
    const types = filters.types.split(',');
    features = features.filter((feature: any) => types.includes(feature.type));
  }

  if (filters.minSize || filters.maxSize) {
    const minSize = parseFloat(filters.minSize || '0');
    const maxSize = parseFloat(filters.maxSize || 'Infinity');
    features = features.filter((feature: any) => 
        feature.area_in_meters >= minSize && feature.area_in_meters <= maxSize
    );
  }

  if (filters.confidence) {
    // The confidence filter is 0-100, but the property confidence is 0-1
    const minConfidence = parseFloat(filters.confidence) / 100;
    features = features.filter((feature: any) => feature.confidence >= minConfidence);
  }

  return features;
}

function convertToCSV(data: any[]) {
  if (data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = String(value === null || value === undefined ? '' : value);
        // Wrap in quotes if value contains a comma
        return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      }).join(',')
    )
  ];
  return csvRows.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      types: searchParams.get('types'),
      minSize: searchParams.get('minSize'),
      maxSize: searchParams.get('maxSize'),
      confidence: searchParams.get('confidence'),
    };

    const buildingData = await getBuildingData(filters);
    const csvData = convertToCSV(buildingData);
    
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="fastfind360_export.csv"',
      },
    });
  } catch (error) {
    console.error('Failed to export data:', error);
    return new NextResponse('Failed to export data', { status: 500 });
  }
}
