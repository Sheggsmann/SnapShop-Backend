import { Schema, Types, Model, model } from 'mongoose';
import { IMessageDocument } from '../interfaces/chat.interface';

const messageSchema: Schema = new Schema(
  {
    // TODO: Add a conversation Id if you understand how redis works
    conversationId: { type: Types.ObjectId, required: true },
    user: { type: Types.ObjectId, required: true },
    store: { type: Types.ObjectId, required: true },
    body: String,
    images: [{ url: String }],
    isRead: { type: Boolean, default: false },
    isReply: { type: Boolean, default: false },
    isOrder: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    order: { type: Types.ObjectId },
    reply: { messageId: Types.ObjectId, body: String, images: [] }
  },
  {
    timestamps: true
  }
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema, 'Message');
export { MessageModel };
