"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const email_worker_1 = require("../../workers/email.worker");
const base_queue_1 = require("./base.queue");
class EmailQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Email');
        this.processJob('sendMailToAdmins', 5, email_worker_1.emailWorker.sendMailToAdmins);
    }
    addEmailJob(name, data) {
        this.addJob(name, data);
    }
}
exports.emailQueue = new EmailQueue();
