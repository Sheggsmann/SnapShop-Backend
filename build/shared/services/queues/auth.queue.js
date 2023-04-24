"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authQueue = void 0;
const auth_worker_1 = require("../../workers/auth.worker");
const base_queue_1 = require("./base.queue");
class AuthQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Auth');
        this.processJob('addAuthUserToDB', 5, auth_worker_1.authWorker.addAuthUserToDB);
    }
    addAuthUserJob(name, data) {
        this.addJob(name, data);
    }
}
exports.authQueue = new AuthQueue();
