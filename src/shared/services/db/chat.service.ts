import { IMessageData } from '@chat/interfaces/chat.interface';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { MessageModel } from '@chat/models/chat.model';
import { ConversationModel } from '@chat/models/conversation.model';
import { ObjectId } from 'mongodb';

class ChatService {
  public async addChatMessageToDB(data: IMessageData): Promise<void> {
    const conversation: IConversationDocument | null = await ConversationModel.findOne({
      _id: data.conversationId
    });

    if (!conversation) {
      await ConversationModel.create({
        _id: data.conversationId,
        user: data.user,
        store: data.store
      });
    }

    await MessageModel.create(data);
  }

  public async getConversationList(entityId: ObjectId): Promise<IMessageData[]> {
    const messages: IMessageData[] = await MessageModel.aggregate([
      { $match: { $or: [{ user: entityId }, { store: entityId }] } },
      { $group: { _id: '$conversationId', result: { $last: '$$ROOT' } } },
      {
        $project: {
          _id: '$result.id',
          conversationId: '$result.conversationId',
          store: '$result.store',
          user: '$result.user',
          userName: '$result.userName',
          storeName: '$result.storeName',
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
      user: userId,
      store: storeId
    };

    const messages: IMessageData[] = await MessageModel.aggregate([{ $match: query }, { $sort: sort }]);
    return messages;
  }
}

export const chatService: ChatService = new ChatService();
