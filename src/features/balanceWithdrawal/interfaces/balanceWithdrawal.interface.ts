import { IStoreDocument } from '@store/interfaces/store.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export enum balanceWithdrawalStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined'
}

export interface IBalanceWithdrawalDocument extends Document {
  _id: string | ObjectId;
  store: string | IStoreDocument;
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
  status:
    | balanceWithdrawalStatus.PENDING
    | balanceWithdrawalStatus.COMPLETED
    | balanceWithdrawalStatus.DECLINED;
}
