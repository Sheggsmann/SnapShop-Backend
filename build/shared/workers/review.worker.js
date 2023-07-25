"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewWorker = void 0;
const config_1 = require("../../config");
const review_service_1 = require("../services/db/review.service");
const log = config_1.config.createLogger('Review Worker');
class ReviewWorker {
    async addReviewToDB(job, done) {
        try {
            const { value } = job.data;
            await review_service_1.reviewService.addReviewToDB(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.reviewWorker = new ReviewWorker();
