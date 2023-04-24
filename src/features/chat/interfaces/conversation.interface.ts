import mongoose, { Document } from 'mongoose';

export interface IConversationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
}
