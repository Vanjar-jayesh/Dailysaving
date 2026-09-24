import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query: any = {};
    
    // In production, we'd also filter by userId from auth token or query param
    // const userId = searchParams.get('userId');
    // if (userId) query.userId = userId;
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(query)
      .populate('categoryId', 'name icon color type') // Only pull necessary fields
      .sort({ date: -1, createdAt: -1 });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { categoryId, type, amount, date, note } = body;

    if (!categoryId || !type || amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than zero' }, { status: 400 });
    }

    // Optional: Validate that the category actually exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 404 });
    }
    
    // Ensure the transaction type matches the category type
    if (categoryExists.type !== type) {
      return NextResponse.json({ error: 'Transaction type mismatch with category' }, { status: 400 });
    }

    const newTransaction = new Transaction({
      categoryId,
      type,
      amount,
      date: date ? new Date(date) : new Date(),
      note: note || '',
    });

    await newTransaction.save();

    return NextResponse.json(
      { message: 'Transaction saved successfully', transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
