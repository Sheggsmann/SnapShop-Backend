"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWorker = void 0;
const config_1 = require("../../config");
const chat_service_1 = require("../services/db/chat.service");
const log = config_1.config.createLogger('chat worker');
class ChatWorker {
    async addChatMessageToDB(job, done) {
        try {
            const { data } = job;
            await chat_service_1.chatService.addChatMessageToDB(data);
            job.progress(100);
            done(null, data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.chatWorker = new ChatWorker();
