import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { config } from '@root/config';
import { orderService } from '@service/db/order.service';
import { storeService } from '@service/db/store.service';
import { notificationQueue } from '@service/queues/notification.queue';
import { transactionQueue } from '@service/queues/transaction.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { ITransactionDocument, TransactionType } from '@transactions/interfaces/transaction.interface';
import { Helpers } from '@global/helpers/helpers';
import { adminService } from '@service/db/admin.service';
import Logger from 'bunyan';

let n = 0;

const log: Logger = config.createLogger('ORDER PROCESSING JOB');

const ESCROW_TO_BALANCE_TIME_IN_MS = 1000 * 60 * 3;

export async function orderProcessingJob() {
  n++;

  try {
    console.log('\n ORDER PROCESSING JOB:', n);
    const ordersToProcess: IOrderDocument[] = await orderService.getDeliveredOrders();

    for (const order of ordersToProcess) {
      const timeDelta = Date.now() - order.paidAt.getTime();

      if (timeDelta > ESCROW_TO_BALANCE_TIME_IN_MS) {
        const store: IStoreDocument | null = await storeService.getStoreByStoreId(order.store as string);

        // TODO: remove service fee and 4% here
        if (store) {
          const userServiceCharge = Helpers.calculateOrderServiceFee(order);
          const amountCreditedToStore = order.amountPaid - userServiceCharge;
          store.escrowBalance -= amountCreditedToStore;

          // We collect 4%
          const storeServiceCharge = 0.04 * (amountCreditedToStore - (order?.deliveryFee || 0));
          const storeMainBalance = amountCreditedToStore - storeServiceCharge;
          store.mainBalance += storeMainBalance;

          order.status = OrderStatus.COMPLETED;
          await Promise.all([
            store.save(),
            order.save(),
            adminService.updateServiceAdminStoreCharge(storeServiceCharge)
          ]);

          transactionQueue.addTransactionJob('addTransactionToDB', {
            storeId: store._id,
            order: order._id,
            user: order.user.userId,
            amount: Number(order.amountPaid),
            type: TransactionType.DEPOSIT
          } as unknown as ITransactionDocument);

          // SEND NOTIFICATION TO STORE:
          notificationQueue.addNotificationJob('sendPushNotificationToStore', {
            key: `${store._id}`,
            value: {
              title: 'Payment 🥳🎉',
              body: `₦${order.amountPaid} has been moved to your main balance.`
            }
          });
        }
      }
    }
  } catch (err) {
    log.error(`Error processing order payment movement`, err);
  }
}
