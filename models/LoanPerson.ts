import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILoanPerson extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  totalBorrowed: number;
  amountRepaid: number;
  pendingBalance: number;
}

const LoanPersonSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalBorrowed: {
      type: Number,
      required: true,
      default: 0,
    },
    amountRepaid: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingBalance: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to automatically calculate pendingBalance
LoanPersonSchema.pre<ILoanPerson>('save', function () {
  this.pendingBalance = this.totalBorrowed - this.amountRepaid;
});

// Prevent Mongoose from caching the old schema in development
if (mongoose.models.LoanPerson) {
  delete mongoose.models.LoanPerson;
}

const LoanPerson: Model<ILoanPerson> = mongoose.model<ILoanPerson>('LoanPerson', LoanPersonSchema);

export default LoanPerson;
