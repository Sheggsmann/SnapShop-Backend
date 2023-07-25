"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const client = config_1.config.twilioConfig();
const log = config_1.config.createLogger('SMS');
class SmsTransport {
    async devSmsSender(receiverMobileNumber, body, type) {
        try {
            const message = await client.messages.create({
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
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async prodSmsSender() {
        return 'error';
    }
    async sendSms(receiverMobileNumber, body, type = 'sms') {
        if (config_1.config.NODE_ENV === 'development') {
            return this.devSmsSender(receiverMobileNumber, body, type);
        }
        else {
            return this.prodSmsSender();
        }
    }
}
exports.smsTransport = new SmsTransport();
