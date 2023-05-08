"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueue = void 0;
const base_queue_1 = require("./base.queue");
const user_worker_1 = require("../../workers/user.worker");
class UserQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('User');
        this.processJob('addUserToDB', 5, user_worker_1.userWorker.addUserToDB);
        this.processJob('updateUserInDB', 5, user_worker_1.userWorker.updateUserInDB);
    }
    addUserToDB(name, data) {
        this.addJob(name, data);
    }
}
exports.userQueue = new UserQueue();
