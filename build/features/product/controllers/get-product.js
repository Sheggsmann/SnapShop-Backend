"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const product_service_1 = require("../../../shared/services/db/product.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PAGE_SIZE = 60;
class Get {
    async all(req, res) {
        const { page } = req.params;
        const skip = (parseInt(page) - 1) * PAGE_SIZE;
        const limit = parseInt(page) * PAGE_SIZE;
        const products = await product_service_1.productService.getProducts(skip, limit);
        const productsCount = await product_service_1.productService.getProductsCount();
        res.status(http_status_codes_1.default.OK).json({ message: 'Products', products, productsCount });
    }
    async productByProductId(req, res) {
        const { productId } = req.params;
        const product = await product_service_1.productService.getProductById(productId);
        if (!product) {
            throw new error_handler_1.NotFoundError('Product not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Product', product });
    }
    async productsByStoreId(req, res) {
        const { storeId } = req.params;
        const products = await product_service_1.productService.getProductsByStoreId(storeId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Store products', products });
    }
}
exports.getProduct = new Get();
