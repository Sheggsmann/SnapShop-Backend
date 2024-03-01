"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsQueue = void 0;
const base_queue_1 = require("./base.queue");
const analytics_worker_1 = require("../../workers/analytics.worker");
class AnalyticsQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Analytics');
        this.processJob('addAnalyticsToDB', 5, analytics_worker_1.analyticsWorker.addAnalyticsToDB);
    }
    addAnalyticsJob(name, data) {
        this.addJob(name, data);
    }
}
exports.analyticsQueue = new AnalyticsQueue();
