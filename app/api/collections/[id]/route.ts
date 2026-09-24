import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User'; // Required to register the User schema for references
import CollectionPerson from '@/models/CollectionPerson';
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';

// Helper to extract id from params since Next.js app router passes it in the context
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { paidAmount, addTotalAmount } = body;

    if (paidAmount === undefined && addTotalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required field' }, { status: 400 });
    }

    await connectToDatabase();

    const person = await CollectionPerson.findById(id);
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Scenario 1: Updating the Paid Amount (Receiving Money)
    if (paidAmount !== undefined) {
      const paymentDifference = paidAmount - person.paidAmount;
      person.paidAmount = paidAmount;
      await person.save();

      if (paymentDifference > 0) {
        let collectionCategory = await Category.findOne({ name: 'Collections', type: 'income', userId: person.userId });
        if (!collectionCategory) {
          collectionCategory = await Category.findOne({ name: 'Collections', type: 'income' });
          if (!collectionCategory) {
            collectionCategory = new Category({ name: 'Collections', type: 'income', icon: 'people-outline', color: '#10b981', userId: person.userId });
            await collectionCategory.save();
          }
        }
        const newTransaction = new Transaction({
          categoryId: collectionCategory._id, type: 'income', amount: paymentDifference, date: new Date(), note: `Collection from ${person.name}`
        });
        await newTransaction.save();
      }
    }

    // Scenario 2: Adding to the Total Debt (Lending More Money)
    if (addTotalAmount !== undefined && addTotalAmount > 0) {
      person.totalAmount += addTotalAmount;
      await person.save();

      let debtCategory = await Category.findOne({ name: 'Lent Money', type: 'expense', userId: person.userId });
      if (!debtCategory) {
        debtCategory = await Category.findOne({ name: 'Lent Money', type: 'expense' });
        if (!debtCategory) {
          debtCategory = new Category({ name: 'Lent Money', type: 'expense', icon: 'cash-outline', color: '#ef4444', userId: person.userId });
          await debtCategory.save();
        }
      }
      const newTransaction = new Transaction({
        categoryId: debtCategory._id, type: 'expense', amount: addTotalAmount, date: new Date(), note: `Lent to ${person.name}`
      });
      await newTransaction.save();
    }

    return NextResponse.json(
      { message: 'Update successful', collection: person },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const deletedPerson = await CollectionPerson.findByIdAndDelete(id);
    
    if (!deletedPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { message: 'Person deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
