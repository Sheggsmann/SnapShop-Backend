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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    message(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, storeId, userId, storeName, userName, body, isRead, isReply, isOrder, orderId, reply, images } = req.body;
            const messageObjectId = new mongodb_1.ObjectId();
            const conversationObjectId = !conversationId
                ? new mongodb_1.ObjectId()
                : new mongoose_1.default.Types.ObjectId(conversationId);
            // TODO: Handle image upload
            if (images) {
                //
            }
            const messageData = {
                _id: `${messageObjectId}`,
                conversationId: conversationObjectId,
                user: userId,
                store: storeId,
                userName,
                storeName,
                body,
                isRead: !!isRead,
                isReply: !!isReply,
                isOrder: !!isOrder,
                order: isOrder ? new mongoose_1.default.Types.ObjectId(orderId) : null,
                images: [],
                reply: isReply ? { messageId: reply.messageId, body: reply.body, images: reply.images } : undefined,
                deleted: false
            };
            // TODO: emit socket.io event
            // TODO: add sender to chatlist in cache
            // TODO: add receiver to chatlist in cache
            // TODO: add message data to cache
            // TODO: add message to message queue
            yield chat_queue_1.chatQueue.addChatJob('addChatMessageToDB', messageData);
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Message added', conversationId: conversationObjectId });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(chat_scheme_1.addChatSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "message", null);
exports.addChatMessage = new Add();