import { SearchesModel } from '@searches/models/searches.model';

class Searches {
  public async add(searchParam: string, location: number[]): Promise<void> {
    await SearchesModel.create({ searchParam, location });
  }
}

export const searchesService: Searches = new Searches();
