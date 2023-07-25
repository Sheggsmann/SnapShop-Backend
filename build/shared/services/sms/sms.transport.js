"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const axios_1 = __importDefault(require("axios"));
const client = config_1.config.twilioConfig();
const log = config_1.config.createLogger('SMS');
class SmsTransport {
    async devSmsSender(receiverMobileNumber, body, type) {
        // try {
        //   const message = await client.messages.create({
        //     body,
        //     from: type === 'sms' ? `${config.TWILIO_NUMBER}` : `whatsapp:${config.TWILIO_WHATSAPP}`,
        //     to: type === 'sms' ? `${receiverMobileNumber}` : `whatsapp:${receiverMobileNumber}`
        //   });
        //   console.log(message);
        //   return Promise.resolve('success');
        // } catch (err) {
        //   log.error(err);
        //   return Promise.resolve('error');
        // }
        try {
            const response = await axios_1.default.post(config_1.config.TERMII_URL, {
                to: receiverMobileNumber,
                sms: body,
                api_key: config_1.config.TERMII_API_KEY
            });
            return Promise.resolve('success');
        }
        catch (err) {
            log.error(err);
            return Promise.resolve('error');
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async prodSmsSender(receiverMobileNumber, body, type) {
        try {
            const response = await axios_1.default.post(config_1.config.TERMII_URL, {
                to: receiverMobileNumber,
                sms: body,
                api_key: config_1.config.TERMII_API_KEY
            });
            return Promise.resolve('success');
        }
        catch (err) {
            log.error(err);
            return Promise.resolve('error');
        }
    }
    async sendSms(receiverMobileNumber, body, type = 'sms') {
        if (config_1.config.NODE_ENV === 'development') {
            return this.devSmsSender(receiverMobileNumber, body, type);
        }
        else {
            return this.prodSmsSender(receiverMobileNumber, body, type);
        }
    }
}
exports.smsTransport = new SmsTransport();
