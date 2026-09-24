import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Category from '@/models/Category';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month'); // YYYY-MM
    
    if (!userId || !month) {
      return NextResponse.json({ error: 'userId and month are required' }, { status: 400 });
    }
    
    // Fetch budgets for the user and month, populate the category details
    const budgets = await Budget.find({ userId, month }).populate({
      path: 'categoryId',
      model: Category,
      select: 'name icon color type'
    });

    return NextResponse.json({ budgets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { userId, categoryId, amount, month } = body;

    if (!userId || !categoryId || amount === undefined || !month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 0) {
      return NextResponse.json({ error: 'Amount cannot be negative' }, { status: 400 });
    }

    // Upsert logic: if a budget exists for this category and month, update it, else create
    const budget = await Budget.findOneAndUpdate(
      { userId, categoryId, month },
      { amount },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate({
      path: 'categoryId',
      model: Category,
      select: 'name icon color type'
    });

    return NextResponse.json(
      { message: 'Budget saved successfully', budget },
      { status: 200 } // Technically 200 for update, 201 for create, but 200 is fine for upsert
    );
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
