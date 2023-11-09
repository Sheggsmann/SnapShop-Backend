import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { StoreModel } from '@store/models/store.model';

class ProductService {
  public async addProductToDB(product: IProductDocument, storeId: string) {
    await ProductModel.create(product);
    await StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: 1 } });
  }

  public async getProducts(skip: number, limit: number): Promise<IProductDocument[]> {
    return (await ProductModel.find({}).skip(skip).limit(limit)) as IProductDocument[];
  }

  public async getProductById(productId: string): Promise<IProductDocument | null> {
    return await ProductModel.findOne({ _id: productId }).populate('store');
  }

  public async getProductsByStoreId(storeId: string): Promise<IProductDocument[]> {
    return await ProductModel.find({ store: storeId });
  }

  public async getFrequentlyPurchasedProductsNearUser(
    location: [number, number],
    limit: number
  ): Promise<IProductDocument[]> {
    const frequentlyPurchasedProducts = await StoreModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [location[0], location[1]] },
          distanceField: 'distance',
          maxDistance: 100000,
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'Product',
          localField: '_id',
          foreignField: 'store',
          pipeline: [{ $limit: 3 }],
          as: 'products'
        }
      },
      { $unwind: '$products' },
      { $sort: { 'products.purchaseCount': -1 } },
      { $limit: limit },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          image: { $first: '$image' },
          bgImage: { $first: '$bgImage' },
          owner: { $first: '$owner' },
          products: { $push: '$products' }
        }
      }
    ]);

    return frequentlyPurchasedProducts;
  }

  public async getRandomProducts(): Promise<IProductDocument[]> {
    return [];
  }

  public async updateProduct(productId: string, updatedProduct: IProductDocument): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
  }

  public async removeProductFromDB(productId: string, storeId: string): Promise<void> {
    await ProductModel.findByIdAndRemove(productId);
    await StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: -1 } });
  }
}

export const productService: ProductService = new ProductService();
