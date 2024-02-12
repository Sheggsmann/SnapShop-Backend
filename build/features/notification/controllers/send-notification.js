"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const notification_service_1 = require("../../../shared/services/db/notification.service");
const store_service_1 = require("../../../shared/services/db/store.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const notification_queue_1 = require("../../../shared/services/queues/notification.queue");
const notification_scheme_1 = require("../schemes/notification.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Send {
    async toUser(req, res) {
        const { message, title } = req.body;
        const { userId } = req.params;
        await notification_service_1.notificationService.sendNotificationToUser(userId, {
            title,
            body: message
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
    async toStore(req, res) {
        const { message, title } = req.body;
        const { storeId } = req.params;
        await notification_service_1.notificationService.sendNotificationToStore(storeId, { title, body: message });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
    async toAllUsers(req, res) {
        // TODO: Implement strategy for batching
        const { message, title } = req.body;
        const users = await user_service_1.userService.getUsers(0, 2147483647);
        const userPushTokens = [];
        for (const user of users) {
            if (user?.expoPushToken) {
                userPushTokens.push(user.expoPushToken);
            }
        }
        notification_queue_1.notificationQueue.addNotificationJob('sendPushtNotificationToAllUsers', {
            key: userPushTokens,
            value: {
                title,
                body: message
            }
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
    async toAllStores(req, res) {
        const { message, title } = req.body;
        const stores = await store_service_1.storeService.getStores(0, 2147483647);
        const storePushTokens = [];
        for (const store of stores) {
            if (store?.expoPushToken) {
                storePushTokens.push(store.expoPushToken);
            }
        }
        notification_queue_1.notificationQueue.addNotificationJob('sendPushtNotificationToAllStores', {
            key: storePushTokens,
            value: {
                title,
                body: message
            }
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
    async toAll(req, res) {
        // TODO: Implement strategy to send this through a job queue and to use batching..
        const { title, message } = req.body;
        const [users, stores] = await Promise.all([
            user_service_1.userService.getUsers(0, 2147483647),
            store_service_1.storeService.getStores(0, 2147483647)
        ]);
        const pushTokens = [];
        const usersLength = users.length;
        const storesLength = stores.length;
        const maxLength = Math.max(usersLength, storesLength);
        for (let i = 0; i < maxLength; i++) {
            if (i < usersLength) {
                if (users[i]?.expoPushToken) {
                    pushTokens.push(users[i].expoPushToken);
                }
            }
            if (i < storesLength) {
                if (stores[i]?.expoPushToken) {
                    pushTokens.push(stores[i]?.expoPushToken);
                }
            }
        }
        notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToAll', {
            key: pushTokens,
            value: {
                title,
                body: message
            }
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toUser", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toStore", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toAllUsers", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toAllStores", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toAll", null);
exports.sendNotification = new Send();
