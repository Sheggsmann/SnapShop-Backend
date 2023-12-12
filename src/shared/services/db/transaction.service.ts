import { ITransactionDocument } from '@transactions/interfaces/transaction.interface';
import { TransactionsModel } from '@transactions/models/transaction.model';

class TransactionService {
  public async addTransactionToDB(transaction: ITransactionDocument): Promise<void> {
    await TransactionsModel.create(transaction);
  }
}

export const transactionService: TransactionService = new TransactionService();
