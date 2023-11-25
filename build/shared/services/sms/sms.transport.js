"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const client_sns_1 = require("@aws-sdk/client-sns");
const axios_1 = __importDefault(require("axios"));
const log = config_1.config.createLogger('SMS');
const snsClient = new client_sns_1.SNSClient({
    region: 'us-east-2'
});
class SmsTransport {
    async awsDevSmsSender(receiverMobileNumber, body) {
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
    async awsProdSmsSender(receiverMobileNumber, body) {
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
    async devSmsSender(receiverMobileNumber, body, type) {
        try {
            const response = await axios_1.default.post('https://www.bulksmsnigeria.com/api/v2/sms', {
                from: 'SnapShup',
                body,
                to: receiverMobileNumber,
                api_token: config_1.config.BULKSMS_API_KEY
            });
            log.info('\nSMS RESPONSE:', response.data);
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
            const response = await axios_1.default.post('https://www.bulksmsnigeria.com/api/v2/sms', {
                from: 'SnapShup',
                body,
                to: receiverMobileNumber,
                api_token: config_1.config.BULKSMS_API_KEY
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
