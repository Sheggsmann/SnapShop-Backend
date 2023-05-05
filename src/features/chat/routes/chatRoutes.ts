import { addChatMessage } from '@chat/controllers/add-chat-message';
import { getChatMessage } from '@chat/controllers/get-chat-messages';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/chat/messages/conversation-list',
      authMiddleware.checkAuth,
      getChatMessage.conversationList
    );

    this.router.get(
      '/chat/messages/conversation/:userId/:storeId',
      authMiddleware.checkAuth,
      getChatMessage.messages
    );

    this.router.post('/chat/message', authMiddleware.checkAuth, addChatMessage.message);

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
