"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOChatHandler = exports.socketIOChatObject = void 0;
const config_1 = require("../../config");
const chat_cache_1 = require("../services/redis/chat.cache");
const chat_scheme_1 = require("../../features/chat/schemes/chat.scheme");
const mongodb_1 = require("mongodb");
const chat_queue_1 = require("../services/queues/chat.queue");
const chat_service_1 = require("../services/db/chat.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const log = config_1.config.createLogger('CHAT-SOCKET');
const chatCache = new chat_cache_1.ChatCache();
class SocketIOChatHandler {
    constructor(io) {
        this.io = io;
        exports.socketIOChatObject = io;
    }
    listen() {
        this.io.use(async (socket, next) => {
            const authToken = socket.handshake.auth.authToken || socket.handshake.headers.access_token;
            if (!authToken) {
                return next(new Error('No Auth Token provided.'));
            }
            try {
                const user = jsonwebtoken_1.default.verify(authToken, config_1.config.JWT_TOKEN);
                socket.user = user;
                next();
            }
            catch (error) {
                return next(new Error('Invalid Token'));
            }
        });
        this.io.on('connection', async (socket) => {
            const user = socket.user;
            // Verify if connection is a store or if connection is a user
            const currentAuthId = user.storeId ? user.storeId : user.userId;
            console.log(user);
            // Once a socket connects, add him to a room with his UserId/StoreId
            socket.join(currentAuthId);
            // Add user to online_users set
            await chatCache.userIsOnline(currentAuthId);
            // Emit the conversation list to the connected user
            const conversationList = await chat_service_1.chatService.getConversationList(new mongoose_1.default.Types.ObjectId(currentAuthId));
            socket.emit('conversation:list', conversationList);
            // Listen for private message
            socket.on('private:message', async ({ message, to }) => {
                const conversationObjectId = message?.conversationId
                    ? new mongoose_1.default.Types.ObjectId(message.conversationId)
                    : new mongodb_1.ObjectId();
                await this.addChatMessage(message, conversationObjectId);
                // if (!message.conversationId && !user.storeId) {
                //   socket
                //     .to(currentAuthId)
                //     .emit('new:conversation', {
                //       _id: conversationObjectId,
                //       store: message.store,
                //       user: message.user
                //     });
                // }
                socket
                    .to(to)
                    .to(currentAuthId)
                    .emit('private:message', { ...message, from: currentAuthId, conversationId: conversationObjectId });
            });
            socket.on('disconnect', async () => {
                await chatCache.userIsOffline(currentAuthId);
                // Emit user disconnection
            });
        });
    }
    async addChatMessage(message, conversationId) {
        try {
            const values = await chat_scheme_1.addChatSchema.validate(message);
            log.info('\nVALIDATION RESULTS:', values);
            const { user, store, body, isReply, isOrder, order, images } = message;
            const messageId = new mongodb_1.ObjectId();
            const messageData = {
                _id: `${messageId}`,
                conversationId,
                user,
                store,
                body,
                isRead: false,
                isReply: !!isReply,
                isOrder: !!isOrder,
                order: isOrder ? new mongoose_1.default.Types.ObjectId(order) : null,
                images: images ? images : [],
                deleted: false
            };
            console.log('\nADDING MESSAGE TO DB:', messageData);
            chat_queue_1.chatQueue.addChatJob('addChatMessageToDB', message);
            // Add message to db
        }
        catch (err) {
            log.error(err);
        }
    }
}
exports.SocketIOChatHandler = SocketIOChatHandler;
