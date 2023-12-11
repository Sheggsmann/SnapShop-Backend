import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export enum TransactionType {
  ORDER_PAYMENT = 'order_payment',
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
  REFUND = 'refund'
}

export interface ITransactionDocument extends Document {
  _id: string | ObjectId;
  store: string | ObjectId;
  user: string | ObjectId;
  amount: number;
  type:
    | TransactionType.ORDER_PAYMENT
    | TransactionType.WITHDRAWAL
    | TransactionType.DEPOSIT
    | TransactionType.REFUND;
  order?: string | ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
