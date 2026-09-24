import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  amount: number;
  month: string; // e.g. "2024-05"
}

const BudgetSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: String,
      required: true, // format YYYY-MM
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one budget per category per month
BudgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
