"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    // TODO: Add a conversation Id if you understand how redis works
    conversationId: { type: mongoose_1.Types.ObjectId, required: true },
    user: { type: mongoose_1.Types.ObjectId, required: true, ref: 'User' },
    store: { type: mongoose_1.Types.ObjectId, required: true, ref: 'Store' },
    body: String,
    images: [{ url: String }],
    isRead: { type: Boolean, default: false },
    isReply: { type: Boolean, default: false },
    isOrder: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    order: { type: mongoose_1.Types.ObjectId },
    reply: { messageId: mongoose_1.Types.ObjectId, body: String, images: [] }
}, {
    timestamps: true
});
const MessageModel = (0, mongoose_1.model)('Message', messageSchema, 'Message');
exports.MessageModel = MessageModel;
