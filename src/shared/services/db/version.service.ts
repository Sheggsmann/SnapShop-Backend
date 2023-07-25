import { IVersionDocument } from '@versioning/interfaces/version.interface';
import { VersionModel } from '@versioning/models/version.model';

class VersioningService {
  public async getCurrentAppVersion(): Promise<IVersionDocument> {
    return (await VersionModel.findOne()) as IVersionDocument;
  }

  public async updateAppVersion(version: string, forceUpdate = false): Promise<void> {
    const existingDocument: IVersionDocument | null = await VersionModel.findOne({});
    if (!existingDocument) {
      await VersionModel.create({ currentAppVersion: version, forceUpdate });
    } else {
      existingDocument.currentAppVersion = version;
      existingDocument.forceUpdate = forceUpdate;
      await existingDocument.save();
    }
  }
}

export const versioningService: VersioningService = new VersioningService();
