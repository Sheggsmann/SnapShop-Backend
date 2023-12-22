import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { balanceWithdrawalSchema } from '@balanceWithdrawal/schemes/balanceWithdrawal.scheme';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { storeService } from '@service/db/store.service';
import { balanceWithdrawalService } from '@service/db/balanceWithdraw.service';
import { IBalanceWithdrawalDocument } from '@balanceWithdrawal/interfaces/balanceWithdrawal.interface';
import HTTP_STATUS from 'http-status-codes';

class BalanceWithdraw {
  @validator(balanceWithdrawalSchema)
  public async requestWithdrawal(req: Request, res: Response): Promise<void> {
    const { amount, accountName, accountNumber, bankName } = req.body;

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(`${req.currentUser!.storeId}`);
    if (!store) throw new NotFoundError('Store not found');

    if (Number(amount) > Number(store.mainBalance)) {
      throw new BadRequestError('Insufficient balance');
    }

    // Check if pending withdrawal balances are not greater than store's mainBalance
    const pendingWithdrawalRequests: IBalanceWithdrawalDocument[] =
      await balanceWithdrawalService.getPendingWithdrawalRequestsForStore(`${req.currentUser!.storeId}`);

    const withdrawalBalance = pendingWithdrawalRequests.reduce((acc, curr) => (acc += curr.amount), 0);

    if (amount > Number(store.mainBalance) - withdrawalBalance) {
      throw new BadRequestError('Insufficient balance');
    }

    await balanceWithdrawalService.addWithdrawalRequestToDB({
      store: req.currentUser!.storeId,
      amount,
      accountName,
      accountNumber,
      bankName
    } as IBalanceWithdrawalDocument);

    res.status(HTTP_STATUS.OK).json({ message: 'Withdrawal request placed successfully' });
  }
}

export const balanceWithdraw: BalanceWithdraw = new BalanceWithdraw();
