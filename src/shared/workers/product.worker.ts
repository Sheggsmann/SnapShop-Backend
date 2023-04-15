import { config } from '@root/config';
import { productService } from '@service/db/product.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Product Worker');

class ProductWorker {
  public async addProductToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      productService.addProductToDB(value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const productWorker: ProductWorker = new ProductWorker();
