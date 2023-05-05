import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthUserPayload;
      headers: {
        authorization: string;
      };
    }
  }
}

export interface AuthUserPayload {
  uId: string;
  userId: string;
  storeId?: string;
  mobileNumber: string;
  roles: string[];
  iat?: number;
}

export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  mobileNumber: string;
  verified: boolean;
  password?: string;
  createdAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresIn?: string | number;
  verificationToken?: string;
  verificationExpiersIn?: string | number;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  mobileNumber: string;
  firstname: string;
  lastname: string;
}

export interface IAuthJob {
  value: IAuthDocument;
}
