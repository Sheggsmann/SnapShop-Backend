import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { IStoreDocument, IStoreWithCategories } from '@store/interfaces/store.interface';
import { StoreModel } from '@store/models/store.model';
import { IUserDocument, Role } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.model';
import { Types, UpdateQuery } from 'mongoose';
import { Helpers } from '@global/helpers/helpers';

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
    const stores: IStoreDocument[] = await StoreModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return stores;
  }

  public async getStoresCount(): Promise<number> {
    return await StoreModel.countDocuments({});
  }

  public async getStoreByName(name: string): Promise<IStoreDocument | null> {
    return (await StoreModel.findOne({ name }).select('name image verified')) as IStoreDocument;
  }

  public async getStoreByUserId(userId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ owner: userId });
  }

  public async getStoreByStoreId(storeId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ _id: storeId });
  }

  public async getNearbyStores(
    searchParam: string,
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<IProductDocument[]> {
    searchParam = Helpers.escapeRegExp(`${searchParam}`);
    const products: IProductDocument[] = await ProductModel.aggregate([
      {
        $search: {
          index: 'searchProducts',
          compound: {
            should: [
              {
                text: {
                  query: searchParam,
                  path: 'name',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                  score: { boost: { value: 100 } }
                }
              },
              {
                text: {
                  query: searchParam,
                  path: 'tags',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                  score: { boost: { value: 400 } }
                }
              },
              {
                text: {
                  query: searchParam,
                  path: 'description',
                  fuzzy: { maxEdits: 1 },
                  score: { boost: { value: 100 } }
                }
              }
            ]
          }
        }
      },
      { $limit: 50 },
      {
        $lookup: {
          from: 'Store',
          localField: 'store',
          foreignField: '_id',
          as: 'store'
        }
      },
      { $unwind: '$store' },
      {
        $match: {
          'store.locations.location': { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          store: 1,
          price: 1,
          priceDiscount: 1,
          quantity: 1,
          images: 1,
          videos: 1,
          tags: 1,
          productsCount: 1,
          score: { $meta: 'searchScore' }
        }
      }
    ]);

    const productsWithDistance: IProductDocument[] = products.map((product) => {
      const storeLocation: number[] = (product.store as IStoreDocument).locations[0].location.coordinates;
      const distance = Helpers.calculateDistance(latitude, longitude, storeLocation[1], storeLocation[0]);

      return {
        ...product,
        distance: distance.toFixed(2)
      } as unknown as IProductDocument;
    });

    return productsWithDistance;
  }

  public async getStoreProductsByCategory(storeId: string): Promise<IStoreWithCategories[]> {
    const products = await ProductModel.aggregate([
      { $match: { store: new Types.ObjectId(storeId) } },
      { $group: { _id: '$category', products: { $push: '$$ROOT' } } }
    ]);
    return products as IStoreWithCategories[];
  }

  public async getClosestStores(location: [number, number], limit: number): Promise<IStoreDocument[]> {
    const closestStores: IStoreDocument[] = await StoreModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [location[0], location[1]]
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 100000 // Maximum distance in meter
        }
      },
      { $limit: limit }
    ]);

    return closestStores;
  }

  public async updateStore(storeId: string, updatedStore: Partial<IStoreDocument>): Promise<void> {
    await StoreModel.updateOne({ _id: storeId }, { $set: updatedStore });
  }

  public async updateStoreEscrowBalance(storeId: string, balance: number): Promise<void> {
    if (Number(balance) > 0) {
      await StoreModel.updateOne({ _id: storeId }, { $inc: { escrowBalance: Number(balance) } });
    }
  }

  public async saveStoreSlug(storeId: string, slug: string): Promise<void> {
    await StoreModel.updateOne({ _id: storeId }, { $set: { slug } });
  }

  public async getStoreBySlug(slug: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ slug });
  }
}

export const storeService: StoreService = new StoreService();
