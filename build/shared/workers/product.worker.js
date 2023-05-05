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
exports.productWorker = void 0;
const config_1 = require("../../config");
const product_service_1 = require("../services/db/product.service");
const log = config_1.config.createLogger('Product Worker');
class ProductWorker {
    addProductToDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, key } = job.data;
                yield product_service_1.productService.addProductToDB(value, key);
                job.progress(100);
                done(null, job.data);
            }
            catch (err) {
                log.error(err);
                done(err);
            }
        });
    }
    updateProductInDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, key } = job.data;
                yield product_service_1.productService.updateProduct(key, value);
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
exports.productWorker = new ProductWorker();
