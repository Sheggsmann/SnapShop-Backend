import { BaseQueue } from './base.queue';
import { IProductJob } from '@product/interfaces/product.interface';
import { productWorker } from '@worker/product.worker';

class ProductQueue extends BaseQueue {
  constructor() {
    super('Product');
    this.processJob('addProductToDB', 5, productWorker.addProductToDB);
  }

  public addProductJob(name: string, data: IProductJob): void {
    this.addJob(name, data);
  }
}

export const productQueue: ProductQueue = new ProductQueue();
