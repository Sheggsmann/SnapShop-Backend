import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import Logger from 'bunyan';

const client = config.twilioConfig();
const log: Logger = config.createLogger('SMS');

class SmsTransport {
  private async devSmsSender(receiverMobileNumber: string, body: string, type: string): Promise<void> {
    client.messages
      .create({
        body,
        from: type === 'sms' ? `${config.TWILIO_NUMBER}` : `whatsapp:${config.TWILIO_WHATSAPP}`,
        to: type === 'sms' ? `${receiverMobileNumber}` : `whatsapp:${receiverMobileNumber}`
      })
      .then((message) => console.log(message))
      .catch((err) => {
        log.error(err);
        throw new BadRequestError('Error sending sms');
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async prodSmsSender(): Promise<void> {}

  public async sendSms(receiverMobileNumber: string, body: string, type = 'sms'): Promise<void> {
    if (config.NODE_ENV === 'development') {
      this.devSmsSender(receiverMobileNumber, body, type);
    } else {
      this.prodSmsSender();
    }
  }
}

export const smsTransport: SmsTransport = new SmsTransport();
