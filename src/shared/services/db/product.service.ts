import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';
import { StoreModel } from '@store/models/store.model';

class ProductService {
  public async addProductToDB(product: IProductDocument, storeId: string) {
    await ProductModel.create(product);
    await StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: 1 } });
  }

  public async getProductById(productId: string): Promise<IProductDocument | null> {
    return await ProductModel.findOne({ _id: productId }).populate('store');
  }

  public async updateProduct(productId: string, updatedProduct: IProductDocument): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
  }
}

export const productService: ProductService = new ProductService();
