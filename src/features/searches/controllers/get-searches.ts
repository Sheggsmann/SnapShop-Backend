import { ISearchesDocument } from '@searches/interfaces/searches.interfaces';
import { searchesService } from '@service/db/searches.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 50;

class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const searches: ISearchesDocument[] = await searchesService.getSearches(skip, limit);

    const searchesCount = await searchesService.getSearchesCount();
    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Searches', searches, currentSearchesCount: searches.length, searchesCount });
  }
}

export const getSearches: Get = new Get();
