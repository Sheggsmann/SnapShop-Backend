"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransport = void 0;
const config_1 = require("../../../config");
const nodemailer_1 = require("nodemailer");
class EmailTransport {
    otpHtmlTemplate(otp) {
        return `
        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
          <h2>SnapShup</h2>
          <p style="margin-bottom: 30px;">Here is your SnapShup Reset Password Token:</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; ">${otp}</h1>
          </div>
          `;
    }
    defaultTemplate(body) {
        return `<div>
      ${body}
    </div>`;
    }
    selectTemplate(template = 'default') {
        return (body) => {
            switch (template) {
                case 'default':
                    return this.defaultTemplate(body);
                case 'reset-password':
                    return this.otpHtmlTemplate(body);
                default:
                    return this.defaultTemplate(body);
            }
        };
    }
    //   private async zohoSmsSender(receiverEmail: string, body: string) {}
    //   private devEmailSender(receiverEmail: string, body: string) {}
    async prodEmailSender(receiverEmail, title, body, template) {
        const transport = (0, nodemailer_1.createTransport)({
            host: config_1.config.EMAIL_HOST,
            port: config_1.config.EMAIL_PORT,
            auth: {
                user: config_1.config.EMAIL_USER,
                pass: config_1.config.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: `"SnapShup" <support@geelgeworden.nl>`,
            to: receiverEmail,
            subject: title,
            text: template === 'reset-password' ? `Your SnapShup Reset Password OTP is ... ${body}` : body,
            html: this.selectTemplate(template)(body)
        };
        try {
            await transport.sendMail(mailOptions);
            return Promise.resolve('success');
        }
        catch (error) {
            console.error('\n\nEMAIL ERROR:', error);
            return Promise.resolve('error');
        }
    }
    async sendMail(receiverEmail, title, body, template = 'default') {
        return this.prodEmailSender(receiverEmail, title, body, template);
    }
    async sendMailToAdmins(title, body) {
        const adminEmails = ['promisesheggs@gmail.com', 'jaystance25@gmail.com'];
        for (const email of adminEmails) {
            this.prodEmailSender(email, title, body, 'default');
        }
    }
}
exports.emailTransport = new EmailTransport();
