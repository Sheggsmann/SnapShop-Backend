import { IAnalyticsDocument } from '@analytics/interfaces/analytics.interface';
import { Schema, model, Model } from 'mongoose';

const analyticsSchema: Schema = new Schema(
  {
    store: {},
    product: {},
    user: {},
    event: String
  },
  {
    timestamps: true
  }
);

const AnalyticsModel: Model<IAnalyticsDocument> = model<IAnalyticsDocument>(
  'Analytics',
  analyticsSchema,
  'Analytics'
);

export { AnalyticsModel };
