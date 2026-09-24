import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (body.categoryId) {
       // Validate new category
       const categoryExists = await Category.findById(body.categoryId);
       if (!categoryExists) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
       if (body.type && categoryExists.type !== body.type) {
         return NextResponse.json({ error: 'Transaction type mismatch' }, { status: 400 });
       }
       transaction.categoryId = body.categoryId;
    }

    if (body.type) transaction.type = body.type;
    if (body.amount !== undefined) transaction.amount = body.amount;
    if (body.date) transaction.date = new Date(body.date);
    if (body.note !== undefined) transaction.note = body.note;

    await transaction.save();

    return NextResponse.json({ message: 'Transaction updated successfully', transaction }, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
