"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productWorker = void 0;
const config_1 = require("../../config");
const product_service_1 = require("../services/db/product.service");
const log = config_1.config.createLogger('Product Worker');
class ProductWorker {
    async addProductToDB(job, done) {
        try {
            const { value, key } = job.data;
            await product_service_1.productService.addProductToDB(value, key);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async updateProductInDB(job, done) {
        try {
            const { value, key } = job.data;
            await product_service_1.productService.updateProduct(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.productWorker = new ProductWorker();
