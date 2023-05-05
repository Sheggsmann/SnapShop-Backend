"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const add_chat_message_1 = require("../controllers/add-chat-message");
const get_chat_messages_1 = require("../controllers/get-chat-messages");
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const express_1 = __importDefault(require("express"));
class ChatRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/chat/messages/conversation-list', auth_middleware_1.authMiddleware.checkAuth, get_chat_messages_1.getChatMessage.conversationList);
        this.router.get('/chat/messages/conversation/:userId/:storeId', auth_middleware_1.authMiddleware.checkAuth, get_chat_messages_1.getChatMessage.messages);
        this.router.post('/chat/message', auth_middleware_1.authMiddleware.checkAuth, add_chat_message_1.addChatMessage.message);
        return this.router;
    }
}
exports.chatRoutes = new ChatRoutes();