import { NextRequest, NextResponse } from 'next/server';

const { 
  GOOGLE_CLOUD_PROJECT_ID, 
  VERTEX_AI_ENDPOINT_ID, 
  VERTEX_AI_LOCATION,
  GOOGLE_CLOUD_API_KEY
} = process.env;

if (!GOOGLE_CLOUD_PROJECT_ID || !VERTEX_AI_ENDPOINT_ID || !VERTEX_AI_LOCATION || !GOOGLE_CLOUD_API_KEY) {
  throw new Error("Missing Google Cloud or Vertex AI environment variables");
}

const VERTEX_AI_URL = `https://${VERTEX_AI_LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/${VERTEX_AI_LOCATION}/endpoints/${VERTEX_AI_ENDPOINT_ID}:predict`;

export async function POST(req: NextRequest) {
  try {
    const { instances } = await req.json();

    if (!instances || !Array.isArray(instances)) {
      return NextResponse.json({ error: 'Invalid input format. "instances" array is required.' }, { status: 400 });
    }
    
    // Call the Vertex AI endpoint
    const vertexResponse = await fetch(VERTEX_AI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer $(gcloud auth print-access-token)`, // This will need to be a service account key in production
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_CLOUD_API_KEY
      },
      body: JSON.stringify({ instances }),
    });

    if (!vertexResponse.ok) {
      const errorBody = await vertexResponse.text();
      console.error('Vertex AI Error:', errorBody);
      return NextResponse.json({ error: 'Failed to get prediction from Vertex AI', details: errorBody }, { status: vertexResponse.status });
    }

    const predictionData = await vertexResponse.json();

    return NextResponse.json(predictionData);

  } catch (error: any) {
    console.error('Error in /api/classify:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
