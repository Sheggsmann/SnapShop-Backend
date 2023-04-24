"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const create_product_1 = require("../controllers/create-product");
const update_product_1 = require("../controllers/update-product");
class ProductRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/product', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), create_product_1.createProduct.product);
        this.router.put('/product/:productId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_product_1.updateProduct.product);
        this.router.put('/product/media/:productId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_product_1.updateProduct.productWithMedia);
        return this.router;
    }
}
exports.productRoutes = new ProductRoutes();
