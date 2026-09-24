import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // In a real app, verify user owns this category via JWT
    const { id } = await params;
    const body = await req.json();
    const { name, type, color, icon } = body;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.isDefault) {
      return NextResponse.json({ error: 'Cannot modify default categories' }, { status: 403 });
    }

    if (name) category.name = name;
    if (type) category.type = type;
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    return NextResponse.json({ message: 'Category updated successfully', category }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // In a real app, verify user owns this category via JWT
    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.isDefault) {
      return NextResponse.json({ error: 'Cannot delete default categories' }, { status: 403 });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
