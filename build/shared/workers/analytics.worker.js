"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsWorker = void 0;
const config_1 = require("../../config");
const analytics_service_1 = require("../services/db/analytics.service");
const log = config_1.config.createLogger('Analytics Worker');
class AnalyticsWorker {
    async addAnalyticsToDB(job, done) {
        try {
            const { value } = job.data;
            await analytics_service_1.analyticsService.addAnalyticsToDB(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.analyticsWorker = new AnalyticsWorker();
