import { config } from '@root/config';
import Logger from 'bunyan';
import axios from 'axios';

const client = config.twilioConfig();
const log: Logger = config.createLogger('SMS');

type MsgResponse = 'error' | 'success';

class SmsTransport {
  private async devSmsSender(receiverMobileNumber: string, body: string, type: string): Promise<MsgResponse> {
    // try {
    //   const message = await client.messages.create({
    //     body,
    //     from: type === 'sms' ? `${config.TWILIO_NUMBER}` : `whatsapp:${config.TWILIO_WHATSAPP}`,
    //     to: type === 'sms' ? `${receiverMobileNumber}` : `whatsapp:${receiverMobileNumber}`
    //   });

    //   console.log(message);
    //   return Promise.resolve('success');
    // } catch (err) {
    //   log.error(err);
    //   return Promise.resolve('error');
    // }

    try {
      const response = await axios.post(config.TERMII_URL!, {
        to: receiverMobileNumber,
        sms: body,
        api_key: config.TERMII_API_KEY
      });
      return Promise.resolve('success');
    } catch (err) {
      log.error(err);
      return Promise.resolve('error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async prodSmsSender(
    receiverMobileNumber: string,
    body: string,
    type: string
  ): Promise<MsgResponse> {
    try {
      const response = await axios.post(config.TERMII_URL!, {
        to: receiverMobileNumber,
        sms: body,
        api_key: config.TERMII_API_KEY
      });
      return Promise.resolve('success');
    } catch (err) {
      log.error(err);
      return Promise.resolve('error');
    }
  }

  public async sendSms(receiverMobileNumber: string, body: string, type = 'sms'): Promise<MsgResponse> {
    if (config.NODE_ENV === 'development') {
      return this.devSmsSender(receiverMobileNumber, body, type);
    } else {
      return this.prodSmsSender(receiverMobileNumber, body, type);
    }
  }
}

export const smsTransport: SmsTransport = new SmsTransport();
