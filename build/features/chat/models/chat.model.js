"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversationId: { type: mongoose_1.Types.ObjectId, required: true },
    sender: { type: mongoose_1.Types.ObjectId, required: true, redPath: 'senderType' },
    receiver: { type: mongoose_1.Types.ObjectId, required: true, refPath: 'receiverType' },
    senderType: { type: String, enum: ['User', 'Store'], required: true },
    receiverType: { type: String, enum: ['User', 'Store'], required: true },
    body: String,
    images: [{ url: String }],
    isRead: { type: Boolean, default: false },
    isReply: { type: Boolean, default: false },
    isOrder: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    order: {
        _id: mongoose_1.Types.ObjectId,
        amount: Number,
        status: String,
        products: [{ product: { type: mongoose_1.Types.ObjectId, ref: 'Product' }, quantity: Number }]
    },
    reply: {
        messageId: mongoose_1.Types.ObjectId,
        body: String,
        images: [],
        sender: mongoose_1.Types.ObjectId,
        receiver: mongoose_1.Types.ObjectId
    }
}, {
    timestamps: true
});
const MessageModel = (0, mongoose_1.model)('Message', messageSchema, 'Message');
exports.MessageModel = MessageModel;
