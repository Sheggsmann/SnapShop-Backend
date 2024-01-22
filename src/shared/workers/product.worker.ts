import { config } from '@root/config';
import { productService } from '@service/db/product.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Product Worker');

class ProductWorker {
  public async addProductToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value, key } = job.data;
      await productService.addProductToDB(value, key);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  public async updateProductInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value, key } = job.data;
      await productService.updateProduct(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  public async updateProductPurchaseCount(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await productService.updateProductsPurchaseCount(value);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  public async removeProductFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, storeId } = job.data;
      await productService.removeProductFromDB(key, storeId);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const productWorker: ProductWorker = new ProductWorker();
