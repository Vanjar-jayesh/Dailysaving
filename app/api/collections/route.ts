import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User'; // Required to register the User schema for references
import CollectionPerson from '@/models/CollectionPerson';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const people = await CollectionPerson.find({ userId }).sort({ createdAt: -1 });

    const now = new Date();
    let hasUpdates = false;

    // Lazy Interest Evaluation
    for (const person of people) {
      if (person.interestType === 'monthly' && person.interestRate > 0 && person.pendingAmount > 0) {
        const lastApplied = person.lastInterestAppliedDate ? new Date(person.lastInterestAppliedDate) : new Date(person.startDate || person.createdAt);
        
        // Simple 30-day month calculation
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysDiff = Math.floor((now.getTime() - lastApplied.getTime()) / msPerDay);
        const monthsPassed = Math.floor(daysDiff / 30);

        if (monthsPassed >= 1) {
          // Simple interest based on current pending amount
          const interestAmount = person.pendingAmount * (person.interestRate / 100) * monthsPassed;
          
          if (interestAmount > 0) {
            person.totalAmount += interestAmount;
            person.lastInterestAppliedDate = new Date(lastApplied.getTime() + (monthsPassed * 30 * msPerDay));
            await person.save();
            hasUpdates = true;
          }
        }
      }
    }

    // If we updated any interest, re-sort or just return the modified objects.
    // The objects in memory (`people`) are already updated.

    return NextResponse.json({ collections: people }, { status: 200 });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, totalAmount, interestRate, interestType, startDate } = body;

    if (!userId || !name || totalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newPerson = new CollectionPerson({
      userId,
      name,
      totalAmount,
      paidAmount: 0,
      interestRate: interestRate || 0,
      interestType: interestType || 'none',
      startDate: startDate ? new Date(startDate) : new Date(),
      lastInterestAppliedDate: startDate ? new Date(startDate) : new Date()
      // pendingAmount is auto-calculated by pre-save hook
    });

    await newPerson.save();

    return NextResponse.json(
      { message: 'Person added successfully', collection: newPerson },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating collection person:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
