"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQueue = void 0;
const base_queue_1 = require("./base.queue");
const review_worker_1 = require("../../workers/review.worker");
class ReviewQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Review');
        this.processJob('addReviewToDB', 5, review_worker_1.reviewWorker.addReviewToDB);
    }
    addReviewJob(name, data) {
        this.addJob(name, data);
    }
}
exports.reviewQueue = new ReviewQueue();
