import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { authService } from '@service/db/auth.service';
import { ObjectId } from 'mongodb';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { Helpers } from '@global/helpers/helpers';
import { config } from '@root/config';
import { resendOtpSchema, signupSchema, verifyAccountSchema } from '@auth/schemes/signup';
import { smsTransport } from '@service/sms/sms.transport';
import { IUserDocument, Role } from '@user/interfaces/user.interface';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';

export const OTP_EXPIRES_IN = 5 * 60 * 1000;

class SignUp {
  @validator(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { mobileNumber, password, firstname, lastname, otpProvider } = req.body;

    // If the user exists, send an otp to the user
    const userExists = await authService.getUserByPhonenumber(mobileNumber);
    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.genrateRandomIntegers(12)}`;

    // TODO: Generate 4 digit OTP
    const otp = `${Helpers.generateOtp(4)}`;

    const authData: IAuthDocument = {
      _id: authObjectId,
      verified: false,
      verificationExpiersIn: Date.now() + OTP_EXPIRES_IN,
      verificationToken: otp,
      uId,
      mobileNumber,
      password
    } as IAuthDocument;

    // TODO: Create User
    const userData: IUserDocument = {
      _id: userObjectId,
      authId: authObjectId,
      firstname,
      lastname,
      mobileNumber,
      password,
      profilePicture: '',
      role: [Role.User],
      savedStores: [],
      likedStores: [],
      deliveryAddresses: [],
      notifications: {
        messages: true
      }
    } as unknown as IUserDocument;

    // TODO:  Add to redis cache

    // TODO: Save to database
    authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
    userQueue.addUserToDB('addUserToDB', { value: userData });

    // TODO: Send OTP to user via otp method
    await smsTransport.sendSms(mobileNumber, `SnapShop Otp: ${otp}`, otpProvider);

    const authDataClone = { ...authData };
    delete authDataClone.password;
    const authToken: string = JWT.sign({ authDataClone }, config.JWT_TOKEN!);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Account created', token: authToken });
  }

  public async exists(req: Request, res: Response): Promise<void> {
    const { mobileNumber } = req.body;

    const userExists = await authService.getUserByPhonenumber(mobileNumber);
    if (userExists) throw new BadRequestError('Mobile number already in use.');

    res.status(HTTP_STATUS.OK).json({ message: 'Not in use' });
  }

  @validator(verifyAccountSchema)
  public async verifyAccount(req: Request, res: Response): Promise<void> {
    const { mobileNumber, otp } = req.body;

    const user: IAuthDocument | null = await authService.getAuthUserByOtp(otp, mobileNumber);
    if (!user) throw new BadRequestError('Otp is invalid');

    if (user.verified) throw new BadRequestError('User already verified');

    user.verified = true;
    user.verificationExpiersIn = 0;
    user.verificationToken = '';

    await user.save();

    res.status(HTTP_STATUS.OK).json({ message: 'Account verified successfully' });
  }

  @validator(resendOtpSchema)
  public async resendOtp(req: Request, res: Response): Promise<void> {
    const { mobileNumber, otpProvider } = req.body;

    const user: IAuthDocument | null = await authService.getUserByPhonenumber(mobileNumber);
    if (!user) throw new NotFoundError('User not found');

    if (user.verified) throw new BadRequestError('User already verified');

    const otp = `${Helpers.generateOtp(4)}`;

    user.verificationToken = otp;
    user.verificationExpiersIn = Date.now() + OTP_EXPIRES_IN;
    await user.save();

    await smsTransport.sendSms(mobileNumber, `SnapShop Otp: ${otp}`, otpProvider);
    res.status(HTTP_STATUS.OK).json({ message: 'Otp resent successfully' });
  }
}

export const signup: SignUp = new SignUp();
