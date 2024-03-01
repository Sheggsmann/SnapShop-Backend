import { IAnalyticsDocument } from '@analytics/interfaces/analytics.interface';
import { analyticsService } from '@service/db/analytics.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 150;

class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const analytics: IAnalyticsDocument[] = await analyticsService.getAnalytics(skip, limit);
    const analyticsCount: number = await analyticsService.getAnalyticsCount();

    res.status(HTTP_STATUS.OK).json({ message: 'Analytics', analytics, analyticsCount });
  }
}

export const getAnalytics: Get = new Get();
