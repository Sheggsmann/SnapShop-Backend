import { BadRequestError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { versioningService } from '@service/db/version.service';
import { versioningSchema } from '@versioning/schemes/versioning.scheme';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Update {
  private isLowerVersion(previousVersion: string, newVersion: string): boolean {
    const previousIntArray = previousVersion.split('.').map(Number);
    const newIntArray = newVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(previousIntArray.length, newIntArray.length); i++) {
      const previousValue = previousIntArray[i] || 0;
      const newValue = newIntArray[i] || 0;

      if (previousValue < newValue) {
        return true;
      } else if (previousValue > newValue) {
        return false;
      }
    }

    return false;
  }

  // TODO: implement authentication and data filter
  @validator(versioningSchema)
  public async appVersion(req: Request, res: Response): Promise<void> {
    const { version, forceUpdate, update, app } = req.body;

    // Reject if current version is less than existing version
    // 1.0.0
    const result = await versioningService.getCurrentAppVersion();
    if (!Update.prototype.isLowerVersion(result.currentAppVersion, version)) {
      throw new BadRequestError("Version can't be lower than existing version");
    }

    await versioningService.updateAppVersion(version, forceUpdate || false, update, app);
    res.status(HTTP_STATUS.OK).json({ message: 'Updated successfully' });
  }
}

export const updateVersion: Update = new Update();
