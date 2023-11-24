import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { IProductDocument } from '@product/interfaces/product.interface';
import { productService } from '@service/db/product.service';
import { storeService } from '@service/db/store.service';
import { userService } from '@service/db/user.service';
import { FeedCache } from '@service/redis/feed.cache';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IFeed, IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const feedCache: FeedCache = new FeedCache();

class Get {
  public async me(req: Request, res: Response): Promise<void> {
    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);
    if (!user) {
      throw new BadRequestError('Details not found');
    }
    res.status(HTTP_STATUS.OK).json({ message: 'User profile', user });
  }

  public async feed(req: Request, res: Response): Promise<void> {
    if (!req.query.latitude || !req.query.longitude)
      throw new BadRequestError('Latitude and Longitude are required');

    const lat = parseFloat(req.query.latitude as string);
    const long = parseFloat(req.query.longitude as string);

    const feedData: IFeed[] = [];

    // Check if data exists in cache
    const cachedData = await feedCache.getFeedData(req.currentUser!.userId);

    if (cachedData) {
      res.status(HTTP_STATUS.OK).json({ message: 'Feed', feed: cachedData });
    } else {
      const closestStores: IStoreDocument[] = await storeService.getClosestStores([long, lat], 10);
      const frequentlyPurchasedProducts: IProductDocument[] =
        await productService.getFrequentlyPurchasedProductsNearUser([long, lat], 10);

      feedData.push({
        title: 'Stores close to you',
        subtitle: 'Based on your location',
        content: closestStores
      });

      feedData.push({
        title: 'Frequently purchased',
        subtitle: 'Close to you',
        content: frequentlyPurchasedProducts
      });

      await feedCache.saveFeedDataToCache(req.currentUser!.userId, feedData);

      res.status(HTTP_STATUS.OK).json({ message: 'Feed', feed: feedData });
    }
  }

  public async auth(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user: IUserDocument = await userService.getUserById(userId);

    if (!user) {
      throw new BadRequestError('Details not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'User Auth', user });
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
