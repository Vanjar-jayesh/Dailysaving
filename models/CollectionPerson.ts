import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICollectionPerson extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  interestRate: number;
  interestType: 'none' | 'monthly' | 'yearly';
  lastInterestAppliedDate: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionPersonSchema: Schema = new Schema(
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
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    interestRate: {
      type: Number,
      default: 0,
    },
    interestType: {
      type: String,
      enum: ['none', 'monthly', 'yearly'],
      default: 'none',
    },
    lastInterestAppliedDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to automatically calculate pendingAmount
CollectionPersonSchema.pre<ICollectionPerson>('save', function () {
  this.pendingAmount = this.totalAmount - this.paidAmount;
});

// Prevent Mongoose from caching the old schema in development
if (mongoose.models.CollectionPerson) {
  delete mongoose.models.CollectionPerson;
}

const CollectionPerson: Model<ICollectionPerson> = mongoose.model<ICollectionPerson>('CollectionPerson', CollectionPersonSchema);

export default CollectionPerson;
