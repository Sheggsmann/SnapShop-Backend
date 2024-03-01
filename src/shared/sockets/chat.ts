import { AuthUserPayload } from '@auth/interfaces/auth.interface';
import { Server, Socket } from 'socket.io';
import { config } from '@root/config';
import { ChatCache } from '@service/redis/chat.cache';
import { IMessageData, IMessageDocument } from '@chat/interfaces/chat.interface';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { ObjectId } from 'mongodb';
import { chatQueue } from '@service/queues/chat.queue';
import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { orderQueue } from '@service/queues/order.queue';
import { IUserDocument } from '@user/interfaces/user.interface';
import { IAnalyticsData, IAnalyticsDocument } from '@analytics/interfaces/analytics.interface';
import { userService } from '@service/db/user.service';
import { notificationQueue } from '@service/queues/notification.queue';
import { analyticsQueue } from '@service/queues/analytics.queue';
import { emailQueue } from '@service/queues/email.queue';
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

      // Listen for private message
      socket.on(
        'private:message',
        async (
          data: { message: IMessageData; to: string },
          callback: ({ messageId }: { messageId: ObjectId }) => void
        ) => {
          const { message, to } = data;
          const messageId: ObjectId = new ObjectId();

          const conversationObjectId: string = message?.conversationId
            ? (message.conversationId as string)
            : `${new mongoose.Types.ObjectId()}`;

          message._id = `${messageId}`;
          message.createdAt = Date.now();
          await this.addChatMessage(message, conversationObjectId, socket);

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

          if (callback) {
            callback({ messageId });
          }
        }
      );

      // Listen for tracking events
      socket.on('track', async (data: IAnalyticsData) => {
        analyticsQueue.addAnalyticsJob('addAnalyticsToDB', { value: data as IAnalyticsDocument });
      });

      socket.on('disconnect', async () => {
        await chatCache.userIsOffline(currentAuthId);

        // Emit user disconnection
      });
    });
  }

  public async addChatMessage(
    message: IMessageData,
    conversationId: string | ObjectId,
    socket: UserSocket
  ): Promise<void> {
    try {
      const { error } = await addChatSchema.validate(message);

      if (error) {
        log.error('Validation Error:', error.details);
        throw new Error('Message validation failed');
      }

      const {
        sender,
        receiver,
        senderType,
        receiverType,
        senderUsername,
        body,
        isReply,
        status,
        reply,
        isOrder,
        order,
        images,
        createdAt
      } = message;

      /**
       * If it is an order, create the order here
       *
       * only a user can create an order,
       *
       * if orderMessage:
       *   sender = userId
       *   senderType = "User"
       *
       *   receiver = storeId
       *   receiverType = "Store"
       *
       * Store Owners cannot create an order themselves
       */

      console.log('\n\nMESSAGE:', message);

      let orderId: ObjectId | null = null;
      if (isOrder) {
        orderId = new ObjectId();

        if (senderType === 'User' && receiverType === 'Store') {
          const user: IUserDocument = await userService.getUserById(socket.user!.userId);
          orderQueue.addOrderJob('addOrderToDB', {
            value: {
              _id: orderId,
              store: receiver,
              user: {
                userId: user._id,
                name: `${user.firstname} ${user.lastname}`,
                mobileNumber: socket.user!.mobileNumber
              },
              products: order!.products
            } as IOrderDocument
          });
          socket.to(receiver.toString()).emit('order:created', {
            _id: orderId,
            store: receiver,
            user: {
              userId: user._id,
              name: `${user.firstname} ${user.lastname}`,
              mobileNumber: socket.user!.mobileNumber
            },
            products: order!.products,
            status: OrderStatus.PENDING,
            createdAt
          });

          emailQueue.addEmailJob('sendMailToAdmins', {
            value: {
              title: 'New Order 🥳',
              body: `${(user.firstname, user.lastname)} placed an order from store ${receiver}`
            }
          });
        }
      }

      const messageData: IMessageDocument = {
        _id: `${message._id}`,
        status,
        conversationId,
        sender,
        receiver,
        senderType,
        receiverType,
        body,
        isRead: false,
        isReply: !!isReply,
        isOrder: !!isOrder,
        order: orderId,
        images: images ? images : [],
        reply,
        deleted: false,
        createdAt
      } as unknown as IMessageDocument;

      // console.log('\nADDING MESSAGE TO DB:', messageData);
      chatQueue.addChatJob('addChatMessageToDB', messageData);

      if (isOrder) {
        notificationQueue.addNotificationJob('sendPushNotificationToStore', {
          key: `${receiver}`,
          value: { title: 'New Order 🥳🎉', body: 'You just received a new order' }
        });
      } else {
        const messageNotification = body.length > 80 ? body.substring(0, 80) + '...' : body;

        if (senderType === 'User') {
          notificationQueue.addNotificationJob('sendPushNotificationToStore', {
            key: `${receiver}`,
            value: { title: senderUsername, body: messageNotification }
          });
        }

        if (senderType === 'Store') {
          notificationQueue.addNotificationJob('sendPushNotificationToUser', {
            key: `${receiver}`,
            value: { title: senderUsername, body: messageNotification }
          });
        }
      }
    } catch (err) {
      log.error(err);
    }
  }
}
