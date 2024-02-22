import { tagsMappingService } from '@service/db/tagsMapping.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async tag(req: Request, res: Response): Promise<void> {
    const tagsMappings = await tagsMappingService.getTagsMappings();
    res.status(HTTP_STATUS.OK).json({ message: 'Tag mappings', tagsMappings });
  }
}

export const getTagsMappings: Get = new Get();
