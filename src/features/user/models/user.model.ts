import { IUserDocument, Role } from '@user/interfaces/user.interface';
import { Model, Schema, Types, model } from 'mongoose';

const userSchema: Schema = new Schema({
  authId: { type: Types.ObjectId, ref: 'Auth', index: true },
  firstname: String,
  lastname: String,
  email: String,
  role: { type: [], default: [Role.User] },
  savedStores: [{ type: Types.ObjectId, ref: 'Store' }],
  likedStores: [{ type: Types.ObjectId, ref: 'Store' }],
  profilePicture: { type: String, default: '' },
  deliveryAddresses: [],
  notifications: {
    messages: { type: Boolean, default: true }
  },
  store: { type: Types.ObjectId }
});

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
