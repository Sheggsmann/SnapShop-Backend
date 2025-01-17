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
const PAGE_SIZE = 50;

class Get {
  public async me(req: Request, res: Response): Promise<void> {
    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);
    if (!user) {
      throw new BadRequestError('Details not found');
    }
    res.status(HTTP_STATUS.OK).json({ message: 'User profile', user });
  }

  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const users: IUserDocument[] = await userService.getUsers(skip, limit);
    const usersCount: number = await userService.getUsersCount();

    res.status(HTTP_STATUS.OK).json({ message: 'Users', users, usersCount });
  }

  public async guestFeed(req: Request, res: Response): Promise<void> {
    if (!req.query.latitude || !req.query.longitude)
      throw new BadRequestError('Latitude and Longitude are required');

    const lat = parseFloat(req.query.latitude as string);
    const long = parseFloat(req.query.longitude as string);

    const feedData: IFeed[] = [];

    const newArrivals: IProductDocument[] = await productService.getNewArrivals();
    const featuredStores: IStoreDocument[] = await storeService.getFeaturedStores();
    const frequentlyPurchasedProducts: IProductDocument[] =
      await productService.getFrequentlyPurchasedProductsNearUser([long, lat], 10);
    // const closestStores: IStoreDocument[] = await storeService.getClosestStores([long, lat], 10);

    feedData.push({
      title: 'New Arrivals',
      subtitle: 'Now In Stock: New Additions!',
      content: newArrivals,
      contentType: 'product'
    });

    feedData.push({
      title: 'Features Stores',
      subtitle: 'Top Ranking',
      content: featuredStores,
      contentType: 'store'
    });

    feedData.push({
      title: 'Frequently purchased',
      subtitle: 'Based on your location',
      content: frequentlyPurchasedProducts,
      contentType: 'product'
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Feed', feed: feedData });
  }

  public async feed(req: Request, res: Response): Promise<void> {
    if (!req.query.latitude || !req.query.longitude)
      throw new BadRequestError('Latitude and Longitude are required');

    const lat = parseFloat(req.query.latitude as string);
    const long = parseFloat(req.query.longitude as string);

    const feedData: IFeed[] = [];

    // Check if data exists in cache
    const cachedData = await feedCache.getFeedData(req.currentUser!.userId);

    if (cachedData && cachedData[0]['content'].length > 0) {
      res.status(HTTP_STATUS.OK).json({ message: 'Feed', feed: cachedData });
    } else {
      const newArrivals: IProductDocument[] = await productService.getNewArrivals();
      const featuredStores: IStoreDocument[] = await storeService.getFeaturedStores();
      const frequentlyPurchasedProducts: IProductDocument[] =
        await productService.getFrequentlyPurchasedProductsNearUser([long, lat], 10);
      // const closestStores: IStoreDocument[] = await storeService.getClosestStores([long, lat], 10);

      feedData.push({
        title: 'New Arrivals',
        subtitle: 'Now In Stock: New Additions!',
        content: newArrivals,
        contentType: 'product'
      });

      feedData.push({
        title: 'Featured Stores',
        subtitle: 'Top ranking',
        content: featuredStores,
        contentType: 'store'
      });

      feedData.push({
        title: 'Frequently purchased',
        subtitle: 'Based on your location',
        content: frequentlyPurchasedProducts,
        contentType: 'product'
      });

      if (feedData.length) {
        await feedCache.saveFeedDataToCache(req.currentUser!.userId, feedData);
      }

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
    const user = await (
      await (await userService.getUserById(req.currentUser!.userId)).populate('likedProducts', '-locations')
    ).populate('likedProducts.store', '_id name image bgImage');

    res.status(HTTP_STATUS.OK).json({ message: 'Liked products', likedProducts: user.likedProducts });
  }
}

export const getUser: Get = new Get();
