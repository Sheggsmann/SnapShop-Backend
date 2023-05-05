import { IProductDocument } from '@product/interfaces/product.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface ICartItem {
  product: string | ObjectId | IProductDocument;
  quantity: number;
}

export interface IOrderDocument extends Document {
  _id: string | ObjectId;
  store: string | ObjectId;
  user: {
    userId: string | ObjectId;
    name: string;
    mobileNumber: string;
  };

  products: ICartItem[];
  amount: number;

  status: OrderStatus.PENDING | OrderStatus.ACTIVE | OrderStatus.DELIVERED | OrderStatus.CANCELLED;
  paid: boolean;

  deliveryFee?: number;
  deliveryCode?: string;

  reason?: string;

  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
  };

  createdAt?: Date;
  cancelledAt?: Date;
}

export interface IOrderJob {
  key?: string;
  value: IOrderDocument;
}