import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AppVersion from '@/models/AppVersion';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch the single most recent version based on creation date or version code
    const latestVersion = await AppVersion.findOne().sort({ versionCode: -1 });

    if (!latestVersion) {
      return NextResponse.json({ message: 'No version info available' }, { status: 404 });
    }

    return NextResponse.json({ version: latestVersion }, { status: 200 });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
