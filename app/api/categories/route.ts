import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    // Fetch default categories, and if a userId is provided, fetch their custom categories too
    let query: any = { isDefault: true };
    if (userId) {
      query = { $or: [{ isDefault: true }, { userId }] };
    }
    
    const categories = await Category.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, type, color, icon, userId } = body;

    if (!name || !type || !color || !icon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      type,
      color,
      icon,
      isDefault: false,
      userId: userId || null
    });

    await newCategory.save();

    return NextResponse.json(
      { message: 'Category created successfully', category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
