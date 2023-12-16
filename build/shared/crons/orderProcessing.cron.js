"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessingJob = void 0;
const order_interface_1 = require("../../features/order/interfaces/order.interface");
const config_1 = require("../../config");
const order_service_1 = require("../services/db/order.service");
const store_service_1 = require("../services/db/store.service");
const notification_queue_1 = require("../services/queues/notification.queue");
const transaction_queue_1 = require("../services/queues/transaction.queue");
const transaction_interface_1 = require("../../features/transactions/interfaces/transaction.interface");
let n = 0;
const log = config_1.config.createLogger('ORDER PROCESSING JOB');
const ESCROW_TO_BALANCE_TIME_IN_MS = 1000 * 60 * 3;
async function orderProcessingJob() {
    n++;
    try {
        console.log('\n ORDER PROCESSING JOB:', n);
        const ordersToProcess = await order_service_1.orderService.getDeliveredOrders();
        for (const order of ordersToProcess) {
            const timeDelta = Date.now() - order.paidAt.getTime();
            if (timeDelta > ESCROW_TO_BALANCE_TIME_IN_MS) {
                const store = await store_service_1.storeService.getStoreByStoreId(order.store);
                if (store) {
                    store.escrowBalance -= order.amountPaid;
                    store.mainBalance += order.amountPaid;
                    order.status = order_interface_1.OrderStatus.COMPLETED;
                    await Promise.all([store.save(), order.save()]);
                    transaction_queue_1.transactionQueue.addTransactionJob('addTransactionToDB', {
                        storeId: store._id,
                        order: order._id,
                        user: order.user.userId,
                        amount: Number(order.amountPaid),
                        type: transaction_interface_1.TransactionType.DEPOSIT
                    });
                    // SEND NOTIFICATION TO STORE:
                    notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
                        key: `${store._id}`,
                        value: {
                            title: 'Payment 🥳🎉',
                            body: `₦${order.amountPaid} has been moved to your main balance.`
                        }
                    });
                }
            }
        }
    }
    catch (err) {
        log.error(`Error processing order payment movement`, err);
    }
}
exports.orderProcessingJob = orderProcessingJob;
