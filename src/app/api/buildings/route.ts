import { NextRequest, NextResponse } from 'next/server';
import { parseGombeBuildingsCSV } from '@/utils/csvParser';

// This URL is now only used on the server, which avoids browser CORS issues.
const CSV_URL = 'https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347';

let cachedBuildings: any[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getBuildingData() {
  const now = Date.now();
  if (cachedBuildings && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    console.log("Returning cached building data.");
    return cachedBuildings;
  }
  
  console.log("Fetching fresh building data...");
  const response = await fetch(CSV_URL, { 
    // Use a revalidation strategy instead of 'no-store' for better performance
    next: { revalidate: 3600 } 
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV from source: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  const buildings = await parseGombeBuildingsCSV(csvText);

  cachedBuildings = buildings;
  lastFetchTime = Date.now();

  console.log(`Successfully fetched and parsed ${buildings.length} buildings.`);
  return buildings;
}

export async function GET(req: NextRequest) {
  try {
    const buildings = await getBuildingData();
    const geojsonData = {
      type: 'FeatureCollection',
      features: buildings,
    };
    return NextResponse.json(geojsonData);
  } catch (error) {
    console.error('Failed to get building data in API route:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
