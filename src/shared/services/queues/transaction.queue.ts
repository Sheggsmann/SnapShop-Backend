import { ITransactionDocument } from '@transactions/interfaces/transaction.interface';
import { BaseQueue } from './base.queue';
import { transactionsWorker } from '@worker/transaction.worker';

class TransactionQueue extends BaseQueue {
  constructor() {
    super('Transactions');
    this.processJob('addTransactionToDB', 5, transactionsWorker.addTransactionToDB);
  }

  public addTransactionJob(name: string, data: ITransactionDocument): void {
    this.addJob(name, data);
  }
}

export const transactionQueue: TransactionQueue = new TransactionQueue();
