import { IVersionDocument } from '@versioning/interfaces/version.interface';
import { VersionModel } from '@versioning/models/version.model';

class VersioningService {
  public async getCurrentAppVersion(app: 'store' | 'user' = 'store'): Promise<IVersionDocument> {
    const versions: IVersionDocument[] = await VersionModel.find({ app }).sort({ createdAt: -1 });
    return versions[0];
  }

  public async updateAppVersion(
    version: string,
    forceUpdate = false,
    update = false,
    app: 'store' | 'user' = 'store'
  ): Promise<void> {
    const existingDocument: IVersionDocument | null = await VersionModel.findOne({});
    if (!existingDocument) {
      await VersionModel.create({ currentAppVersion: version, forceUpdate });
    } else {
      existingDocument.currentAppVersion = version;
      existingDocument.forceUpdate = forceUpdate;
      existingDocument.update = update;
      existingDocument.app = app;
      await existingDocument.save();
    }
  }

  public async newAppVersion(
    version: string,
    forceUpdate = false,
    update = false,
    app: 'store' | 'user' = 'store'
  ): Promise<void> {
    const existing: IVersionDocument | null = await VersionModel.findOne({ version, app });
    if (existing) return;

    await VersionModel.create({ currentAppVersion: version, forceUpdate, update, app });
  }
}

export const versioningService: VersioningService = new VersioningService();
