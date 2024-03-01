"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const analytics_service_1 = require("../../../shared/services/db/analytics.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PAGE_SIZE = 150;
class Get {
    async all(req, res) {
        const { page } = req.params;
        const skip = (parseInt(page) - 1) * PAGE_SIZE;
        const limit = parseInt(page) * PAGE_SIZE;
        const analytics = await analytics_service_1.analyticsService.getAnalytics(skip, limit);
        const analyticsCount = await analytics_service_1.analyticsService.getAnalyticsCount();
        res.status(http_status_codes_1.default.OK).json({ message: 'Analytics', analytics, analyticsCount });
    }
}
exports.getAnalytics = new Get();
