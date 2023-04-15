import { config } from '@root/config';
import Logger from 'bunyan';

const client = config.twilioConfig();
const log: Logger = config.createLogger('SMS');

type MsgResponse = 'error' | 'success';

class SmsTransport {
  private async devSmsSender(receiverMobileNumber: string, body: string, type: string): Promise<MsgResponse> {
    try {
      const message = await client.messages.create({
        body,
        from: type === 'sms' ? `${config.TWILIO_NUMBER}` : `whatsapp:${config.TWILIO_WHATSAPP}`,
        to: type === 'sms' ? `${receiverMobileNumber}` : `whatsapp:${receiverMobileNumber}`
      });

      console.log(message);
      return Promise.resolve('success');
    } catch (err) {
      log.error(err);
      return Promise.resolve('error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async prodSmsSender(): Promise<MsgResponse> {
    return 'error';
  }

  public async sendSms(receiverMobileNumber: string, body: string, type = 'sms'): Promise<MsgResponse> {
    if (config.NODE_ENV === 'development') {
      return this.devSmsSender(receiverMobileNumber, body, type);
    } else {
      return this.prodSmsSender();
    }
  }
}

export const smsTransport: SmsTransport = new SmsTransport();
