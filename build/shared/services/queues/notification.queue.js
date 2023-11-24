"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = void 0;
const notification_worker_1 = require("../../workers/notification.worker");
const base_queue_1 = require("./base.queue");
class NotificationQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Notification');
        this.processJob('sendPushNotificationToUser', 5, notification_worker_1.notificationWorker.sendPushNotificationToUser);
        this.processJob('sendPushNotificationToStore', 5, notification_worker_1.notificationWorker.sendPushNotificationToStore);
    }
    addNotificationJob(name, data) {
        this.addJob(name, data);
    }
}
exports.notificationQueue = new NotificationQueue();
