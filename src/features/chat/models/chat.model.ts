import { Schema, Types, Model, model } from 'mongoose';
import { IMessageDocument } from '../interfaces/chat.interface';

const messageSchema: Schema = new Schema(
  {
    conversationId: { type: Types.ObjectId, required: true },
    sender: { type: Types.ObjectId, required: true, refPath: 'senderType' },
    receiver: { type: Types.ObjectId, required: true, refPath: 'receiverType' },
    senderType: { type: String, enum: ['User', 'Store'], required: true },
    receiverType: { type: String, enum: ['User', 'Store'], required: true },
    body: String,
    images: [{ url: String }],
    isRead: { type: Boolean, default: false },
    isReply: { type: Boolean, default: false },
    isOrder: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    order: { type: Types.ObjectId, ref: 'Order', index: true },
    status: { type: String, enum: ['pending', 'delivered', 'read'], default: 'pending' },
    reply: {
      messageId: Types.ObjectId,
      body: String,
      images: [],
      sender: Types.ObjectId,
      receiver: Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema, 'Message');
export { MessageModel };
