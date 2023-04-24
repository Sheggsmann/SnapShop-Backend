"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessage = void 0;
const chat_service_1 = require("../../../shared/services/db/chat.service");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    conversationList(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            // TODO: Implement caching and try to fetch from cache first
            /* Checks if the request is coming from the store app or from
             a normal user app (stores don't have store ids)
            */
            const entityId = ((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.storeId) ? req.currentUser.storeId : req.currentUser.userId;
            list = yield chat_service_1.chatService.getConversationList(new mongoose_1.default.Types.ObjectId(entityId));
            res.status(http_status_codes_1.default.OK).json({ message: 'Conversation List', list });
        });
    }
    // TODO: Implement pagination
    messages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId, userId } = req.params;
            let messages = [];
            // TODO: implement caching and try to fetch from cache first
            messages = yield chat_service_1.chatService.getConversationMessages(new mongoose_1.default.Types.ObjectId(userId), new mongoose_1.default.Types.ObjectId(storeId), { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Conversation Messages', messages });
        });
    }
}
exports.getChatMessage = new Get();
