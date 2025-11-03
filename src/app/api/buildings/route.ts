import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_open_buildings.geojson?alt=media&token=e67162b2-8f10-405c-9770-bb61f4934fa9', { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch building data:', error);
    return new NextResponse('Failed to fetch building data', { status: 500 });
  }
}
