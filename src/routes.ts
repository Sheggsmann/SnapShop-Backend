import { Application } from 'express';
import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { storeRoutes } from '@store/routes/storeRoutes';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { productRoutes } from '@product/routes/productRoutes';
import { searchStoreRoutes } from '@store/routes/searchStoreRoutes';
import { orderRoutes } from '@order/routes/orderRoutes';
import { chatRoutes } from '@chat/routes/chatRoutes';
import { reviewRoutes } from './features/review/routes/reviewRoutes';
import { userRoutes } from '@user/routes/userRoutes';
import { versionRoutes } from '@versioning/routes/versionRoutes';
import { paymentRoutes } from './features/payment/routes/paymentRoutes';
import { feedbackRoutes } from '@feedback/routes/feedbackRoutes';
import { balanceWithdrawalRoutes } from '@balanceWithdrawal/routes/balanceWithdrawalRoutes';
import { transactionRoutes } from '@transactions/routes/transactionRoutes';
import { adminRoutes } from '@admin/routes/adminRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, adminRoutes.routes());
    app.use(BASE_PATH, versionRoutes.routes());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, searchStoreRoutes.routes());
    app.use(BASE_PATH, paymentRoutes.routes());

    app.use(BASE_PATH, authMiddleware.protect, userRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, storeRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, orderRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, chatRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, reviewRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, feedbackRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, transactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, balanceWithdrawalRoutes.routes());

    // Store owner routes
    app.use(BASE_PATH, authMiddleware.protect, productRoutes.routes());
  };

  routes();
};
