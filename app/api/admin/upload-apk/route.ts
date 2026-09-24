import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AppVersion from '@/models/AppVersion';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const versionName = formData.get('versionName') as string;
    const versionCodeStr = formData.get('versionCode') as string;
    const releaseNotes = formData.get('releaseNotes') as string;
    const isMandatory = formData.get('isMandatory') === 'true';
    const apkFile = formData.get('apk') as File;

    if (!versionName || !versionCodeStr || !apkFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const versionCode = parseInt(versionCodeStr, 10);

    // Ensure public/apk directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'apk');
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename and construct path
    const fileName = `DailySave-v${versionName}-${Date.now()}.apk`;
    const filePath = path.join(uploadDir, fileName);

    // Convert File to Buffer and write
    const arrayBuffer = await apkFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const apkUrl = `/apk/${fileName}`; // Public URL relative path

    const newVersion = new AppVersion({
      versionName,
      versionCode,
      apkUrl,
      releaseNotes,
      isMandatory,
    });

    await newVersion.save();

    return NextResponse.json({ message: 'APK uploaded successfully', version: newVersion }, { status: 201 });
  } catch (error) {
    console.error('Error uploading APK:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
