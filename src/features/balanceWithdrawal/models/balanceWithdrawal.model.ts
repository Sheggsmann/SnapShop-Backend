import {
  IBalanceWithdrawalDocument,
  balanceWithdrawalStatus
} from '../interfaces/balanceWithdrawal.interface';
import { Model, Schema, Types, model } from 'mongoose';

const balanceWithdrawalSchema: Schema = new Schema(
  {
    amount: { type: Number, min: 0, max: 1000000 },
    store: { type: Types.ObjectId, ref: 'Store', index: true },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    status: {
      type: String,
      enum: [
        balanceWithdrawalStatus.PENDING,
        balanceWithdrawalStatus.COMPLETED,
        balanceWithdrawalStatus.DECLINED
      ],
      default: balanceWithdrawalStatus.PENDING
    }
  },
  { timestamps: true }
);

const BalanceWithdrawalModel: Model<IBalanceWithdrawalDocument> = model<IBalanceWithdrawalDocument>(
  'BalanceWithdrawal',
  balanceWithdrawalSchema,
  'BalanceWithdrawal'
);
export { BalanceWithdrawalModel };
