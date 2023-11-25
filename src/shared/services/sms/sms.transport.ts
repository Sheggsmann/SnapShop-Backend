import { config } from '@root/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import axios from 'axios';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SMS');

type MsgResponse = 'error' | 'success';

const snsClient = new SNSClient({
  region: 'us-east-2'
});

class SmsTransport {
  private async awsDevSmsSender(receiverMobileNumber: string, body: string): Promise<MsgResponse> {
    try {
      await snsClient.send(
        new PublishCommand({
          Message: body,
          PhoneNumber: receiverMobileNumber
        })
      );

      return Promise.resolve('success');
    } catch (err) {
      log.error(err);
      return Promise.resolve('error');
    }
  }

  private async awsProdSmsSender(receiverMobileNumber: string, body: string): Promise<MsgResponse> {
    try {
      await snsClient.send(
        new PublishCommand({
          Message: body,
          PhoneNumber: receiverMobileNumber
        })
      );

      return Promise.resolve('success');
    } catch (err) {
      log.error(err);
      return Promise.resolve('error');
    }
  }

  private async devSmsSender(receiverMobileNumber: string, body: string, type: string): Promise<MsgResponse> {
    try {
      const response = await axios.post('https://www.bulksmsnigeria.com/api/v2/sms', {
        from: 'SnapShup',
        body,
        to: receiverMobileNumber,
        api_token: config.BULKSMS_API_KEY
      });

      log.info('\nSMS RESPONSE:', response.data);
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
      const response = await axios.post('https://www.bulksmsnigeria.com/api/v2/sms', {
        from: 'SnapShup',
        body,
        to: receiverMobileNumber,
        api_token: config.BULKSMS_API_KEY
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
