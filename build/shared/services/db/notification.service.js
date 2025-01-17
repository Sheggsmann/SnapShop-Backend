"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const user_service_1 = require("./user.service");
const store_service_1 = require("./store.service");
class NotificationService {
    constructor() {
        this.expo = new expo_server_sdk_1.Expo();
    }
    async sendNotification(pushTokens, notificationMessage) {
        const messages = [];
        for (const pushToken of pushTokens) {
            console.log('\nSENDING PUSH NOTIFICATIOn');
            if (!expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
                console.log('\nINVALID PUSH TOKEN:', pushToken);
                continue;
            }
            messages.push({
                to: pushToken,
                sound: 'default',
                body: notificationMessage.body,
                title: notificationMessage.title
            });
        }
        const chunks = this.expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                console.log('\nPUSH NOTIFICATION TICKET:', ticketChunk);
                tickets.push(...ticketChunk);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    async sendSingleNotification(pushToken, notificationMessage) {
        await this.sendNotification([pushToken], notificationMessage);
    }
    async sendNotificationToUser(userId, notificationMessage) {
        const user = await user_service_1.userService.getUserById(userId);
        if (!user)
            return;
        const pushToken = user?.expoPushToken;
        if (pushToken)
            await this.sendNotification([pushToken], notificationMessage);
    }
    async sendNotificationToStore(storeId, notificationMessage) {
        const store = await store_service_1.storeService.getStoreByStoreId(storeId);
        if (!store)
            return;
        const pushToken = store?.expoPushToken;
        if (pushToken)
            await this.sendNotification([pushToken], notificationMessage);
    }
    async sendNotificationToAdmins(notificationmessage) {
        const stores = await Promise.all([
            store_service_1.storeService.getStoreByStoreId('65670927d02c228b69f90a5f'),
            store_service_1.storeService.getStoreByStoreId('65675ef7e4c84fdb735651f1')
        ]);
        const pushTokens = stores.map((store) => `${store?.expoPushToken}`);
        if (pushTokens && pushTokens.length)
            await this.sendNotification(pushTokens, notificationmessage);
    }
}
exports.notificationService = new NotificationService();
