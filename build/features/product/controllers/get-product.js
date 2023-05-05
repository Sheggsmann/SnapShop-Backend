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
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = parseInt(page) * PAGE_SIZE;
            const products = yield product_service_1.productService.getProducts(skip, limit);
            res.status(http_status_codes_1.default.OK).json({ message: 'Products', products });
        });
    }
    productByProductId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const product = yield product_service_1.productService.getProductById(productId);
            if (!product) {
                throw new error_handler_1.NotFoundError('Product not found');
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'Product', product });
        });
    }
    productsByStoreId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const products = yield product_service_1.productService.getProductsByStoreId(storeId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Store products', products });
        });
    }
}
exports.getProduct = new Get();
