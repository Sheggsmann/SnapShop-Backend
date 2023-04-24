import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { IStoreDocument, IStoreWithCategories } from '@store/interfaces/store.interface';
import { StoreModel } from '@store/models/store.model';
import { IUserDocument, Role } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.model';
import { ObjectId } from 'mongodb';
import { UpdateQuery } from 'mongoose';

class StoreService {
  public async addStoreToDB(userId: string, store: IStoreDocument): Promise<void> {
    const createdStore: Promise<IStoreDocument> = StoreModel.create(store);
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne(
      { _id: userId },
      { $inc: { storeCount: 1 }, $push: { roles: Role.StoreOwner } }
    );

    await Promise.all([createdStore, user]);
  }

  public async getStores(skip: number, limit: number): Promise<IStoreDocument[]> {
    const stores: IStoreDocument[] = await StoreModel.find({}).skip(skip).limit(limit);
    return stores;
  }

  public async getStoreByName(name: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ name });
  }

  public async getStoreByUserId(userId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ owner: userId });
  }

  public async getStoreByStoreId(storeId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ _id: storeId });
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

  public async getStoreProductsByCategory(storeId: string): Promise<IStoreWithCategories[]> {
    const products = await ProductModel.aggregate([
      { $match: { store: new ObjectId(storeId) } },
      { $group: { _id: '$category', products: { $push: '$$ROOT' } } }
    ]);
    return products as IStoreWithCategories[];
  }

  public async updateStore(storeId: string, updatedStore: IStoreDocument): Promise<void> {
    await StoreModel.updateOne({ _id: storeId }, { $set: updatedStore });
  }
}

export const storeService: StoreService = new StoreService();
