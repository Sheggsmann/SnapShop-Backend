import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { storeService } from '@service/db/store.service';
import { userService } from '@service/db/user.service';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async me(req: Request, res: Response): Promise<void> {
    let user: IUserDocument | null = null;
    let store: IStoreDocument | null = null;

    user = await userService.getUserById(req.currentUser!.userId);
    store = await storeService.getStoreByStoreId(req.currentUser!.storeId!);

    if (!user && !store) {
      throw new BadRequestError('Details not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'User profile', user, store });
  }

  public async profile(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user: IUserDocument = await userService.getUserById(userId);
    if (!user) throw new NotFoundError('Account not found');

    res.status(HTTP_STATUS.OK).json({ message: 'User Profile', user });
  }

  public async savedStores(req: Request, res: Response): Promise<void> {
    const user: IUserDocument = await (
      await userService.getUserById(req.currentUser!.userId)
    ).populate('savedStores', '-owner');

    res.status(HTTP_STATUS.OK).json({ message: 'Saved stores', savedStores: user.savedStores });
  }

  public async likedProducts(req: Request, res: Response): Promise<void> {
    const user: IUserDocument = await (
      await userService.getUserById(req.currentUser!.userId)
    ).populate('likedProducts', '-locations');

    res.status(HTTP_STATUS.OK).json({ message: 'Liked products', likedProducts: user.likedProducts });
  }
}

export const getUser: Get = new Get();
