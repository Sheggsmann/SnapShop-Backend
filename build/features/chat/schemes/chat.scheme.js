"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addChatSchema = joi_1.default.object().keys({
    conversationId: joi_1.default.string().optional().allow(null, ''),
    userId: joi_1.default.string().required(),
    storeId: joi_1.default.string().required(),
    userName: joi_1.default.string().required(),
    storeName: joi_1.default.string().required(),
    body: joi_1.default.string().optional().allow(null, ''),
    images: joi_1.default.array().max(5).optional(),
    isRead: joi_1.default.boolean().optional(),
    isReply: joi_1.default.boolean().optional(),
    isOrder: joi_1.default.boolean().optional(),
    orderId: joi_1.default.string().optional(),
    reply: joi_1.default.object().optional()
});
exports.addChatSchema = addChatSchema;