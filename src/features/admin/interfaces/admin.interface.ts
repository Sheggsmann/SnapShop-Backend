import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export enum AdminRole {
  Root = 'Root',
  Manager = 'Manager',
  Service = 'Service'
}

export interface IAdminDocument extends Document {
  _id: string | ObjectId;
  name: string;
  role: keyof typeof AdminRole;
  password?: string;
  serviceChargeFromUsers?: number;
  serviceChargeFromStores?: number;
}
