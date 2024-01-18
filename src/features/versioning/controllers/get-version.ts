import { BadRequestError } from '@global/helpers/error-handler';
import { versioningService } from '@service/db/version.service';
import { IVersionDocument } from '@versioning/interfaces/version.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async appVersion(req: Request, res: Response) {
    if (!req.params.app) throw new BadRequestError('app is required');

    const version: IVersionDocument = await versioningService.getCurrentAppVersion(
      req.params.app as 'store' | 'user'
    );
    res.status(HTTP_STATUS.OK).json({ message: 'App version', version });
  }
}

export const getVersion: Get = new Get();
