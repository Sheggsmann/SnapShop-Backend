"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWorker = void 0;
const config_1 = require("../../config");
const chat_service_1 = require("../services/db/chat.service");
const log = config_1.config.createLogger('chat worker');
class ChatWorker {
    addChatMessageToDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = job;
                yield chat_service_1.chatService.addChatMessageToDB(data);
                job.progress(100);
                done(null, data);
            }
            catch (err) {
                log.error(err);
                done(err);
            }
        });
    }
}
exports.chatWorker = new ChatWorker();
