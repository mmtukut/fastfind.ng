// This file is no longer used for data fetching as it's done client-side.
// It can be removed or kept for future server-side processing needs.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "This endpoint is not in active use. Data is fetched client-side." });
}
