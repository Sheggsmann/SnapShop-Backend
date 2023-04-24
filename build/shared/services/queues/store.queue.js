"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeQueue = void 0;
const base_queue_1 = require("./base.queue");
const store_worker_1 = require("../../workers/store.worker");
class StoreQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Store');
        this.processJob('addStoreToDB', 5, store_worker_1.storeWorker.addStoreToDB);
        this.processJob('updateStoreInDB', 5, store_worker_1.storeWorker.updateStoreInDB);
    }
    addStoreJob(name, data) {
        this.addJob(name, data);
    }
}
exports.storeQueue = new StoreQueue();
