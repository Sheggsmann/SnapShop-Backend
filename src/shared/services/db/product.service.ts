import { ICartItem } from '@order/interfaces/order.interface';
import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { StoreModel } from '@store/models/store.model';
import mongoose from 'mongoose';

class ProductService {
  public async addProductToDB(product: IProductDocument, storeId: string) {
    await ProductModel.create(product);
    await StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: 1 } });
  }

  public async getProducts(skip: number, limit: number): Promise<IProductDocument[]> {
    return (await ProductModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)) as IProductDocument[];
  }

  public async getProductsCount(): Promise<number> {
    return await ProductModel.countDocuments({});
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
          totalRatings: { $first: '$totalRatings' },
          ratingsCount: { $first: '$ratingsCount' },
          locations: { $first: '$locations' },
          productCategories: { $first: '$productCategories' },
          products: { $push: '$products' }
        }
      }
    ]);

    const products = [];

    for (const frequentlyPurchasedProduct of frequentlyPurchasedProducts) {
      for (const product of frequentlyPurchasedProduct.products) {
        products.push(product);
      }
    }

    console.log('\nFREQUENTLY PURCHASED PRODUCT:', frequentlyPurchasedProducts);

    return products;
  }

  public async getRandomProducts(): Promise<IProductDocument[]> {
    return [];
  }

  public async getExploreProducts(
    blacklist: Partial<IProductDocument>[],
    limit: number
  ): Promise<IProductDocument[]> {
    const products: IProductDocument[] = await ProductModel.aggregate([
      {
        $match: {
          $expr: {
            $not: { $in: ['$_id', blacklist.map((id) => new mongoose.Types.ObjectId(id as string))] }
          }
        }
      },
      { $sample: { size: limit } }
    ]);
    return products;
  }

  public async getNewArrivals(): Promise<IProductDocument[]> {
    return await ProductModel.find({}).sort({ createdAt: -1 }).limit(15);
  }

  public async updateProduct(productId: string, updatedProduct: IProductDocument): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
  }

  public async removeProductFromDB(productId: string, storeId: string): Promise<void> {
    await ProductModel.findByIdAndRemove(productId);
    await StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: -1 } });
  }

  public async updateProductsPurchaseCount(products: ICartItem[]): Promise<void> {
    for (const product of products) {
      await ProductModel.updateOne(
        { _id: (product.product as IProductDocument)._id },
        { $inc: { purchaseCount: product.quantity } }
      );
    }
  }

  public async updateStoreProductsCategories(
    storeId: string,
    oldCategory: string,
    newCategory: string
  ): Promise<void> {
    await ProductModel.updateMany(
      { store: storeId, category: oldCategory },
      { $set: { category: newCategory } }
    );
  }
}

export const productService: ProductService = new ProductService();
