"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeWorker = void 0;
const config_1 = require("../../config");
const store_service_1 = require("../services/db/store.service");
const log = config_1.config.createLogger('Store Worker');
class StoreWorker {
    addStoreToDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, value } = job.data;
                yield store_service_1.storeService.addStoreToDB(userId, value);
                job.progress(100);
                done(null, job.data);
            }
            catch (err) {
                log.error(err);
                done(err);
            }
        });
    }
    updateStoreInDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key, value } = job.data;
                yield store_service_1.storeService.updateStore(key, value);
                job.progress(100);
                done(null, job.data);
            }
            catch (err) {
                log.error(err);
                done(err);
            }
        });
    }
}
exports.storeWorker = new StoreWorker();
