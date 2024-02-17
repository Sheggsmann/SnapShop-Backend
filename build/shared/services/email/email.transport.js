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
    //   private async zohoSmsSender(receiverEmail: string, body: string) {}
    //   private devEmailSender(receiverEmail: string, body: string) {}
    async prodEmailSender(receiverEmail, body) {
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
            subject: 'SnapShup Reset Token ✅✅',
            text: 'Your SnapShup Reset Password OTP is ...',
            html: this.otpHtmlTemplate(body)
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
    async sendMail(receiverEmail, body) {
        return this.prodEmailSender(receiverEmail, body);
    }
}
exports.emailTransport = new EmailTransport();
