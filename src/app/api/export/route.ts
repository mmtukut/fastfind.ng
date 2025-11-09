import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder for your actual data fetching and filtering logic.
// In a real app, you would get the data and apply filters similar to the frontend.
async function getBuildingData() {
  // In a real scenario, you'd fetch and filter this data.
  // For this example, we'll just use the small sample.
  const path = require('path');
  const fs = require('fs').promises;
  const filePath = path.join(process.cwd(), 'public', 'data', 'buildings', 'gombe_buildings.geojson');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const geojsonData = JSON.parse(fileContent);
  return geojsonData.features.map((feature: any) => feature.properties);
}

function convertToCSV(data: any[]) {
  if (data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => JSON.stringify(row[header], (key, value) => value === null ? '' : value))
      .join(',')
    )
  ];
  return csvRows.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const buildingData = await getBuildingData();
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
