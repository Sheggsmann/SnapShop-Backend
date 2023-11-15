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
            let conversation = await conversation_model_1.ConversationModel.findOne({
                _id: conversationId
            });
            if (!conversation) {
                conversation = await conversation_model_1.ConversationModel.findOne({
                    user: data.senderType === 'User' ? data.sender : data.receiver,
                    store: data.senderType === 'Store' ? data.sender : data.receiver
                });
                data.conversationId = conversation._id;
            }
            // If there's no conversation between the user and the store, create one
            if (!conversation) {
                await conversation_model_1.ConversationModel.create({
                    _id: conversationId,
                    user: data.senderType === 'User' ? data.sender : data.receiver,
                    store: data.senderType === 'Store' ? data.sender : data.receiver
                });
            }
            await chat_model_1.MessageModel.create(data);
        }
    }
    async getConversationList(entityId) {
        const messages = await chat_model_1.MessageModel.aggregate([
            { $match: { $or: [{ sender: entityId }, { receiver: entityId }] } },
            { $group: { _id: '$conversationId', result: { $last: '$$ROOT' } } },
            { $lookup: { from: 'User', localField: 'result.sender', foreignField: '_id', as: 'userSenderData' } },
            { $lookup: { from: 'Store', localField: 'result.sender', foreignField: '_id', as: 'storeSenderData' } },
            {
                $lookup: { from: 'User', localField: 'result.receiver', foreignField: '_id', as: 'userReceiverData' }
            },
            {
                $lookup: {
                    from: 'Store',
                    localField: 'result.receiver',
                    foreignField: '_id',
                    as: 'storeReceiverData'
                }
            },
            {
                $project: {
                    _id: '$result.id',
                    conversationId: '$result.conversationId',
                    senderType: '$result.senderType',
                    receiverType: '$result.receiverType',
                    sender: {
                        $cond: {
                            if: { $eq: ['$result.senderType', 'User'] },
                            then: {
                                _id: { $arrayElemAt: ['$userSenderData._id', 0] },
                                firstname: { $arrayElemAt: ['$userSenderData.firstname', 0] },
                                lastname: { $arrayElemAt: ['$userSenderData.lastname', 0] },
                                profilePicture: { $arrayElemAt: ['$userSenderData.profilePicture', 0] }
                            },
                            else: {
                                _id: { $arrayElemAt: ['$storeSenderData._id', 0] },
                                name: { $arrayElemAt: ['$storeSenderData.name', 0] },
                                image: { $arrayElemAt: ['$storeSenderData.image', 0] }
                            }
                        }
                    },
                    receiver: {
                        $cond: {
                            if: { $eq: ['$result.receiverType', 'User'] },
                            then: {
                                _id: { $arrayElemAt: ['$userReceiverData._id', 0] },
                                firstname: { $arrayElemAt: ['$userReceiverData.firstname', 0] },
                                lastname: { $arrayElemAt: ['$userReceiverData.lastname', 0] },
                                profilePicture: { $arrayElemAt: ['$userReceiverData.profilePicture', 0] }
                            },
                            else: {
                                _id: { $arrayElemAt: ['$storeReceiverData._id', 0] },
                                name: { $arrayElemAt: ['$storeReceiverData.name', 0] },
                                image: { $arrayElemAt: ['$storeReceiverData.image', 0] }
                            }
                        }
                    },
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
            $or: [
                { sender: userId, receiver: storeId },
                { sender: storeId, receiver: userId }
            ]
        };
        const messages = await chat_model_1.MessageModel.find(query)
            .sort(sort)
            .limit(100)
            .populate('order.products.product', '-quantity -purchaseCount');
        return messages;
    }
}
exports.chatService = new ChatService();
