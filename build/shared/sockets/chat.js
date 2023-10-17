"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOChatHandler = exports.socketIOChatObject = void 0;
const config_1 = require("../../config");
const chat_cache_1 = require("../services/redis/chat.cache");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
            // Listen for private message
            socket.on('private:message', async ({ message, to }) => {
                console.log('PRIVATE MESSAGE:', message);
                socket
                    .to(to)
                    .to(currentAuthId)
                    .emit('private:message', { ...message, from: currentAuthId });
            });
            socket.on('disconnect', async () => {
                await chatCache.userIsOffline(currentAuthId);
                // Emit user disconnection
            });
        });
    }
}
exports.SocketIOChatHandler = SocketIOChatHandler;
