import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { IProductDocument } from '@product/interfaces/product.interface';
import { storeService } from '@service/db/store.service';
import { searchesQueue } from '@service/queues/searches.queue';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class SearchStore {
  private MAX_DISTANCE = 120; // km
  private DEFAULT_DISTANCE = 5; // km
  private MIN_PRICE = 0;
  private MAX_PRICE = 10000000;
  private EARTH_RADIUS = 6378.1;
  private UNIT: 'km' | 'm' = 'km';

  public store = async (req: Request, res: Response): Promise<void> => {
    const { center } = req.params;

    if (!req.query.searchParam) throw new BadRequestError('Search param is required');
    if (`${req.query.searchParam}`.length > 100) throw new BadRequestError('Search param is too long');

    // const maxPrice = req.query.maxPrice ?? this.MAX_PRICE;
    // const minPrice = req.query.minPrice ?? this.MIN_PRICE;
    const unit = req.query.unit ?? this.UNIT;

    const distance = req.query.distance
      ? this.clampDistance(parseInt(req.query.distance as string), unit as string)
      : this.DEFAULT_DISTANCE;

    const [lat, lng] = center.split(',');

    if (!lat || !lng) throw new BadRequestError('Please provide latitude and longitude in format lat,lng');
    if (!unit || !['km', 'm'].includes(unit as string))
      throw new BadRequestError('Unit must be km(kilometers) or m(meters)');

    const radius = unit === 'km' ? distance / this.EARTH_RADIUS : distance / (this.EARTH_RADIUS * 1000);

    const token = Helpers.getTokenFromHeader(req);
    let authPayload = null;

    if (token) authPayload = Helpers.parseToken(token);
    searchesQueue.addSearchTermJob('addSearchTermToDB', {
      searchParam: `${req.query.searchParam}`,
      location: [parseFloat(lat), parseFloat(lng)],
      user: authPayload ? authPayload?.userId : ''
    });

    const products: IProductDocument[] = await storeService.getNearbyStores(
      `${req.query.searchParam}`,
      parseFloat(lat),
      parseFloat(lng),
      radius
    );

    res.status(HTTP_STATUS.OK).json({ message: 'Search results', products });
  };

  private clampDistance = (distance: number, unit = 'km'): number => {
    // using 1 for kilometers and 1000 for meters
    const unitFactor = unit === 'km' ? 1 : 1000;
    const d = Math.min(distance, this.MAX_DISTANCE * unitFactor);
    return d;
  };
}

export const searchStore: SearchStore = new SearchStore();
