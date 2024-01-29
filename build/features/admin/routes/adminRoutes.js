"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const get_maintenance_1 = require("../controllers/get-maintenance");
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const user_interface_1 = require("../../user/interfaces/user.interface");
const get_store_1 = require("../../store/controllers/get-store");
const get_order_1 = require("../../order/controllers/get-order");
const get_user_1 = require("../../user/controllers/get-user");
const get_searches_1 = require("../../searches/controllers/get-searches");
const get_product_1 = require("../../product/controllers/get-product");
class AdminRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/maintenance', get_maintenance_1.getMaintenance.maintenance);
        this.router.get('/stores/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_store_1.getStores.all);
        this.router.get('/orders/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_order_1.getOrders.all);
        this.router.get('/users/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_user_1.getUser.all);
        this.router.get('/products/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_product_1.getProduct.all);
        this.router.get('/searches/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_searches_1.getSearches.all);
        return this.router;
    }
}
exports.adminRoutes = new AdminRoutes();
