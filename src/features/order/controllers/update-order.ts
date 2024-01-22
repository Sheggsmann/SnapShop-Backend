import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { orderQueue } from '@service/queues/order.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { Request, Response } from 'express';
import { config } from '@root/config';
import { Helpers } from '@global/helpers/helpers';
import { storeService } from '@service/db/store.service';
import { socketIOChatObject } from '@socket/chat';
import { notificationQueue } from '@service/queues/notification.queue';
import { transactionQueue } from '@service/queues/transaction.queue';
import { ITransactionDocument, TransactionType } from '@transactions/interfaces/transaction.interface';
import { validator } from '@global/helpers/joi-validation-decorator';
import { updateOrderSchema } from '@order/schemes/order.scheme';
import { adminService } from '@service/db/admin.service';
import crypto from 'crypto';
import HTTP_STATUS from 'http-status-codes';
import { productQueue } from '@service/queues/product.queue';

const KOBO_IN_NAIRA = 100;

class UpdateOrder {
  public async confirmOrderPayment(req: Request, res: Response): Promise<void> {
    const order: IOrderDocument | null = await orderService.getOrderByOrderId(req.params.orderId);
    if (!order) throw new BadRequestError('Could not confirm order');

    const amountToPay = Helpers.calculateOrderTotal(order);
    res.status(HTTP_STATUS.OK).json({ message: 'Order confirmed successfully', order, amountToPay });
  }

  public async orderPayment(req: Request, res: Response): Promise<void> {
    // OUS => Order Id, User Id, Store Id

    const hash = crypto
      .createHmac('sha512', config.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      // console.log('[REQUEST HEADERS]:', req.headers);
      console.log('\n[REQUEST BODY]:', req.body);

      const eventData = req.body;

      if (eventData.event === 'charge.success') {
        const [orderId, userId, storeId] = eventData.data.reference.split('-');

        // Amount in Kobo, change to naira
        const amountPaid: number = eventData.data.amount / KOBO_IN_NAIRA;

        transactionQueue.addTransactionJob('addTransactionToDB', {
          store: storeId,
          order: orderId,
          user: userId,
          amount: amountPaid,
          type: TransactionType.ORDER_PAYMENT
        } as unknown as ITransactionDocument);

        // TODO: Check if the amount paid is the same as the total of all the products
        const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);

        if (order) {
          // sum the price of all the products and their quantities and check if the amount paid is equal
          const serviceFee = Helpers.calculateOrderServiceFee(order);
          const total = Helpers.calculateOrderTotal(order);

          console.log('ORDER TOTAL:', total);
          console.log('AMOUNT PAID:', amountPaid);

          if (total === amountPaid) {
            const deliveryCode = Helpers.generateOtp(4);
            await orderService.updateOrderPaymentStatus(orderId, true, amountPaid, deliveryCode, serviceFee);

            // Subtract service fee from the amount paid and credit to store
            const storeCreditAmount = amountPaid - serviceFee;
            await storeService.updateStoreEscrowBalance(storeId, storeCreditAmount);

            // TODO: store the service fee in our admin account
            await adminService.updateServiceAdminUserCharge(serviceFee);

            // Increase products purchase counts
            productQueue.addProductJob('updateProductPurchaseCount', { value: order.products });

            order.paid = true;
            order.amountPaid = amountPaid;
            order.serviceFee = serviceFee;
            order.deliveryCode = deliveryCode;
            order.paymentProcessor = 'paystack';
            order.status = OrderStatus.ACTIVE;
            socketIOChatObject.to(userId).to(storeId).emit('order:update', { order });

            notificationQueue.addNotificationJob('sendPushNotificationToStore', {
              key: storeId,
              value: {
                title: `Order Payment 🥳`,
                body: `${order.user.name} just paid ₦${amountPaid} for order #${order._id
                  .toString()
                  .substring(0, 8)}.\nOrder delivery code is: ${deliveryCode}`
              }
            });

            notificationQueue.addNotificationJob('sendPushNotificationToUser', {
              key: userId,
              value: {
                title: `Payment Completed 🥳`,
                body: 'Enter the 4 digit code from the merchant to validate the order on delivery.'
              }
            });
          }
        }
      }
    } else {
      console.error('\n\n COULD NOT VALIDATE PAYSTACK WEBHOOK');
    }

