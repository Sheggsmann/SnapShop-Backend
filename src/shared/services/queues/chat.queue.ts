import { IMessageData, IMessageDocument } from '@chat/interfaces/chat.interface';
import { BaseQueue } from './base.queue';
import { chatWorker } from '@worker/chat.worker';

class ChatQueue extends BaseQueue {
  constructor() {
    super('Chat');
    this.processJob('addChatMessageToDB', 5, chatWorker.addChatMessageToDB);
  }

  public addChatJob(name: string, data: IMessageData | IMessageDocument): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();
