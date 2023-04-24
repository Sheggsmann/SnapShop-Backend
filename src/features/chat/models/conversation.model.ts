import mongoose, { Schema, Model, model } from 'mongoose';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';

const conversationSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId },
  store: { type: mongoose.Types.ObjectId }
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(
  'Conversation',
  conversationSchema,
  'Conversation'
);

export { ConversationModel };
