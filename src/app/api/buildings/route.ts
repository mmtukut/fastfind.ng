import { NextRequest, NextResponse } from 'next/server';

const CSV_URL = 'https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(CSV_URL, { 
      // Using cache: 'force-cache' as the file is static. Can be changed if data updates frequently.
      cache: 'force-cache' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV from source: ${response.statusText}`);
    }
    
    const csvData = await response.text();

    return new NextResponse(csvData, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv'
        }
    });

  } catch (error) {
    console.error('Failed to fetch building data:', error);
    let errorMessage = 'Failed to fetch or parse building data';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(errorMessage, { status: 500 });
  }
}
