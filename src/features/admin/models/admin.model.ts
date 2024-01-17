import { IAdminDocument } from '@admin/interfaces/admin.interface';
import { Model, Schema, model } from 'mongoose';

const adminSchema: Schema = new Schema(
  {
    name: String,
    role: { type: String, unique: true },
    password: String,
    serviceChargeFromUsers: Number,
    serviceChargeFromStores: Number,
    maintenance: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const AdminModel: Model<IAdminDocument> = model<IAdminDocument>('Admin', adminSchema, 'Admin');
export { AdminModel };
