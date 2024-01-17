import { IProductDocument } from '@product/interfaces/product.interface';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DISPUTE = 'dispute'
}

export interface ICartItem {
  product: string | ObjectId | IProductDocument;
  quantity: number;
}

export interface IOrderDocument extends Document {
  _id: string | ObjectId;
  store: string | ObjectId | IStoreDocument;
  user: {
    userId: string | ObjectId;
    name: string;
    mobileNumber: string;
  };

  products: ICartItem[];
  amount: number;

  status:
    | OrderStatus.PENDING
    | OrderStatus.ACTIVE
    | OrderStatus.DELIVERED
    | OrderStatus.CANCELLED
    | OrderStatus.COMPLETED
    | OrderStatus.DISPUTE;
  paid: boolean;
  amountPaid: number;

  serviceFee: number;
  deliveryFee?: number;
  deliveryCode?: string;

  reason?: string;

  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
  };

  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date | number;
  paidAt: Date;
  paymentProcessor: string;
}

export interface IOrderData {
  _id: string | ObjectId;
  products: ICartItem[];
  amount: number;
  status: OrderStatus.PENDING | OrderStatus.ACTIVE | OrderStatus.DELIVERED | OrderStatus.CANCELLED;
}

export interface IOrderJob {
  key?: string;
  value?: IOrderDocument;
}
