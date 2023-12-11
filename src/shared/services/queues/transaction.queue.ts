import { ITransactionDocument } from '@transactions/interfaces/transaction.interface';
import { BaseQueue } from './base.queue';

class TransactionQueue extends BaseQueue {
  constructor() {
    super('Transactions');
  }

  public addTransactionJob(name: string, data: ITransactionDocument): void {
    this.addJob(name, data);
  }
}

export const transactionQueue: TransactionQueue = new TransactionQueue();
