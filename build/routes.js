"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = require("./features/auth/routes/authRoutes");
const base_queue_1 = require("./shared/services/queues/base.queue");
const storeRoutes_1 = require("./features/store/routes/storeRoutes");
const auth_middleware_1 = require("./shared/globals/middlewares/auth-middleware");
const productRoutes_1 = require("./features/product/routes/productRoutes");
const searchStoreRoutes_1 = require("./features/store/routes/searchStoreRoutes");
const orderRoutes_1 = require("./features/order/routes/orderRoutes");
const chatRoutes_1 = require("./features/chat/routes/chatRoutes");
const BASE_PATH = '/api/v1';
exports.default = (app) => {
    const routes = () => {
        app.use('/queues', base_queue_1.serverAdapter.getRouter());
        app.use(BASE_PATH, authRoutes_1.authRoutes.routes());
        app.use(BASE_PATH, searchStoreRoutes_1.searchStoreRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, storeRoutes_1.storeRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, orderRoutes_1.orderRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, chatRoutes_1.chatRoutes.routes());
        // Store owner routes
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, productRoutes_1.productRoutes.routes());
    };
    routes();
};
