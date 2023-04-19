import { Application } from 'express';
import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { storeRoutes } from '@store/routes/storeRoutes';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { productRoutes } from '@product/routes/productRoutes';
import { searchStoreRoutes } from '@store/routes/searchStoreRoutes';
import { orderRoutes } from '@order/routes/orderRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, searchStoreRoutes.routes());

    app.use(BASE_PATH, authMiddleware.protect, storeRoutes.routes());
    app.use(BASE_PATH, authMiddleware.protect, orderRoutes.routes());

    // Store owner routes
    app.use(BASE_PATH, authMiddleware.protect, productRoutes.routes());
  };

  routes();
};
