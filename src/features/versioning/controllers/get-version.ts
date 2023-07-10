import { versioningService } from '@service/db/version.service';
import { IVersionDocument } from '@versioning/interfaces/version.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async appVersion(req: Request, res: Response) {
    const version: IVersionDocument = await versioningService.getCurrentAppVersion();
    res.status(HTTP_STATUS.OK).json({ message: 'App version', version });
  }
}

export const getVersion: Get = new Get();
