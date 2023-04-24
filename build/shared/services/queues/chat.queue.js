"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatQueue = void 0;
const base_queue_1 = require("./base.queue");
const chat_worker_1 = require("../../workers/chat.worker");
class ChatQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Chat');
        this.processJob('addChatMessageToDB', 5, chat_worker_1.chatWorker.addChatMessageToDB);
    }
    addChatJob(name, data) {
        this.addJob(name, data);
    }
}
exports.chatQueue = new ChatQueue();
