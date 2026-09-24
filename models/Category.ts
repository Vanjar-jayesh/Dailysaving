import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
}

const CategorySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Nullable for system-wide default categories
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: '#3b82f6', // Default blue
    },
    icon: {
      type: String,
      required: true,
      default: 'list-outline',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
