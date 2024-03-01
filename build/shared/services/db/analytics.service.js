"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const analytics_model_1 = require("../../../features/analytics/models/analytics.model");
class AnalyticsService {
    async addAnalyticsToDB(analyticsData) {
        await analytics_model_1.AnalyticsModel.create({
            store: analyticsData?.store,
            user: analyticsData?.user,
            product: analyticsData?.product,
            event: analyticsData.event
        });
    }
    async getAnalytics(skip, limit) {
        return await analytics_model_1.AnalyticsModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    }
    async getAnalyticsCount() {
        return await analytics_model_1.AnalyticsModel.countDocuments();
    }
}
exports.analyticsService = new AnalyticsService();
