"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportOrder = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const order_interface_1 = require("../interfaces/order.interface");
const order_service_1 = require("../../../shared/services/db/order.service");
const order_queue_1 = require("../../../shared/services/queues/order.queue");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const order_scheme_1 = require("../schemes/order.scheme");
const notification_queue_1 = require("../../../shared/services/queues/notification.queue");
const chat_1 = require("../../../shared/sockets/chat");
const email_queue_1 = require("../../../shared/services/queues/email.queue");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ReportOrder {
    async report(req, res) {
        // Get the order Id and reason(body)
        const { orderId } = req.params;
        const { reason } = req.body;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (!order)
            throw new error_handler_1.NotFoundError('Order not found');
        // return bad request error if user did not place the order.
        if (order.user.userId.toString() !== req.currentUser.userId.toString())
            throw new error_handler_1.NotAuthorizedError('You cannot raise a dispute for this order');
        // ensure the order is delivered, completed orders or declined orders can't be reported
        if (order.status !== order_interface_1.OrderStatus.DELIVERED)
            throw new error_handler_1.BadRequestError('Order must be delivered');
        /*
        if checks pass: flag the order as dispute(money cannot be moved)
        store the reason to db
        */
        order.status = order_interface_1.OrderStatus.DISPUTE;
        order.reason = reason;
        order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
        chat_1.socketIOChatObject
            .to(order.store._id.toString())
            .to(order.user.userId.toString())
            .emit('order:update', { order });
        notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
            key: `${order.store._id}`,
            value: {
                title: `${order.user.name} reported an issue with their order 😞`,
                body: `${reason}`
            }
        });
        email_queue_1.emailQueue.addEmailJob('sendMailToAdmins', {
            value: {
                title: 'Order Dispute',
                body: `${order.user} reported an order from store ${order.store}`
            }
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Order report success', order });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(order_scheme_1.reportOrderSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportOrder.prototype, "report", null);
exports.reportOrder = new ReportOrder();
