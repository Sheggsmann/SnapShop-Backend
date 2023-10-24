import mongoose, { Schema, Model, model } from 'mongoose';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';

const conversationSchema: Schema = new Schema({
  _id: mongoose.Types.ObjectId,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  store: { type: mongoose.Types.ObjectId, ref: 'Store' }
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(
  'Conversation',
  conversationSchema,
  'Conversation'
);

export { ConversationModel };
