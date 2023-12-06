import { IFeedbackDocument } from '@feedback/interfaces/feedback.interface';
import { FeedbackModel } from '@feedback/models/feedback.model';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Create {
  public async feedback(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body;

    const feedbackData: IFeedbackDocument = {
      title,
      description
    } as IFeedbackDocument;

    await FeedbackModel.create(feedbackData);

    res.status(HTTP_STATUS.OK).json({ message: 'Feedback created successfully', feedback: feedbackData });
  }
}

export const createFeedback: Create = new Create();
