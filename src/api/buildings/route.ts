import { NextResponse } from 'next/server';

function mapProperties(feature: any) {
  const properties = feature.properties;
  return {
    ...feature,
    properties: {
      id: feature.id,
      area_in_meters: properties.area_in_meters,
      // The confidence from the geojson is 0-100, the app expects 0-1
      confidence: properties.confidence ? properties.confidence / 100 : 0, 
      // The geojson uses 'classification', the app uses 'type'
      type: properties.classification || 'mixed-use',
      ...properties,
    }
  }
}

export async function GET() {
  try {
    const response = await fetch('https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_open_buildings.geojson?alt=media&token=e67162b2-8f10-405c-9770-bb61f4934fa9', { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
    }
    
    const data = await response.json();

    const mappedFeatures = {
      ...data,
      features: data.features.map(mapProperties),
    }

    return NextResponse.json(mappedFeatures);
  } catch (error) {
    console.error('Failed to fetch building data:', error);
    let errorMessage = 'Failed to fetch building data';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(errorMessage, { status: 500 });
  }
}