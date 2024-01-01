import { BadRequestError } from '@global/helpers/error-handler';
import { chatService } from '@service/db/chat.service';
import { socketIOChatObject } from '@socket/chat';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Add {
  public async conversation(req: Request, res: Response): Promise<void> {
    const { userId, storeId } = req.body;

    if (!userId || !storeId) throw new BadRequestError('storeId and userId are required');

    let conversation = await chatService.getConversation(userId, storeId);
    if (conversation) {
      res.status(HTTP_STATUS.OK).json({ message: 'Conversation already exists', conversation });
      return;
    }

    conversation = await chatService.createConversation({ user: userId, store: storeId });

    if (conversation) {
      await conversation.populate('user', '_id firstname lastname profilePicture mobileNumber');
      await conversation.populate('store', '_id name image mobileNumber');

      socketIOChatObject.to(storeId).emit('new:conversation', { conversation });
      res.status(HTTP_STATUS.CREATED).json({ message: 'Conversation created', conversation });
      return;
    }

    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Could not create conversation' });
  }
}

export const createConversation: Add = new Add();
