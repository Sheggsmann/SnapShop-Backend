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
const get_product_1 = require("../controllers/get-product");
class ProductRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/products/by-store/:storeId', get_product_1.getProduct.productsByStoreId);
        this.router.get('/product/:productId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.checkAuth, get_product_1.getProduct.productByProductId);
        this.router.post('/product', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), create_product_1.createProduct.product);
        this.router.put('/product/:productId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner', 'Admin']), update_product_1.updateProduct.product);
        this.router.put('/product/media/:productId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_product_1.updateProduct.productWithMedia);
        this.router.delete('/product/:productId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_product_1.updateProduct.deleteProduct);
        return this.router;
    }
}
exports.productRoutes = new ProductRoutes();
