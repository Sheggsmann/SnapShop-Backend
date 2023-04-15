import { BadRequestError } from '@global/helpers/error-handler';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const MAX_STORES = 30; // limit of stores
const MAX_LIMIT = 300; // km

class SearchStore {
  public async store(req: Request, res: Response): Promise<void> {
    const { unit, searchParam } = req.query;
    const { center } = req.params;

    const [lat, lng] = center.split(',');

    if (!lat || !lng) {
      throw new BadRequestError('Please provide latitude and longitude in format lat,lng');
    }

    // TODO: split the center into latitude and longitude floats for GeoJson search

    // TODO: call store service to search based on store location

    res.status(HTTP_STATUS.OK).json({ message: 'Search results' });
  }
}

export const searchStore: SearchStore = new SearchStore();
