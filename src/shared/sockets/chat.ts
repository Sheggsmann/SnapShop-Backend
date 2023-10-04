import JWT from 'jsonwebtoken';
import { AuthUserPayload } from '@auth/interfaces/auth.interface';
import { Server, Socket } from 'socket.io';
import { config } from '@root/config';
import { ChatCache } from '@service/redis/chat.cache';
import { IMessageData } from '@chat/interfaces/chat.interface';
import Logger from 'bunyan';

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

      // Once a socket connects, add him to a room with his UserId/StoreId
      socket.join(user.userId);

      // Add user to online_users set
      await chatCache.userIsOnline(user.userId);

      // Listen for private message
      socket.on('private:message', async (message: IMessageData) => {
        console.log('PRIVATE MESSAGE:', message);
        socket
          .to(message.store as string)
          .to(user.userId)
          .emit('private:message', message);
      });

      socket.on('disconnect', async () => {
        await chatCache.userIsOffline(user.userId);

        // Emit user disconnection
      });
    });
  }
}
