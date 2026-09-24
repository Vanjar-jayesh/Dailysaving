import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User'; // Register the User schema for references
import LoanPerson from '@/models/LoanPerson';
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';

// Helper to extract id from params since Next.js app router passes it in the context
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amountRepaid, addTotalBorrowed } = body;

    if (amountRepaid === undefined && addTotalBorrowed === undefined) {
      return NextResponse.json({ error: 'Missing required field' }, { status: 400 });
    }

    await connectToDatabase();

    const person = await LoanPerson.findById(id);
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Scenario 1: Repaying the Loan (Paying Money Out -> Expense)
    if (amountRepaid !== undefined) {
      const repaymentDifference = amountRepaid - person.amountRepaid;
      person.amountRepaid = amountRepaid;
      await person.save();

      if (repaymentDifference > 0) {
        let repaymentCategory = await Category.findOne({ name: 'Loan Repayment', type: 'expense', userId: person.userId });
        if (!repaymentCategory) {
          repaymentCategory = await Category.findOne({ name: 'Loan Repayment', type: 'expense' });
          if (!repaymentCategory) {
            repaymentCategory = new Category({ name: 'Loan Repayment', type: 'expense', icon: 'wallet-outline', color: '#ef4444', userId: person.userId });
            await repaymentCategory.save();
          }
        }
        const newTransaction = new Transaction({
          categoryId: repaymentCategory._id, type: 'expense', amount: repaymentDifference, date: new Date(), note: `Repaid to ${person.name}`
        });
        await newTransaction.save();
      }
    }

    // Scenario 2: Borrowing More Money (Taking Money In -> Income)
    if (addTotalBorrowed !== undefined && addTotalBorrowed > 0) {
      person.totalBorrowed += addTotalBorrowed;
      await person.save();

      let borrowingCategory = await Category.findOne({ name: 'Borrowed Money', type: 'income', userId: person.userId });
      if (!borrowingCategory) {
        borrowingCategory = await Category.findOne({ name: 'Borrowed Money', type: 'income' });
        if (!borrowingCategory) {
          borrowingCategory = new Category({ name: 'Borrowed Money', type: 'income', icon: 'cash-outline', color: '#10b981', userId: person.userId });
          await borrowingCategory.save();
        }
      }
      const newTransaction = new Transaction({
        categoryId: borrowingCategory._id, type: 'income', amount: addTotalBorrowed, date: new Date(), note: `Borrowed from ${person.name}`
      });
      await newTransaction.save();
    }

    return NextResponse.json(
      { message: 'Update successful', loan: person },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating loan:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const deletedPerson = await LoanPerson.findByIdAndDelete(id);
    
    if (!deletedPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { message: 'Person deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting loan:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
