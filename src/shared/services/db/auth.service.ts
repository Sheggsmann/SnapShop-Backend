import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.model';

class AuthService {
  public async getUserByPhonenumber(mobileNumber: string): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({ mobileNumber });
  }

  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async getAuthUserByOtp(otp: string, mobileNumber: string): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({
      mobileNumber,
      verificationToken: otp,
      verificationExpiersIn: { $gte: Date.now() }
    });
  }

  public async updatePasswordToken(authId: string, otp: string, otpExpiration: number): Promise<void> {
    await AuthModel.updateOne(
      { _id: authId },
      {
        passwordResetToken: otp,
        passwordResetExpiresIn: otpExpiration
      }
    );
  }

  public async getAuthUserByPasswordToken(
    mobileNumber: string,
    passwordToken: string
  ): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({
      mobileNumber,
      passwordResetToken: passwordToken,
      passwordResetExpiresIn: { $gte: Date.now() }
    });
  }
}

export const authService: AuthService = new AuthService();
