import { SearchesModel } from '@searches/models/searches.model';
import { ISearchesDocument } from '@searches/interfaces/searches.interfaces';

class Searches {
  public async add(searchParam: string, location: number[], user: string): Promise<void> {
    if (user) {
      await SearchesModel.create({ searchParam, location, user });
    } else {
      await SearchesModel.create({ searchParam, location });
    }
  }

  public async getSearches(skip: number, limit: number): Promise<ISearchesDocument[]> {
    return await SearchesModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstname email mobileNumber expoPushToken roles');
  }

  public async getSearchesCount(): Promise<number> {
    return await SearchesModel.countDocuments({});
  }
}

export const searchesService: Searches = new Searches();
