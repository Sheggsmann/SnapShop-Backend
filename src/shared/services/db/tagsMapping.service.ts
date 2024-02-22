import { ITagsMappingDocument } from '@admin/interfaces/tag-mapping.interface';
import { TagsMappingModel } from '@admin/models/tag-mapping.model';

class TagsMappingService {
  public async addTagsMappingToDB(name: string, tags: string[]): Promise<void> {
    await TagsMappingModel.create({ name, tags });
  }

  public async getTagsMappings(): Promise<ITagsMappingDocument[]> {
    return await TagsMappingModel.find({});
  }
}

export const tagsMappingService: TagsMappingService = new TagsMappingService();
