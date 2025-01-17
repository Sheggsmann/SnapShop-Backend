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
const order_interface_1 = require("../../features/order/interfaces/order.interface");
const order_queue_1 = require("../services/queues/order.queue");
const user_service_1 = require("../services/db/user.service");
const notification_queue_1 = require("../services/queues/notification.queue");
const analytics_queue_1 = require("../services/queues/analytics.queue");
const email_queue_1 = require("../services/queues/email.queue");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const store_service_1 = require("../services/db/store.service");
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
            socket.on('private:message', async (data, callback) => {
                const { message, to } = data;
                const messageId = new mongodb_1.ObjectId();
                const conversationObjectId = message?.conversationId
                    ? message.conversationId
                    : `${new mongoose_1.default.Types.ObjectId()}`;
                message._id = `${messageId}`;
                message.createdAt = Date.now();
                await this.addChatMessage(message, conversationObjectId, socket);
                if (!message?.conversationId) {
                    socket.emit('new:conversationId', {
                        conversationId: conversationObjectId,
                        lastMessage: message.body
                    });
                }
                socket
                    .to(to)
                    .to(currentAuthId)
                    .emit('private:message', { message, from: currentAuthId, conversationId: conversationObjectId });
                if (callback) {
                    callback({ messageId });
                }
            });
            // Listen for tracking events
            socket.on('track', async (data) => {
                analytics_queue_1.analyticsQueue.addAnalyticsJob('addAnalyticsToDB', { value: data });
            });
            socket.on('disconnect', async () => {
                await chatCache.userIsOffline(currentAuthId);
                // Emit user disconnection
            });
        });
    }
    async addChatMessage(message, conversationId, socket) {
        try {
            const { error } = await chat_scheme_1.addChatSchema.validate(message);
            if (error) {
                log.error('Validation Error:', error.details);
                throw new Error('Message validation failed');
            }
            const { sender, receiver, senderType, receiverType, senderUsername, body, isReply, status, reply, isOrder, order, images, createdAt } = message;
            /**
             * If it is an order, create the order here
             *
             * only a user can create an order,
             *
             * if orderMessage:
             *   sender = userId
             *   senderType = "User"
             *
             *   receiver = storeId
             *   receiverType = "Store"
             *
             * Store Owners cannot create an order themselves
             */
            console.log('\n\nMESSAGE:', message);
            let orderId = null;
            if (isOrder) {
                orderId = new mongodb_1.ObjectId();
                if (senderType === 'User' && receiverType === 'Store') {
                    const user = await user_service_1.userService.getUserById(socket.user.userId);
                    order_queue_1.orderQueue.addOrderJob('addOrderToDB', {
                        value: {
                            _id: orderId,
                            store: receiver,
                            user: {
                                userId: user._id,
                                name: `${user.firstname} ${user.lastname}`,
                                mobileNumber: socket.user.mobileNumber
                            },
                            products: order.products
                        }
                    });
                    socket.to(receiver.toString()).emit('order:created', {
                        _id: orderId,
                        store: receiver,
                        user: {
                            userId: user._id,
                            name: `${user.firstname} ${user.lastname}`,
                            mobileNumber: socket.user.mobileNumber
                        },
                        products: order.products,
                        status: order_interface_1.OrderStatus.PENDING,
                        createdAt
                    });
                    const store = await store_service_1.storeService.getStoreByStoreId(`${receiver}`);
                    email_queue_1.emailQueue.addEmailJob('sendMailToAdmins', {
                        value: {
                            title: 'New Order 🥳',
                            body: `${(user.firstname, user.lastname)} placed an order from ${store?.name}`
                        }
                    });
                    if (store && store?.email) {
                        email_queue_1.emailQueue.addEmailJob('sendMailToReceiver', {
                            value: {
                                receiverEmail: store.email,
                                title: 'New Order 🥳',
                                body: store.name,
                                template: 'new-order'
                            }
                        });
                    }
                }
            }
            const messageData = {
                _id: `${message._id}`,
                status,
                conversationId,
                sender,
                receiver,
                senderType,
                receiverType,
                body,
                isRead: false,
                isReply: !!isReply,
                isOrder: !!isOrder,
                order: orderId,
                images: images ? images : [],
                reply,
                deleted: false,
                createdAt
            };
            // console.log('\nADDING MESSAGE TO DB:', messageData);
            chat_queue_1.chatQueue.addChatJob('addChatMessageToDB', messageData);
            if (isOrder) {
                notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
                    key: `${receiver}`,
                    value: { title: 'New Order 🥳🎉', body: 'You just received a new order' }
                });
            }
            else {
                const messageNotification = body.length > 80 ? body.substring(0, 80) + '...' : body;
                if (senderType === 'User') {
                    notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
                        key: `${receiver}`,
                        value: { title: senderUsername, body: messageNotification }
                    });
                }
                if (senderType === 'Store') {
                    notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToUser', {
                        key: `${receiver}`,
                        value: { title: senderUsername, body: messageNotification }
                    });
                }
            }
        }
        catch (err) {
            log.error(err);
        }
    }
}
exports.SocketIOChatHandler = SocketIOChatHandler;
