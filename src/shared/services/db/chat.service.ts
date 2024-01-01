import { IMessageData } from '@chat/interfaces/chat.interface';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { MessageModel } from '@chat/models/chat.model';
import { ConversationModel } from '@chat/models/conversation.model';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

class ChatService {
  public async addChatMessageToDB(data: IMessageData): Promise<void> {
    const conversationIdString = data.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationIdString)) {
      console.error('Invalid conversationId:', conversationIdString);
    } else {
      let conversationId = new mongoose.Types.ObjectId(conversationIdString);
      let conversation: IConversationDocument | null = await ConversationModel.findOne({
        _id: conversationId
      });

      if (!conversation) {
        conversation = await ConversationModel.findOne({
          user: data.senderType === 'User' ? data.sender : data.receiver,
          store: data.senderType === 'Store' ? data.sender : data.receiver
        });

        if (conversation) {
          conversationId = conversation._id;
          data.conversationId = conversation._id;
        }
      }

      // If there's no conversation between the user and the store, create one
      if (!conversation) {
        await ConversationModel.create({
          _id: conversationId,
          user: data.senderType === 'User' ? data.sender : data.receiver,
          store: data.senderType === 'Store' ? data.sender : data.receiver
        });
      }

      await MessageModel.create(data);
    }
  }

  public async createConversation(
    conversationData: Partial<IConversationDocument>
  ): Promise<IConversationDocument> {
    const conversation = await ConversationModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: conversationData.user,
      store: conversationData.store
    });
    return conversation;
  }

  public async getConversation(userId: string, storeId: string): Promise<IConversationDocument | null> {
    return await ConversationModel.findOne({ user: userId, store: storeId })
      .populate('user', '_id firstname lastname profilePicture mobileNumber')
      .populate('store', '_id name image mobileNumber');
  }

  public async getConversationList(entityId: ObjectId): Promise<IMessageData[]> {
    const messages: IMessageData[] = await MessageModel.aggregate([
      { $match: { $or: [{ sender: entityId }, { receiver: entityId }] } },
      { $group: { _id: '$conversationId', result: { $last: '$$ROOT' } } },
      { $lookup: { from: 'User', localField: 'result.sender', foreignField: '_id', as: 'userSenderData' } },
      { $lookup: { from: 'Store', localField: 'result.sender', foreignField: '_id', as: 'storeSenderData' } },
      {
        $lookup: { from: 'User', localField: 'result.receiver', foreignField: '_id', as: 'userReceiverData' }
      },
      {
        $lookup: {
          from: 'Store',
          localField: 'result.receiver',
          foreignField: '_id',
          as: 'storeReceiverData'
        }
      },
      {
        $project: {
          _id: '$result.id',
          conversationId: '$result.conversationId',
          senderType: '$result.senderType',
          receiverType: '$result.receiverType',
          sender: {
            $cond: {
              if: { $eq: ['$result.senderType', 'User'] },
              then: {
                _id: { $arrayElemAt: ['$userSenderData._id', 0] },
                firstname: { $arrayElemAt: ['$userSenderData.firstname', 0] },
                lastname: { $arrayElemAt: ['$userSenderData.lastname', 0] },
                profilePicture: { $arrayElemAt: ['$userSenderData.profilePicture', 0] },
                mobileNumber: { $arrayElemAt: ['$userSenderData.mobileNumber', 0] }
              },
              else: {
                _id: { $arrayElemAt: ['$storeSenderData._id', 0] },
                name: { $arrayElemAt: ['$storeSenderData.name', 0] },
                image: { $arrayElemAt: ['$storeSenderData.image', 0] },
                mobileNumber: { $arrayElemAt: ['$storeSenderData.mobileNumber', 0] }
              }
            }
          },
          receiver: {
            $cond: {
              if: { $eq: ['$result.receiverType', 'User'] },
              then: {
                _id: { $arrayElemAt: ['$userReceiverData._id', 0] },
                firstname: { $arrayElemAt: ['$userReceiverData.firstname', 0] },
                lastname: { $arrayElemAt: ['$userReceiverData.lastname', 0] },
                profilePicture: { $arrayElemAt: ['$userReceiverData.profilePicture', 0] },
                mobileNumber: { $arrayElemAt: ['$userReceiverData.mobileNumber', 0] }
              },
              else: {
                _id: { $arrayElemAt: ['$storeReceiverData._id', 0] },
                name: { $arrayElemAt: ['$storeReceiverData.name', 0] },
                image: { $arrayElemAt: ['$storeReceiverData.image', 0] },
                mobileNumber: { $arrayElemAt: ['$storeReceiverData.mobileNumber', 0] }
              }
            }
          },
          body: '$result.body',
          images: '$result.images',
          isOrder: '$result.isOrder',
          isRead: '$resut.isRead',
          isReply: '$result.isReply',
          reply: '$result.reply',
          orderId: '$result.orderId',
          createdAt: '$result.createdAt'
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return messages;
  }

  // TODO: Implement pagination
  public async getConversationMessages(
    userId: ObjectId,
    storeId: ObjectId,
    sort: Record<string, 1 | -1>
  ): Promise<IMessageData[]> {
    const query = {
      $or: [
        { sender: userId, receiver: storeId },
        { sender: storeId, receiver: userId }
      ]
    };

    const messages: IMessageData[] = await MessageModel.find(query).sort(sort).limit(100).populate('order');

    return messages;
  }
}

export const chatService: ChatService = new ChatService();
