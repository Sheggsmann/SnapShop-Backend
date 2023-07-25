"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeWorker = void 0;
const config_1 = require("../../config");
const store_service_1 = require("../services/db/store.service");
const log = config_1.config.createLogger('Store Worker');
class StoreWorker {
    async addStoreToDB(job, done) {
        try {
            const { userId, value } = job.data;
            await store_service_1.storeService.addStoreToDB(userId, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async updateStoreInDB(job, done) {
        try {
            const { key, value } = job.data;
            await store_service_1.storeService.updateStore(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.storeWorker = new StoreWorker();
