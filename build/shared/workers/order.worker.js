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
exports.orderWorker = void 0;
const config_1 = require("../../config");
const order_service_1 = require("../services/db/order.service");
const log = config_1.config.createLogger('Order Worker');
class OrderWorker {
    addOrderToDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value } = job.data;
                yield order_service_1.orderService.addOrderToDB(value);
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
exports.orderWorker = new OrderWorker();
