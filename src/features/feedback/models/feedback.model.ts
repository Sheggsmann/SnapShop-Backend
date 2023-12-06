import { IFeedbackDocument } from '@feedback/interfaces/feedback.interface';
import { Schema, Model, model } from 'mongoose';

const feedbackSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String }
});

const FeedbackModel: Model<IFeedbackDocument> = model<IFeedbackDocument>(
  'Feedback',
  feedbackSchema,
  'Feedback'
);

export { FeedbackModel };
