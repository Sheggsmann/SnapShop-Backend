import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { storeService } from '@service/db/store.service';
import { Request, Response } from 'express';
import { validator } from '@global/helpers/joi-validation-decorator';
import { storeSchema } from '@store/schemes/store.scheme';
import { storeQueue } from '@service/queues/store.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { ObjectId } from 'mongodb';
import { Helpers } from '@global/helpers/helpers';

import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(storeSchema)
  public async store(req: Request, res: Response): Promise<void> {
    const { name, description, address, latlng } = req.body;
    const [lat, lng] = latlng.split(',');

    const exists = await storeService.getStoreByName(name);
    if (exists) throw new BadRequestError('Store with name already exists');

    // Check if user already owns a store
    const ownsStore = await storeService.getStoreByUserId(req.currentUser!.userId);
    if (ownsStore) throw new BadRequestError('User already owns a store');

    const storeObjectId: ObjectId = new ObjectId();
    const slug = Helpers.generateUniqueSlug(name);

    // Store Latitude and Longitude in reverse order because of the way
    // mongodb geospatial queries
    const store: IStoreDocument = {
      _id: storeObjectId,
      name,
      description,
      slug,
      slugUrl: Helpers.formatStoreLink(slug),
      owner: req.currentUser!.userId,
      uId: `${Helpers.genrateRandomIntegers(12)}`,
      locations: [{ location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }],
      badges: [],
      verified: false,
      mobileNumber: req.currentUser!.mobileNumber,
      escrowBalance: 0,
      mainBalance: 0
    } as unknown as IStoreDocument;

    storeQueue.addStoreJob('addStoreToDB', { value: store, userId: req.currentUser!.userId });

    // sign a new jwt token appending the storeId to it
    const jwtPayload = {
      mobileNumber: req.currentUser!.mobileNumber,
      uId: req.currentUser!.uId,
      userId: req.currentUser!.userId,
      roles: req.currentUser!.roles,
      storeId: storeObjectId
    };

    const authToken: string = Helpers.signToken(jwtPayload);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Store created successfully', store, token: authToken });
  }

  // Add Joi validation
  public async productCategory(req: Request, res: Response): Promise<void> {
    const { category } = req.body;

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(`${req.currentUser!.storeId}`);
    if (!store) throw new NotFoundError('Store not found');

    if (store.productCategories.includes(category.toLowerCase()))
      throw new BadRequestError('Category already exists');

    const categories: string[] = [...store.productCategories, category.toLowerCase()];
    await storeService.updateStore(`${req.currentUser!.storeId}`, { productCategories: categories });

    res.status(HTTP_STATUS.OK).json({ message: 'Product category created successfully', category });
  }
}

export const createStore: Create = new Create();
