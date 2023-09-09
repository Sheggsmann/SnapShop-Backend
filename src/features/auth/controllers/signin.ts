import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { loginSchema } from '@auth/schemes/signin';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { storeService } from '@service/db/store.service';
import { userService } from '@service/db/user.service';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

class SignIn {
  private async verifyLoginDetails(mobileNumber: string, password: string): Promise<IAuthDocument> {
    const existingUser: IAuthDocument | null = await authService.getUserByPhonenumber(mobileNumber);
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) throw new BadRequestError('Invalid credentials');

    if (!existingUser.verified) throw new BadRequestError('Account not verified');
    return existingUser;
  }

  @validator(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { mobileNumber, password } = req.body;

    const authUser = await SignIn.prototype.verifyLoginDetails(mobileNumber, password);

    const user: IUserDocument = await userService.getUserByAuthId(`${authUser._id}`);

    const userJwt: string = JWT.sign(
      {
        uId: authUser.uId,
        userId: user._id,
        roles: user.roles,
        profilePicture: user.profilePicture,
        mobileNumber: authUser.mobileNumber
      },
      config.JWT_TOKEN!
    );

    res.status(HTTP_STATUS.OK).json({ message: 'User login successful', token: userJwt, user });
  }

  @validator(loginSchema)
  public async readStore(req: Request, res: Response): Promise<void> {
    const { mobileNumber, password } = req.body;
    const authUser = await SignIn.prototype.verifyLoginDetails(mobileNumber, password);

    const user: IUserDocument = await userService.getUserByAuthId(`${authUser._id}`);
    const store: IStoreDocument | null = await storeService.getStoreByUserId(`${user._id}`);

    if (!store) throw new NotFoundError('Store not found.');

    const userJwt: string = JWT.sign(
      {
        uId: user.uId,
        userId: user._id,
        storeId: store._id,
        roles: user.roles,
        profilePicture: user.profilePicture,
        mobileNumber: authUser.mobileNumber
      },
      config.JWT_TOKEN!
    );

    res.status(HTTP_STATUS.OK).json({ message: 'Store login successful', token: userJwt, user, store });
  }
}

export const siginin: SignIn = new SignIn();
