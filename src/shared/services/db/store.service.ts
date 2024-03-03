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

  public async getStoreByEmail(email: string): Promise<IStoreDocument | null> {
    return (await StoreModel.findOne({ email }).select('-mainBalance -escrowBalance')) as IStoreDocument;
  }

  public async getStoreByUserId(userId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ owner: userId });
  }

  public async getStoreByStoreId(storeId: string): Promise<IStoreDocument | null> {
    return await StoreModel.findOne({ _id: storeId });
  }

  public async getProtectedStoreByStoreid(storeId: string): Promise<Partial<IStoreDocument> | null> {
    return await StoreModel.findOne({ _id: storeId }).select('-mainBalance -escrowBalance');
  }

  public async getNearbyStores(
    searchParam: string,
    latitude: number,
    longitude: number,
    radius: number,
    anywhere = false
  ): Promise<IProductDocument[]> {
    searchParam = Helpers.escapeRegExp(`${searchParam}`);
    let products: IProductDocument[] = [];

    if (anywhere) {
      products = await ProductModel.aggregate([
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
                    fuzzy: { maxEdits: 2, prefixLength: 1 },
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
        { $limit: 120 },
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
    } else {
      products = await ProductModel.aggregate([
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
                    fuzzy: { maxEdits: 2, prefixLength: 2 },
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
        { $limit: 80 },
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
    }

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

  public async getFeaturedStores(): Promise<IStoreDocument[]> {
    const featuredStores: IStoreDocument[] = await StoreModel.find({
      _id: {
        $in: [
          '65c38942a24acaa08606f879',
          '65cb9319a5eed00296967e83',
          '65bb88cd77df69b429c17179',
          '65c33804a24acaa08606f62d',
          '65bf8dc3a24acaa08606e358',
          '65b664ab89662250a9da2899',
          '656da469676d4e7bbc5b3152',
          '65bba66677df69b429c171bd',
          '65a824ba3b58d98511079fe4',
          '65b4eb8d89662250a9da1fa4',
          '65c3325da24acaa08606f5c5',
          '65c2c6c2a24acaa08606f4ba',
          '65bf8e40a24acaa08606e372',
          '65bf75d0a24acaa08606e151',
          '65bdbe1577df69b429c1791f',
          '65bb7ec177df69b429c1714f',
          '65b95e5a77df69b429c16596',
          '65b77e5989662250a9da2d3b',
          '65b6bf4389662250a9da2b91',
          '65b5a4dd89662250a9da26f0',
          '65b5767b89662250a9da25da',
          '65b4f87b89662250a9da2110',
          '65b4ebd889662250a9da1fb9',
          '657647058b815ba4de138291',
          '6570a52c676d4e7bbc5b3865',
          '65708aef676d4e7bbc5b37a8',
          '65706ec9676d4e7bbc5b36e0',
          '656cdde3676d4e7bbc5b3085',
          '656caca250fc292d8a9bc553',
          '656c417750fc292d8a9bc4a1',
          '656af9d90e476dbeaa74a208',
          '6569a6080e476dbeaa749b49',
          '65697f8d0e476dbeaa74991c',
          '656978c90e476dbeaa7497b4',
          '656976750e476dbeaa749746',
          '656973ac0e476dbeaa749582',
          '656947320e476dbeaa7492ac',
          '65690bf75997621b1ba69cea',
          '6569046718cb5ec1e5c90d17',
          '6568fb0de4c84fdb73566958'
        ]
      }
    });

    return featuredStores;
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
