import { ITransactionDocument } from '@transactions/interfaces/transaction.interface';
import { TransactionsModel } from '@transactions/models/transaction.model';

class TransactionService {
  public async addTransactionToDB(transaction: ITransactionDocument): Promise<void> {
    await TransactionsModel.create(transaction);
  }

  public async getUserTransactions(userId: string): Promise<ITransactionDocument[]> {
    return await TransactionsModel.find({ user: userId })
      .sort({ createdAt: 1 })
      .populate('store', '_id name image mobileNumber');
  }

  public async getStoreTransactions(storeId: string): Promise<ITransactionDocument[]> {
    return await TransactionsModel.find({ store: storeId })
      .sort({ createdAt: 1 })
      .populate('user', '_id name profilePicture mobileNumber')
      .populate('order', 'products status paid serviceFee');
  }
}

export const transactionService: TransactionService = new TransactionService();
