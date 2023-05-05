import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { chatQueue } from '@service/queues/chat.queue';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { validator } from '@global/helpers/joi-validation-decorator';
import { IMessageData } from '@chat/interfaces/chat.interface';
import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

// The appFrom in the body indicates if a chat message is coming from the user app
// or the merchant app

class Add {
  @validator(addChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const {
      conversationId,
      storeId,
      userId,
      storeName,
      userName,
      body,
      isRead,
      isReply,
      isOrder,
      orderId,
      reply,
      images
    } = req.body;

    const messageObjectId: ObjectId = new ObjectId();
    const conversationObjectId: ObjectId = !conversationId
      ? new ObjectId()
      : new mongoose.Types.ObjectId(conversationId);

    // TODO: Handle image upload
    if (images) {
      //
    }

    const messageData: IMessageData = {
      _id: `${messageObjectId}`,
      conversationId: conversationObjectId,
      user: userId,
      store: storeId,
      userName,
      storeName,
      body,
      isRead: !!isRead,
      isReply: !!isReply,
      isOrder: !!isOrder,
      order: isOrder ? new mongoose.Types.ObjectId(orderId) : null,
      images: [],
      reply: isReply ? { messageId: reply.messageId, body: reply.body, images: reply.images } : undefined,
      deleted: false
    } as IMessageData;

    // TODO: emit socket.io event

    // TODO: add sender to chatlist in cache
    // TODO: add receiver to chatlist in cache

    // TODO: add message data to cache
    // TODO: add message to message queue
    await chatQueue.addChatJob('addChatMessageToDB', messageData);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Message added', conversationId: conversationObjectId });
  }
}

export const addChatMessage: Add = new Add();
