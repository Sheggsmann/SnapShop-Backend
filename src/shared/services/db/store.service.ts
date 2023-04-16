import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { StoreModel } from '@store/models/store.model';
import { Role } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.model';
import { UpdateQuery } from 'mongoose';

class StoreService {
  public async addStoreToDB(userId: string, store: IStoreDocument): Promise<void> {
    const createdStore: Promise<IStoreDocument> = StoreModel.create(store);
    const user: UpdateQuery<IStoreDocument> = UserModel.updateOne(
      { _id: userId },
      { $inc: { storeCount: 1 }, $push: { roles: Role.StoreOwner } }
    );

    await Promise.all([createdStore, user]);
  }

  public async getStoreByName(name: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ name });
  }

  public async getStoreByUserId(userId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ owner: userId });
  }

  public async getNearbyStores(
    searchParam: RegExp,
    latitude: number,
    longitude: number,
    radius: number,
    minPrice: number,
    maxPrice: number
  ): Promise<IProductDocument[]> {
    const products: IProductDocument[] = await ProductModel.aggregate([
      { $match: { name: searchParam } },
      { $match: { $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }] } },
      { $lookup: { from: 'Store', localField: 'store', foreignField: '_id', as: 'store' } },
      { $unwind: '$store' },
      {
        $match: {
          'store.locations.location': { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
        }
      },
      { $limit: 1000 }
    ]);
    return products;
  }
}

export const storeService: StoreService = new StoreService();
