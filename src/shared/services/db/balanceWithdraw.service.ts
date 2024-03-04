import {
  IBalanceWithdrawalDocument,
  balanceWithdrawalStatus
} from '@balanceWithdrawal/interfaces/balanceWithdrawal.interface';
import { BalanceWithdrawalModel } from '@balanceWithdrawal/models/balanceWithdrawal.model';

class BalanceWithdrawalService {
  public async addWithdrawalRequestToDB(data: IBalanceWithdrawalDocument): Promise<void> {
    await BalanceWithdrawalModel.create(data);
  }

  public async getBalanceWithdrawals(skip: number, limit: number): Promise<IBalanceWithdrawalDocument[]> {
    return (await BalanceWithdrawalModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)) as IBalanceWithdrawalDocument[];
  }

  public async getBalanceWithdrawalsCount(): Promise<number> {
    return await BalanceWithdrawalModel.countDocuments();
  }

  public async getPendingWithdrawalRequestsForStore(storeId: string): Promise<IBalanceWithdrawalDocument[]> {
    return await BalanceWithdrawalModel.find({
      store: storeId,
      status: balanceWithdrawalStatus.PENDING
    }).populate('store');
  }
}

export const balanceWithdrawalService: BalanceWithdrawalService = new BalanceWithdrawalService();
