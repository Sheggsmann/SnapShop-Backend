import { tagsMappingService } from '@service/db/tagsMapping.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Create {
  public async tag(req: Request, res: Response): Promise<void> {
    const { name, tags } = req.body;
    await tagsMappingService.addTagsMappingToDB(name, tags);
    res.status(HTTP_STATUS.OK).json({ message: 'Tag mapping created successfully' });
  }
}

export const createTagMapping: Create = new Create();
