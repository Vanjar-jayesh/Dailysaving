import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();
    const passwordHash = await bcrypt.hash('12345678', 10);
    
    const user = await User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      {
        email: 'admin@gmail.com',
        passwordHash,
        name: 'System Admin',
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
