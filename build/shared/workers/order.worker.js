"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWorker = void 0;
const config_1 = require("../../config");
const order_service_1 = require("../services/db/order.service");
const log = config_1.config.createLogger('Order Worker');
class OrderWorker {
    async addOrderToDB(job, done) {
        try {
            const { value } = job.data;
            await order_service_1.orderService.addOrderToDB(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.orderWorker = new OrderWorker();
