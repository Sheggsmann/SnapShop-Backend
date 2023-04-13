import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { loginSchema } from '@auth/schemes/signin';
import { BadRequestError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

class SignIn {
  @validator(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { mobileNumber, password } = req.body;

    const existingUser: IAuthDocument | null = await authService.getUserByPhonenumber(mobileNumber);
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) throw new BadRequestError('Invalid credentials');

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    const userJwt: string = JWT.sign(
      {
        uId: user.uId,
        userId: user._id,
        profilePicture: user.profilePicture,
        mobileNumber: existingUser.mobileNumber
      },
      config.JWT_TOKEN!
    );

    res.status(HTTP_STATUS.OK).json({ message: 'User login successful', token: userJwt, user });
  }
}

export const siginin: SignIn = new SignIn();
