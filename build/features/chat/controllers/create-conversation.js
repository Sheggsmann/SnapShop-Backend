"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const chat_service_1 = require("../../../shared/services/db/chat.service");
const chat_1 = require("../../../shared/sockets/chat");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Add {
    async conversation(req, res) {
        const { userId, storeId } = req.body;
        if (!userId || !storeId)
            throw new error_handler_1.BadRequestError('storeId and userId are required');
        let conversation = await chat_service_1.chatService.getConversation(userId, storeId);
        if (conversation) {
            res.status(http_status_codes_1.default.OK).json({ message: 'Conversation already exists', conversation });
            return;
        }
        conversation = await chat_service_1.chatService.createConversation({ user: userId, store: storeId });
        if (conversation) {
            await conversation.populate('user', '_id firstname lastname profilePicture mobileNumber');
            await conversation.populate('store', '_id name image mobileNumber');
            chat_1.socketIOChatObject.to(storeId).emit('new:conversation', { conversation });
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Conversation created', conversation });
            return;
        }
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Could not create conversation' });
    }
}
exports.createConversation = new Add();
