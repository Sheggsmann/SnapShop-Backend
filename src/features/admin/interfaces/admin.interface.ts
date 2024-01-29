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
  email: string;
  role: keyof typeof AdminRole;
  password?: string;
  serviceChargeFromUsers?: number;
  serviceChargeFromStores?: number;
  maintenance: boolean;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}
