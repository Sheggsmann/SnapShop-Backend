import { config } from '@root/config';
import { createTransport } from 'nodemailer';

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

  //   private async zohoSmsSender(receiverEmail: string, body: string) {}

  //   private devEmailSender(receiverEmail: string, body: string) {}

  private async prodEmailSender(receiverEmail: string, body: string): Promise<MsgResponse> {
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
      subject: 'SnapShup Reset Token ✅✅',
      text: 'Your SnapShup Reset Password OTP is ...',
      html: this.otpHtmlTemplate(body)
    };

    try {
      await transport.sendMail(mailOptions);
      return Promise.resolve('success');
    } catch (error) {
      console.error('\n\nEMAIL ERROR:', error);
      return Promise.resolve('error');
    }
  }

  public async sendMail(receiverEmail: string, body: string): Promise<MsgResponse> {
    return this.prodEmailSender(receiverEmail, body);
  }
}

export const emailTransport: EmailTransport = new EmailTransport();
