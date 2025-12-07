import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9002/api/buildings'
  : 'https://fastfind360.vercel.app/api/buildings';


async function getBuildingData(filters: any) {
  // This function fetches ALL data from the API route and then filters.
  // For very large datasets, this could be optimized by moving filtering to the API source if possible.
  const response = await fetch(API_URL);
  const csvData = await response.text();
  
  const parseResult = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  let allFeatures = parseResult.data as any[];

  let features = allFeatures;

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
    // The confidence filter is 0-100, but the property confidence is 0-1
    const minConfidence = parseFloat(filters.confidence) / 100;
    features = features.filter((feature: any) => parseFloat(feature.confidence) >= minConfidence);
  }

  return features;
}

function convertToCSV(data: any[]) {
  if (data.length === 0) {
    // Return headers even if there is no data
    const defaultHeaders = [
        "area_in_meters", "confidence", "full_plus_code", "geometry", 
        "classification", "nearRoad", "estimatedValue", "detectedAt"
    ];
     return defaultHeaders.join(',');
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
