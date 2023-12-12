import { Model, Schema, Types, model } from 'mongoose';
import { ITransactionDocument, TransactionType } from '@transactions/interfaces/transaction.interface';

const transactionsSchema: Schema = new Schema(
  {
    store: { type: Types.ObjectId, ref: 'Store' },
    user: { type: Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        TransactionType.ORDER_PAYMENT,
        TransactionType.WITHDRAWAL,
        TransactionType.DEPOSIT,
        TransactionType.REFUND
      ],
      required: true
    },
    order: { type: Types.ObjectId, ref: 'Order' }
  },
  { timestamps: true }
);

const TransactionsModel: Model<ITransactionDocument> = model<ITransactionDocument>(
  'Transactions',
  transactionsSchema,
  'Transactions'
);

export { TransactionsModel };
