"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessage = void 0;
const chat_service_1 = require("../../../shared/services/db/chat.service");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
class Get {
    async conversationList(req, res) {
        let list = [];
        // TODO: Implement caching and try to fetch from cache first
        /* Checks if the request is coming from the store app or from
         a normal user app (stores don't have store ids)
        */
        const entityId = req.currentUser?.storeId ? req.currentUser.storeId : req.currentUser.userId;
        list = await chat_service_1.chatService.getConversationList(new mongoose_1.default.Types.ObjectId(entityId));
        res.status(http_status_codes_1.default.OK).json({ message: 'Conversation List', list });
    }
    // TODO: Implement pagination
    async messages(req, res) {
        const { storeId, userId } = req.query;
        if (!storeId || !userId)
            throw new error_handler_1.BadRequestError('StoreId and UserId are required');
        let messages = [];
        // TODO: implement caching and try to fetch from cache first
        messages = await chat_service_1.chatService.getConversationMessages(new mongoose_1.default.Types.ObjectId(userId), new mongoose_1.default.Types.ObjectId(storeId), { createdAt: 1 });
        res.status(http_status_codes_1.default.OK).json({ message: 'Conversation Messages', messages });
    }
}
exports.getChatMessage = new Get();
