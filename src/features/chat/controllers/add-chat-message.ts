import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { chatQueue } from '@service/queues/chat.queue';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { validator } from '@global/helpers/joi-validation-decorator';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { IOrderData } from '@order/interfaces/order.interface';
import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

// The appFrom in the body indicates if a chat message is coming from the user app
// or the merchant app

class Add {
  @validator(addChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const {
      conversationId,
      senderId,
      receiverId,
      senderType,
      receiverType,
      storeName,
      userName,
      body,
      isRead,
      isReply,
      isOrder,
      order,
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

    let orderId: ObjectId;
    let orderData: IOrderData | null = null;

    if (isOrder) {
      orderId = new ObjectId();
      orderData = {
        _id: orderId,
        amount: order.amount,
        products: order.products,
        status: order.status
      };

      // orderQueue.addOrderJob('addOrderToDB', {
      //   value: {
      //     _id: orderId,
      //     store: receiverId,
      //     user: {
      //       userId: req.currentUser!.userId,
      //       name: '',
      //       mobileNumber: req.currentUser!.mobileNumber
      //     },
      //     products: order.products
      //   }
      // });
    }

    const messageData: IMessageData = {
      _id: `${messageObjectId}`,
      conversationId: conversationObjectId,
      sender: senderId,
      receiver: receiverId,
      senderType,
      receiverType,
      userName,
      storeName,
      body,
      isRead: !!isRead,
      isReply: !!isReply,
      isOrder: !!isOrder,
      order: orderData,
      images: [],
      reply: isReply ? { messageId: reply.messageId, body: reply.body, images: reply.images } : undefined,
      deleted: false
    } as IMessageData;

    // TODO: emit socket.io event

    // TODO: add sender to chatlist in cache
    // TODO: add receiver to chatlist in cache

    // TODO: add message data to cache
    // TODO: add message to message queue
    chatQueue.addChatJob('addChatMessageToDB', messageData);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Message added', conversationId: conversationObjectId });
  }
}

export const addChatMessage: Add = new Add();
