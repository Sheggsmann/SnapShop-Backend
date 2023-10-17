import { Request, Response } from 'express';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { chatService } from '@service/db/chat.service';
import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async conversationList(req: Request, res: Response): Promise<void> {
    let list: IMessageData[] = [];

    // TODO: Implement caching and try to fetch from cache first

    /* Checks if the request is coming from the store app or from
     a normal user app (stores don't have store ids)
    */
    console.log('\nCONVERSATION LIST CURRENT USER:', req.currentUser);

    const entityId = req.currentUser?.storeId ? req.currentUser.storeId : req.currentUser!.userId;
    list = await chatService.getConversationList(new mongoose.Types.ObjectId(entityId));

    res.status(HTTP_STATUS.OK).json({ message: 'Conversation List', list });
  }

  // TODO: Implement pagination
  public async messages(req: Request, res: Response): Promise<void> {
    const { storeId, userId } = req.params;

    let messages: IMessageData[] = [];

    // TODO: implement caching and try to fetch from cache first
    messages = await chatService.getConversationMessages(
      new mongoose.Types.ObjectId(userId),
      new mongoose.Types.ObjectId(storeId),
      { createdAt: -1 }
    );

    res.status(HTTP_STATUS.OK).json({ message: 'Conversation Messages', messages });
  }
}

export const getChatMessage: Get = new Get();
