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
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const client = config_1.config.twilioConfig();
const log = config_1.config.createLogger('SMS');
class SmsTransport {
    devSmsSender(receiverMobileNumber, body, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield client.messages.create({
                    body,
                    from: type === 'sms' ? `${config_1.config.TWILIO_NUMBER}` : `whatsapp:${config_1.config.TWILIO_WHATSAPP}`,
                    to: type === 'sms' ? `${receiverMobileNumber}` : `whatsapp:${receiverMobileNumber}`
                });
                console.log(message);
                return Promise.resolve('success');
            }
            catch (err) {
                log.error(err);
                return Promise.resolve('error');
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    prodSmsSender() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'error';
        });
    }
    sendSms(receiverMobileNumber, body, type = 'sms') {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.config.NODE_ENV === 'development') {
                return this.devSmsSender(receiverMobileNumber, body, type);
            }
            else {
                return this.prodSmsSender();
            }
        });
    }
}
exports.smsTransport = new SmsTransport();
