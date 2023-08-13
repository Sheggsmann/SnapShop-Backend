"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const client_sns_1 = require("@aws-sdk/client-sns");
const log = config_1.config.createLogger('SMS');
const snsClient = new client_sns_1.SNSClient({
    region: 'us-east-2'
});
class SmsTransport {
    async devSmsSender(receiverMobileNumber, body, type) {
        try {
            await snsClient.send(new client_sns_1.PublishCommand({
                Message: body,
                PhoneNumber: receiverMobileNumber
            }));
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
            await snsClient.send(new client_sns_1.PublishCommand({
                Message: body,
                PhoneNumber: receiverMobileNumber
            }));
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
