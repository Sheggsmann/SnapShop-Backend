import { transactionService } from '@service/db/transaction.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async userTransactions(req: Request, res: Response): Promise<void> {
    const transactions = await transactionService.getUserTransactions(req.params.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'Transactions fetched successfully', transactions });
  }

  public async storeTransactions(req: Request, res: Response): Promise<void> {
    const transactions = await transactionService.getStoreTransactions(req.params.storeId);
    res.status(HTTP_STATUS.OK).json({ message: 'Transactions fetched successfully', transactions });
  }
}

export const getTransactions: Get = new Get();
