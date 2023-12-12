"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessingJob = void 0;
const config_1 = require("../../config");
let n = 0;
const log = config_1.config.createLogger('ORDER PROCESSING JOB');
const ESCROW_TO_BALANCE_TIME_IN_MS = 1000 * 60 * 3;
async function orderProcessingJob() {
    n++;
    try {
        console.log('\n ORDER PROCESSING JOB:', n);
        // const ordersToProcess: IOrderDocument[] = await orderService.getDeliveredOrders();
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
    }
    catch (err) {
        log.error(`Error processing order payment movemnt`, err);
    }
}
exports.orderProcessingJob = orderProcessingJob;
