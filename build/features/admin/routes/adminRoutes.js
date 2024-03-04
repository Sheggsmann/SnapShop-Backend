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
const send_notification_1 = require("../../notification/controllers/send-notification");
const get_tags_mapping_1 = require("../controllers/get-tags-mapping");
const create_tag_mapping_1 = require("../controllers/create-tag-mapping");
const get_analytics_1 = require("../../analytics/controllers/get-analytics");
const balance_withdraw_1 = require("../../balanceWithdrawal/controllers/balance-withdraw");
class AdminRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/maintenance', get_maintenance_1.getMaintenance.maintenance);
        // Stores Routes
        this.router.get('/stores/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_store_1.getStores.all);
        // Orders Routes
        this.router.get('/orders/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_order_1.getOrders.all);
        // Users Routes
        this.router.get('/users/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_user_1.getUser.all);
        // Products Routes
        this.router.get('/products/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_product_1.getProduct.all);
        // Searches Routes
        this.router.get('/searches/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_searches_1.getSearches.all);
        // Notification Routes
        this.router.post('/notifications/to-user/:userId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), send_notification_1.sendNotification.toUser);
        this.router.post('/notifications/to-store/:storeId', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), send_notification_1.sendNotification.toStore);
        this.router.post('/notifications/all-users', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), send_notification_1.sendNotification.toAllUsers);
        this.router.post('/notifications/all-stores', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), send_notification_1.sendNotification.toAllStores);
        this.router.post('/notifications/all', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), send_notification_1.sendNotification.toAll);
        // Tags Mappings Routes
        this.router.get('/tags-mappings/all', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_tags_mapping_1.getTagsMappings.tag);
        this.router.post('/tags-mappings', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), create_tag_mapping_1.createTagMapping.tag);
        // Analytics Routes
        this.router.get('/analytics/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), get_analytics_1.getAnalytics.all);
        // Balance Withdrawal Routes
        this.router.get('/balanceWithdrawals/all/:page', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), balance_withdraw_1.balanceWithdraw.all);
        return this.router;
    }
}
exports.adminRoutes = new AdminRoutes();
