import { NextRequest, NextResponse } from 'next/server';

async function getBuildingData(filters: any) {
  const response = await fetch(process.env.NODE_ENV === 'production' 
    ? 'http://localhost:9002/api/buildings' // Use the internal API route
    : 'http://localhost:9002/api/buildings'
  );
  const geojsonData = await response.json();
  
  let features = geojsonData.features;

  if (filters.types) {
    const types = filters.types.split(',');
    features = features.filter((feature: any) => types.includes(feature.properties.type));
  }

  if (filters.minSize || filters.maxSize) {
    const minSize = parseFloat(filters.minSize || '0');
    const maxSize = parseFloat(filters.maxSize || 'Infinity');
    features = features.filter((feature: any) => 
        feature.properties.area_in_meters >= minSize && feature.properties.area_in_meters <= maxSize
    );
  }

  if (filters.confidence) {
    // The confidence filter is 0-100, but the property confidence is 0-1
    const minConfidence = parseFloat(filters.confidence) / 100;
    features = features.filter((feature: any) => feature.properties.confidence >= minConfidence);
  }

  return features.map((feature: any) => feature.properties);
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
        // Handle values that contain commas by wrapping them in quotes
        const stringValue = String(value === null || value === undefined ? '' : value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
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
