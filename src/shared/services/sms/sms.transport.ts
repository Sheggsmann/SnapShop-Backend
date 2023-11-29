import { config } from '@root/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import axios, { isAxiosError } from 'axios';
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

  private async devBulkSmsSender(receiverMobileNumber: string, body: string): Promise<MsgResponse> {
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

  private async termiiSmsSender(
    receiverMobileNumber: string,
    body: string,
    type: string
  ): Promise<MsgResponse> {
    try {
      const response = await axios.post('https://api.ng.termii.com/api/sms/send', {
        api_key: config.TERMII_API_KEY,
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
    } catch (err) {
      log.error(err);
      if (isAxiosError(err)) {
        log.error(err.response?.data);
      }
      return Promise.resolve('error');
    }
  }

  private async devSmsSender(receiverMobileNumber: string, body: string, type: string): Promise<MsgResponse> {
    return this.awsDevSmsSender(receiverMobileNumber, body);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async prodSmsSender(
    receiverMobileNumber: string,
    body: string,
    type: string
  ): Promise<MsgResponse> {
    return this.awsProdSmsSender(receiverMobileNumber, body);
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
