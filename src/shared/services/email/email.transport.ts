import { config } from '@root/config';
import { createTransport } from 'nodemailer';
import { TemplateType } from './email.interface';

type MsgResponse = 'error' | 'success';

class EmailTransport {
  private otpHtmlTemplate(otp: string) {
    return `
        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
          <h2>SnapShup</h2>
          <p style="margin-bottom: 30px;">Here is your SnapShup Reset Password Token:</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; ">${otp}</h1>
          </div>
          `;
  }

  private newOrderHtmlTemplate(storeName: string) {
    return `
    <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
          <h2>New Order 🥳</h2>
          <p style="margin-bottom: 30px;">Hi ${storeName}, you just received a new order on SnapShup</p>
          </div>
    `;
  }

  private defaultTemplate(body: string): string {
    return `<div>
      ${body}
    </div>`;
  }

  private selectTemplate(template = 'default') {
    return (body: string) => {
      switch (template) {
        case 'default':
          return this.defaultTemplate(body);
        case 'reset-password':
          return this.otpHtmlTemplate(body);
        case 'new-order':
          return this.newOrderHtmlTemplate(body);
        default:
          return this.defaultTemplate(body);
      }
    };
  }

  //   private async zohoSmsSender(receiverEmail: string, body: string) {}

  //   private devEmailSender(receiverEmail: string, body: string) {}

  private async prodEmailSender(
    receiverEmail: string,
    title: string,
    body: string,
    template: TemplateType
  ): Promise<MsgResponse> {
    const transport = createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
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
    } catch (error) {
      console.error('\n\nEMAIL ERROR:', error);
      return Promise.resolve('error');
    }
  }

  public async sendMail(
    receiverEmail: string,
    title: string,
    body: string,
    template: TemplateType = 'default'
  ): Promise<MsgResponse> {
    return this.prodEmailSender(receiverEmail, title, body, template);
  }

  public async sendMailToAdmins(title: string, body: string) {
    const adminEmails = ['promisesheggs@gmail.com', 'jaystance25@gmail.com', 'snapshup@gmail.com'];
    for (const email of adminEmails) {
      this.prodEmailSender(email, title, body, 'default');
    }
  }
}

export const emailTransport: EmailTransport = new EmailTransport();
