import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User'; // Register the User schema for references
import LoanPerson from '@/models/LoanPerson';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const loans = await LoanPerson.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ loans }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, totalBorrowed } = body;

    if (!userId || !name || totalBorrowed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newLoanPerson = new LoanPerson({
      userId,
      name,
      totalBorrowed,
      amountRepaid: 0,
      // pendingBalance is auto-calculated by pre-save hook
    });

    await newLoanPerson.save();

    return NextResponse.json(
      { message: 'Loan person added successfully', loan: newLoanPerson },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating loan person:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
