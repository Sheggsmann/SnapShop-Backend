import { IAdminDocument } from '@admin/interfaces/admin.interface';
import { hash, compare } from 'bcryptjs';
import { Model, Schema, model } from 'mongoose';

const SALT_ROUND = 11;

const adminSchema: Schema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
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

adminSchema.pre('save', async function (this: IAdminDocument, next: () => void) {
  if (this.isModified('password')) {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
    this.password = hashedPassword;
  }
  next();
});

adminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as IAdminDocument).password!;
  return compare(password, hashedPassword);
};

const AdminModel: Model<IAdminDocument> = model<IAdminDocument>('Admin', adminSchema, 'Admin');
export { AdminModel };
