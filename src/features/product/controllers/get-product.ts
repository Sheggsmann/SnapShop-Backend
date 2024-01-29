import { NotFoundError } from '@global/helpers/error-handler';
import { IProductDocument } from '@product/interfaces/product.interface';
import { productService } from '@service/db/product.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 60;

class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const products: IProductDocument[] = await productService.getProducts(skip, limit);
    const productsCount: number = await productService.getProductsCount();

    res.status(HTTP_STATUS.OK).json({ message: 'Products', products, productsCount });
  }

  public async productByProductId(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;

    const product = await productService.getProductById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Product', product });
  }

  public async productsByStoreId(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const products: IProductDocument[] = await productService.getProductsByStoreId(storeId);

    res.status(HTTP_STATUS.OK).json({ message: 'Store products', products });
  }
}

export const getProduct: Get = new Get();
