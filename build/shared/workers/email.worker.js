"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const config_1 = require("../../config");
const email_transport_1 = require("../services/email/email.transport");
const log = config_1.config.createLogger('Email Worker');
class EmailWorker {
    async sendMailToAdmins(job, done) {
        try {
            const { value } = job.data;
            await email_transport_1.emailTransport.sendMailToAdmins(value.title, value.body);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.emailWorker = new EmailWorker();
