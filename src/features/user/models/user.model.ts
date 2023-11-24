import { IUserDocument, Role } from '@user/interfaces/user.interface';
import { Model, Schema, Types, model } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    authId: { type: Types.ObjectId, ref: 'Auth', index: true },
    firstname: String,
    lastname: String,
    email: String,
    source: String,
    roles: { type: [], default: [Role.User] },
    savedStores: [{ type: Types.ObjectId, ref: 'Store' }],
    likedProducts: [{ type: Types.ObjectId, ref: 'Product' }],
    profilePicture: { type: String, default: '' },
    deliveryAddresses: [],
    notifications: {
      messages: { type: Boolean, default: true }
    },
    storeCount: { type: Number, default: 0 },
    expoPushToken: String
  },
  {
    timestamps: true,
    minimize: false
  }
);

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
