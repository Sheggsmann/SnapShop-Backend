import { Job, DoneCallback } from 'bull';
import { config } from '@root/config';
import { chatService } from '@service/db/chat.service';
import Logger from 'bunyan';

const log: Logger = config.createLogger('chat worker');

class ChatWorker {
  async addChatMessageToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;
      await chatService.addChatMessageToDB(data);

      job.progress(100);
      done(null, data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const chatWorker: ChatWorker = new ChatWorker();
