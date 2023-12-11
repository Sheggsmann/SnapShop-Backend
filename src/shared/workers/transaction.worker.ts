import { config } from '@root/config';
import { transactionService } from '@service/db/transaction.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Transactions Worker');

class TransactionsWorker {
  public async addTransactionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await transactionService.addTransactionToDB(value);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const transactionsWorker: TransactionsWorker = new TransactionsWorker();
