"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const chat_model_1 = require("../../../features/chat/models/chat.model");
const conversation_model_1 = require("../../../features/chat/models/conversation.model");
class ChatService {
    addChatMessageToDB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversation_model_1.ConversationModel.findOne({
                _id: data.conversationId
            });
            if (!conversation) {
                yield conversation_model_1.ConversationModel.create({
                    _id: data.conversationId,
                    user: data.user,
                    store: data.store
                });
            }
            yield chat_model_1.MessageModel.create(data);
        });
    }
    getConversationList(entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield chat_model_1.MessageModel.aggregate([
                { $match: { $or: [{ user: entityId }, { store: entityId }] } },
                { $group: { _id: '$conversationId', result: { $last: '$$ROOT' } } },
                {
                    $project: {
                        _id: '$result.id',
                        conversationId: '$result.conversationId',
                        store: '$result.store',
                        user: '$result.user',
                        userName: '$result.userName',
                        storeName: '$result.storeName',
                        body: '$result.body',
                        images: '$result.images',
                        isOrder: '$result.isOrder',
                        isRead: '$resut.isRead',
                        isReply: '$result.isReply',
                        reply: '$result.reply',
                        orderId: '$result.orderId',
                        createdAt: '$result.createdAt'
                    }
                },
                { $sort: { createdAt: -1 } }
            ]);
            return messages;
        });
    }
    // TODO: Implement pagination
    getConversationMessages(userId, storeId, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                user: userId,
                store: storeId
            };
            const messages = yield chat_model_1.MessageModel.aggregate([{ $match: query }, { $sort: sort }]);
            return messages;
        });
    }
}
exports.chatService = new ChatService();
