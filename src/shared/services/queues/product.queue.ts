import { BaseQueue } from './base.queue';
import { IProductJob } from '@product/interfaces/product.interface';
import { productWorker } from '@worker/product.worker';

class ProductQueue extends BaseQueue {
  constructor() {
    super('Product');
    this.processJob('addProductToDB', 5, productWorker.addProductToDB);
    this.processJob('updateProductInDB', 5, productWorker.updateProductInDB);
    this.processJob('removeProductFromDB', 5, productWorker.removeProductFromDB);
    this.processJob('updateProductPurchaseCount', 5, productWorker.updateProductPurchaseCount);
  }

  public addProductJob(name: string, data: IProductJob): void {
    this.addJob(name, data);
  }
}

export const productQueue: ProductQueue = new ProductQueue();
