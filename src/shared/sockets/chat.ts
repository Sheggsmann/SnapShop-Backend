import { AuthUserPayload } from '@auth/interfaces/auth.interface';
import { Server, Socket } from 'socket.io';
import { config } from '@root/config';
import { ChatCache } from '@service/redis/chat.cache';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { ObjectId } from 'mongodb';
import { chatQueue } from '@service/queues/chat.queue';
import { chatService } from '@service/db/chat.service';
import JWT from 'jsonwebtoken';
import Logger from 'bunyan';
import mongoose from 'mongoose';

const log: Logger = config.createLogger('CHAT-SOCKET');

const chatCache: ChatCache = new ChatCache();

export let socketIOChatObject: Server;

export interface UserSocket extends Socket {
  user?: AuthUserPayload;
}

export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.use(async (socket: UserSocket, next) => {
      const authToken =
        (socket.handshake.auth.authToken as string) || (socket.handshake.headers.access_token as string);

      if (!authToken) {
        return next(new Error('No Auth Token provided.'));
      }

      try {
        const user = JWT.verify(authToken, config.JWT_TOKEN!);
        socket.user = user as AuthUserPayload;
        next();
      } catch (error) {
        return next(new Error('Invalid Token'));
      }
    });

    this.io.on('connection', async (socket: UserSocket) => {
      const user: AuthUserPayload = socket!.user as AuthUserPayload;

      // Verify if connection is a store or if connection is a user
      const currentAuthId = user.storeId ? user.storeId : user.userId;

      console.log(user);

      // Once a socket connects, add him to a room with his UserId/StoreId
      socket.join(currentAuthId);

      // Add user to online_users set
      await chatCache.userIsOnline(currentAuthId);

      // Emit the conversation list to the connected user
      const conversationList = await chatService.getConversationList(
        new mongoose.Types.ObjectId(currentAuthId)
      );
      socket.emit('conversation:list', conversationList);

      // Listen for private message
      socket.on('private:message', async ({ message, to }: { message: IMessageData; to: string }) => {
        const conversationObjectId: string = message?.conversationId
          ? (message.conversationId as string)
          : `${new mongoose.Types.ObjectId()}`;

        await this.addChatMessage(message, conversationObjectId);

        if (!message?.conversationId) {
          socket.emit('new:conversationId', {
            conversationId: conversationObjectId,
            lastMessage: message.body
          });
        }

        socket
          .to(to)
          .to(currentAuthId)
          .emit('private:message', { message, from: currentAuthId, conversationId: conversationObjectId });
      });

      socket.on('disconnect', async () => {
        await chatCache.userIsOffline(currentAuthId);

        // Emit user disconnection
      });
    });
  }

  public async addChatMessage(message: IMessageData, conversationId: string | ObjectId): Promise<void> {
    try {
      const values = await addChatSchema.validate(message);
      // log.info('\nVALIDATION RESULTS:', values);

      const { user, store, body, isReply, isOrder, order, images } = message;

      const messageId: ObjectId = new ObjectId();

      const messageData: IMessageData = {
        _id: `${messageId}`,
        conversationId,
        user,
        store,
        body,
        isRead: false,
        isReply: !!isReply,
        isOrder: !!isOrder,
        order: isOrder ? new mongoose.Types.ObjectId(order) : null,
        images: images ? images : [],
        deleted: false
      } as IMessageData;

      console.log('\nADDING MESSAGE TO DB:', messageData);
      chatQueue.addChatJob('addChatMessageToDB', messageData);

      // Add message to db
    } catch (err) {
      log.error(err);
    }
  }
}
