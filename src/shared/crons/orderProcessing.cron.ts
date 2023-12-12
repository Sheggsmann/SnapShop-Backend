import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { config } from '@root/config';
import { orderService } from '@service/db/order.service';
import { storeService } from '@service/db/store.service';
import { IStoreDocument } from '@store/interfaces/store.interface';
import Logger from 'bunyan';

let n = 0;

const log: Logger = config.createLogger('ORDER PROCESSING JOB');

const ESCROW_TO_BALANCE_TIME_IN_MS = 1000 * 60 * 3;

export async function orderProcessingJob() {
  n++;
  console.log('\n ORDER PROCESSING JOB:', n);

  try {
    const ordersToProcess: IOrderDocument[] = await orderService.getDeliveredOrders();

    // for (const order of ordersToProcess) {
    //   const timeDelta = Date.now() - order.paidAt.getTime();

    //   if (timeDelta > ESCROW_TO_BALANCE_TIME_IN_MS) {
    //     const store: IStoreDocument | null = await storeService.getStoreByStoreId(order.store as string);
    //     if (store) {
    //       store.escrowBalance -= order.amountPaid;
    //       store.mainBalance += order.amountPaid;

    //       order.status = OrderStatus.COMPLETED;

    //       await Promise.all([store.save(), order.save()]);
    //     }
    //   }
    // }
  } catch (err) {
    log.error(`Error processing order payment movemnt`, err);
  }
}
