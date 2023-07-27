import { config } from '@root/config';
import Logger from 'bunyan';
import axios, { AxiosError } from 'axios';

// const client = config.twilioConfig();
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

    if (receiverMobileNumber.startsWith('+')) {
      receiverMobileNumber = receiverMobileNumber.slice(1);
    }

    try {
      const data = JSON.stringify({
        api_key: config.TERMII_API_KEY,
        to: receiverMobileNumber,
        from: 'Snapshup',
        sms: body,
        type: 'plain',
        channel: 'generic'
      });
      await axios.post(config.TERMII_URL!, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return Promise.resolve('success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError: AxiosError = err;
        log.error('\n\nAN ERROR OCCURRED:', axiosError.response?.data);
      }
      return Promise.resolve('error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async prodSmsSender(
    receiverMobileNumber: string,
    body: string,
    type: string
  ): Promise<MsgResponse> {
    if (receiverMobileNumber.startsWith('+')) {
      receiverMobileNumber = receiverMobileNumber.slice(1);
    }

    try {
      const data = JSON.stringify({
        api_key: config.TERMII_API_KEY,
        to: receiverMobileNumber,
        from: 'Snapshup',
        sms: body,
        type: 'plain',
        channel: 'generic'
      });
      const response = await axios.post(config.TERMII_URL!, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('\n\nTERMII RESPONSE:', response);
      return Promise.resolve('success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError: AxiosError = err;
        log.error('\n\nAN ERROR OCCURRED:', axiosError.response?.data);
      }
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
