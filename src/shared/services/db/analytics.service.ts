import { IAnalyticsData, IAnalyticsDocument } from '@analytics/interfaces/analytics.interface';
import { AnalyticsModel } from '@analytics/models/analytics.model';

class AnalyticsService {
  public async addAnalyticsToDB(analyticsData: IAnalyticsData) {
    await AnalyticsModel.create({
      store: analyticsData?.store,
      user: analyticsData?.user,
      product: analyticsData?.product,
      event: analyticsData.event
    });
  }

  public async getAnalytics(skip: number, limit: number): Promise<IAnalyticsDocument[]> {
    return await AnalyticsModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
}

export const analyticsService: AnalyticsService = new AnalyticsService();