    res.sendStatus(200);
  }

  public async devOrderPayment(req: Request, res: Response): Promise<void> {
    const { amountPaid, orderId, storeId } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (order) {
      const total = Helpers.calculateOrderTotal(order);

      console.log('\nYOU SHOULD PAY:', total);
      if (total !== amountPaid) throw new BadRequestError('Incorrect amount');
      // Subtract service fee from the amount paid and credit to store
      const serviceCharge = Helpers.calculateOrderServiceFee(order);

      const deliveryCode = Helpers.generateOtp(4);
      await orderService.updateOrderPaymentStatus(orderId, true, amountPaid, deliveryCode, serviceCharge);

      const storeCreditAmount = amountPaid - serviceCharge;
      await storeService.updateStoreEscrowBalance(storeId, storeCreditAmount);

      // TODO: store the service fee in our admin account
      await adminService.updateServiceAdminUserCharge(serviceCharge);

      productQueue.addProductJob('updateProductPurchaseCount', { value: order.products });

      transactionQueue.addTransactionJob('addTransactionToDB', {
        store: storeId,
        order: orderId,
        user: req.currentUser!.userId,
        amount: Number(amountPaid),
        type: TransactionType.ORDER_PAYMENT
      } as unknown as ITransactionDocument);
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Payment Success' });
  }

  // TODO: add validator for update order
  @validator(updateOrderSchema)
  public async order(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { deliveryFee, products } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const isOrderStore =
      (order.store as IStoreDocument)._id.toString() === req.currentUser!.storeId?.toString();

    const isOrderUser = order.user.userId.toString() === req.currentUser!.userId.toString();

    if (!isOrderStore && !isOrderUser) {
      throw new NotAuthorizedError('You are not authorized to make this request');
    }

    order.deliveryFee = deliveryFee;
    order.products = products;
    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    socketIOChatObject
      .to((order.store as IStoreDocument)._id.toString())
      .to(order.user.userId.toString())
      .emit('order:update', { order });

    // TODO: if update is from user, send notification to store
    if (isOrderUser) {
      notificationQueue.addNotificationJob('sendPushNotificationToStore', {
        key: (order.store as IStoreDocument)._id as string,
        value: {
          title: `Order Updated`,
          body: `${order.user.name} just updated order #${order._id.toString().substring(0, 8)}`
        }
      });
    }

    // if update is from store, send update to user
    if (isOrderStore) {
      notificationQueue.addNotificationJob('sendPushNotificationToUser', {
        key: order.user.userId as string,
        value: {
          title: 'Order Updated',
          body: `${(order.store as IStoreDocument).name} added a delivery fee for order #${order._id
            .toString()
            .substring(0, 8)}`
        }
      });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Order updated successfully', order });
  }

  public async completeOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    if (order.deliveryCode !== req.body.deliveryCode) {
      throw new BadRequestError('Invalid delivery code');
    }

    order.status = OrderStatus.DELIVERED;
    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    socketIOChatObject
      .to(order.user.userId.toString())
      .to((order.store as IStoreDocument)._id.toString())
      .emit('order:update', { order });

    notificationQueue.addNotificationJob('sendPushNotificationToStore', {
      key: (order.store as IStoreDocument)._id as string,
      value: {
        title: `Order Completed`,
        body: `${order.user.name} marked order #${order._id.toString().substring(0, 8)} as complete`
      }
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Order completed' });
  }
}

export const updateOrder: UpdateOrder = new UpdateOrder();
