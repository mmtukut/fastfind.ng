import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

// This function now fetches the fully processed GeoJSON data from our own API route.
async function getBuildingData(apiUrl: string, filters: any) {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data from buildings API route");
  }
  const geojsonData = await response.json();
  let allFeatures = geojsonData.features.map((feature: any) => feature.properties);

  let features = allFeatures;

  // Apply filters on the server before creating the CSV
  if (filters.types) {
    const types = filters.types.split(',');
    features = features.filter((feature: any) => types.includes(feature.classification));
  }

  if (filters.minSize || filters.maxSize) {
    const minSize = parseFloat(filters.minSize || '0');
    const maxSize = parseFloat(filters.maxSize || 'Infinity');
    features = features.filter((feature: any) => {
        const area = parseFloat(feature.area_in_meters);
        return area >= minSize && area <= maxSize;
    });
  }

  if (filters.confidence) {
    const minConfidence = parseFloat(filters.confidence) / 100;
    features = features.filter((feature: any) => parseFloat(feature.confidence) >= minConfidence);
  }

  return features;
}

function convertToCSV(data: any[]) {
  if (data.length === 0) {
    const defaultHeaders = [
        "id", "area_in_meters", "confidence", "classification", 
        "estimatedValue", "detectedAt"
    ];
    return defaultHeaders.join(',');
  }
  // Use a predefined set of headers to ensure consistency
  const headers = [
    "id", "area_in_meters", "confidence", "classification", 
    "estimatedValue", "detectedAt"
  ];
  const csv = Papa.unparse({
    fields: headers,
    data: data,
  });
  return csv;
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

    // Construct the absolute URL for the API call
    const apiUrl = new URL('/api/buildings', req.url).toString();

    const buildingData = await getBuildingData(apiUrl, filters);
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
