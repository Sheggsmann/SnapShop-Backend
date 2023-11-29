"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsTransport = void 0;
const config_1 = require("../../../config");
const client_sns_1 = require("@aws-sdk/client-sns");
const axios_1 = __importStar(require("axios"));
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
    async devBulkSmsSender(receiverMobileNumber, body) {
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
    async termiiSmsSender(receiverMobileNumber, body, type) {
        try {
            const response = await axios_1.default.post('https://api.ng.termii.com/api/sms/send', {
                api_key: config_1.config.TERMII_API_KEY,
                to: receiverMobileNumber,
                from: 'Billings',
                sms: body,
                type: 'plain',
                route: {
                    type: 'corporate',
                    country: 'NG'
                }
            });
            log.info('\nSMS RESPONSE', response.data);
            return Promise.resolve('success');
        }
        catch (err) {
            log.error(err);
            if ((0, axios_1.isAxiosError)(err)) {
                log.error(err.response?.data);
            }
            return Promise.resolve('error');
        }
    }
    async devSmsSender(receiverMobileNumber, body, type) {
        return this.awsDevSmsSender(receiverMobileNumber, body);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async prodSmsSender(receiverMobileNumber, body, type) {
        return this.awsProdSmsSender(receiverMobileNumber, body);
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
