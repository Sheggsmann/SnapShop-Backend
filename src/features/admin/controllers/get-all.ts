import { BadRequestError } from '@global/helpers/error-handler';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 50;

class Get {
  // // lists all the stores in a paginated format
  // public all = async (req: Request, res: Response): Promise<void> => {
  //     const { page } = req.params;
  //     const skip = (parseInt(page) - 1) * PAGE_SIZE;
  //     const limit = parseInt(page) * PAGE_SIZE;
  //     const
  // }
}

export const getAll: Get = new Get();
