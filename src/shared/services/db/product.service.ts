import { IProductDocument } from '@product/interfaces/product.interface';
import { ProductModel } from '@product/models/product.model';

class ProductService {
  public async addProductToDB(product: IProductDocument) {
    await ProductModel.create(product);
  }
}

export const productService: ProductService = new ProductService();
