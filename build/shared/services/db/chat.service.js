"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const chat_model_1 = require("../../../features/chat/models/chat.model");
const conversation_model_1 = require("../../../features/chat/models/conversation.model");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatService {
    async addChatMessageToDB(data) {
        const conversationIdString = data.conversationId;
        if (!mongoose_1.default.Types.ObjectId.isValid(conversationIdString)) {
            console.error('Invalid conversationId:', conversationIdString);
        }
        else {
            const conversationId = new mongoose_1.default.Types.ObjectId(conversationIdString);
            const conversation = await conversation_model_1.ConversationModel.findOne({
                _id: conversationId
            });
            if (!conversation) {
                await conversation_model_1.ConversationModel.create({
                    _id: conversationId,
                    user: data.user,
                    store: data.store
                });
            }
            await chat_model_1.MessageModel.create(data);
        }
    }
    async getConversationList(entityId) {
        const messages = await chat_model_1.MessageModel.aggregate([
            { $match: { $or: [{ user: entityId }, { store: entityId }] } },
            { $group: { _id: '$conversationId', result: { $last: '$$ROOT' } } },
            { $lookup: { from: 'Store', localField: 'result.store', foreignField: '_id', as: 'storeData' } },
            { $lookup: { from: 'User', localField: 'result.user', foreignField: '_id', as: 'userData' } },
            {
                $project: {
                    _id: '$result.id',
                    conversationId: '$result.conversationId',
                    store: { $arrayElemAt: ['$storeData', 0] },
                    user: { $arrayElemAt: ['$userData', 0] },
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
