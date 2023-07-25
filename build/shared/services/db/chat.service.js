"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const chat_model_1 = require("../../../features/chat/models/chat.model");
const conversation_model_1 = require("../../../features/chat/models/conversation.model");
class ChatService {
    async addChatMessageToDB(data) {
        const conversation = await conversation_model_1.ConversationModel.findOne({
            _id: data.conversationId
        });
        if (!conversation) {
            await conversation_model_1.ConversationModel.create({
                _id: data.conversationId,
                user: data.user,
                store: data.store
            });
        }
        await chat_model_1.MessageModel.create(data);
    }
    async getConversationList(entityId) {
        const messages = await chat_model_1.MessageModel.aggregate([
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
    }
    // TODO: Implement pagination
    async getConversationMessages(userId, storeId, sort) {
        const query = {
            user: userId,
            store: storeId
        };
        const messages = await chat_model_1.MessageModel.aggregate([{ $match: query }, { $sort: sort }]);
        return messages;
    }
}
exports.chatService = new ChatService();
