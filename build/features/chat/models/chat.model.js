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
    order: { type: mongoose_1.Types.ObjectId, ref: 'Order', index: true },
    status: { type: String, enum: ['pending', 'delivered', 'read'], default: 'pending' },
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
