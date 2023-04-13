import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { mobileNumberSchema, passwordSchema } from '@auth/schemes/password';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { validator } from '@global/helpers/joi-validation-decorator';
import { authService } from '@service/db/auth.service';
import { Request, Response } from 'express';
import { OTP_EXPIRES_IN } from './signup';
import { smsTransport } from '@service/sms/sms.transport';
import HTTP_STATUS from 'http-status-codes';

class Password {
  @validator(mobileNumberSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { mobileNumber, otpProvider } = req.body;

    const existingUser: IAuthDocument | null = await authService.getUserByPhonenumber(mobileNumber);
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const otp = `${Helpers.generateOtp(4)}`;
    await authService.updatePasswordToken(`${existingUser._id}`, otp, Date.now() * OTP_EXPIRES_IN);

    await smsTransport.sendSms(mobileNumber, `Here is your password reset token: ${otp}`, otpProvider);

    res.status(HTTP_STATUS.OK).json({ message: 'Password reset otp sent.' });
  }

  @validator(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, otp, mobileNumber } = req.body;

    const existingUser: IAuthDocument | null = await authService.getAuthUserByPasswordToken(
      mobileNumber,
      otp
    );
    if (!existingUser) throw new BadRequestError('Reset token has expired.');

    existingUser.password = password;
    existingUser.passwordResetExpiresIn = undefined;
    existingUser.passwordResetToken = '';

    await existingUser.save();

    res.status(HTTP_STATUS.OK).json({ message: 'Password reset successfully.' });
  }
}

export const password: Password = new Password();
