"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQueue = void 0;
const base_queue_1 = require("./base.queue");
const product_worker_1 = require("../../workers/product.worker");
class ProductQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Product');
        this.processJob('addProductToDB', 5, product_worker_1.productWorker.addProductToDB);
        this.processJob('updateProductInDB', 5, product_worker_1.productWorker.updateProductInDB);
        this.processJob('removeProductFromDB', 5, product_worker_1.productWorker.removeProductFromDB);
        this.processJob('updateProductPurchaseCount', 5, product_worker_1.productWorker.updateProductPurchaseCount);
    }
    addProductJob(name, data) {
        this.addJob(name, data);
    }
}
exports.productQueue = new ProductQueue();
