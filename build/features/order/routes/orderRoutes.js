"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const create_order_1 = require("../controllers/create-order");
const get_order_1 = require("../controllers/get-order");
class OrderRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/order/my-orders', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['User']), get_order_1.getOrders.myOrders);
        this.router.get('/order/store/:storeId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), get_order_1.getOrders.storeOrders);
        this.router.get('/order/:orderId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['User']), get_order_1.getOrders.order);
        this.router.post('/order/store/:storeId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['User']), create_order_1.createOrder.order);
        return this.router;
    }
}
exports.orderRoutes = new OrderRoutes();