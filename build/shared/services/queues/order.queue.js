"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueue = void 0;
const base_queue_1 = require("./base.queue");
const order_worker_1 = require("../../workers/order.worker");
class OrderQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Order');
        this.processJob('addOrderToDB', 5, order_worker_1.orderWorker.addOrderToDB);
        this.processJob('updateOrderInDB', 5, order_worker_1.orderWorker.updateOrderInDB);
    }
    addOrderJob(name, data) {
        this.addJob(name, data);
    }
}
exports.orderQueue = new OrderQueue();
