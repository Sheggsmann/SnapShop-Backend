import { IFeedbackDocument } from '@feedback/interfaces/feedback.interface';
import { FeedbackModel } from '@feedback/models/feedback.model';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 60;

class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const feedbacks: IFeedbackDocument[] = (await FeedbackModel.find({})
      .skip(skip)
      .limit(limit)) as IFeedbackDocument[];

    res.status(HTTP_STATUS.OK).json({ message: 'Feedback', feedbacks });
  }
}

export const getFeedback: Get = new Get();
