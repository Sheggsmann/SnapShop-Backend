import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { compare, hash } from 'bcryptjs';
import { Model, Schema, model } from 'mongoose';

const SALT_ROUND = 11;

const authSchema = new Schema(
  {
    uId: String,
    mobileNumber: String,
    password: String,
    passwordResetExpiresIn: Number,
    passwordResetToken: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verificationExpiersIn: Number
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  if (this.isModified('password')) {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
    this.password = hashedPassword;
  }
  next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
