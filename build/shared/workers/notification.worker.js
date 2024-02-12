"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = void 0;
const config_1 = require("../../config");
const notification_service_1 = require("../services/db/notification.service");
const log = config_1.config.createLogger('notification worker');
class NotificationWorker {
    async sendPushNotification(job, done) {
        try {
            const { key, value } = job.data;
            await notification_service_1.notificationService.sendSingleNotification(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async sendPushNotificationToUser(job, done) {
        try {
            const { key, value } = job.data;
            await notification_service_1.notificationService.sendNotificationToUser(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async sendPushNotificationToStore(job, done) {
        try {
            const { key, value } = job.data;
            await notification_service_1.notificationService.sendNotificationToStore(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async sendMultiplePushNotifications(job, done) {
        try {
            // key here should be an array, ie: ["ExponentPushToken[w7wngZJBLRjKkFMgS5lVzp]", "ExponentPushToken[w7wngZJBLRjKkFMgS5lVzp]"]
            const { key, value } = job.data;
            await notification_service_1.notificationService.sendNotification(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.notificationWorker = new NotificationWorker();
