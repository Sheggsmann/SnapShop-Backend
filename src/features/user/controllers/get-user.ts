import { NotFoundError } from '@global/helpers/error-handler';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async me(req: Request, res: Response): Promise<void> {
    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);
    if (!user) throw new NotFoundError('Account not found');

    res.status(HTTP_STATUS.OK).json({ message: 'User profile', user });
  }

  public async profile(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user: IUserDocument = await userService.getUserById(userId);
    if (!user) throw new NotFoundError('Account not found');

    res.status(HTTP_STATUS.OK).json({ message: 'User Profile', user });
  }
}

export const getUser: Get = new Get();
