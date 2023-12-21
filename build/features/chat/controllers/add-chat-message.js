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
exports.addChatMessage = void 0;
const mongodb_1 = require("mongodb");
const chat_queue_1 = require("../../../shared/services/queues/chat.queue");
const chat_scheme_1 = require("../schemes/chat.scheme");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// The appFrom in the body indicates if a chat message is coming from the user app
// or the merchant app
class Add {
    async message(req, res) {
        const { conversationId, senderId, receiverId, senderType, receiverType, storeName, userName, body, isRead, isReply, isOrder, order, reply, images } = req.body;
        const messageObjectId = new mongodb_1.ObjectId();
        const conversationObjectId = !conversationId
            ? new mongodb_1.ObjectId()
            : new mongoose_1.default.Types.ObjectId(conversationId);
        // TODO: Handle image upload
        if (images) {
            //
        }
        let orderId;
        let orderData = null;
        if (isOrder) {
            orderId = new mongodb_1.ObjectId();
            orderData = {
                _id: orderId,
                amount: order.amount,
                products: order.products,
                status: order.status
            };
            // orderQueue.addOrderJob('addOrderToDB', {
            //   value: {
            //     _id: orderId,
            //     store: receiverId,
            //     user: {
            //       userId: req.currentUser!.userId,
            //       name: '',
            //       mobileNumber: req.currentUser!.mobileNumber
            //     },
            //     products: order.products
            //   }
            // });
        }
        const messageData = {
            _id: `${messageObjectId}`,
            conversationId: conversationObjectId,
            sender: senderId,
            receiver: receiverId,
            senderType,
            receiverType,
            userName,
            storeName,
            status: 'pending',
            body,
            isRead: !!isRead,
            isReply: !!isReply,
            isOrder: !!isOrder,
            order: orderData,
            images: [],
            reply: isReply ? { messageId: reply.messageId, body: reply.body, images: reply.images } : undefined,
            deleted: false
        };
        // TODO: emit socket.io event
        // TODO: add sender to chatlist in cache
        // TODO: add receiver to chatlist in cache
        // TODO: add message data to cache
        // TODO: add message to message queue
        chat_queue_1.chatQueue.addChatJob('addChatMessageToDB', messageData);
        res.status(http_status_codes_1.default.CREATED).json({ message: 'Message added', conversationId: conversationObjectId });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(chat_scheme_1.addChatSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "message", null);
exports.addChatMessage = new Add();
