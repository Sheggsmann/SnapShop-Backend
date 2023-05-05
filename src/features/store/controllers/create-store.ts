import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { storeService } from '@service/db/store.service';
import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { uploadFile } from '@global/helpers/cloudinary_upload';
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
    const { name, image, bgImage, description, address, latlng } = req.body;
    const [lat, lng] = latlng.split(',');

    const exists = await storeService.getStoreByName(name);
    if (exists) throw new BadRequestError('Store with name already exists');

    // Check if user already owns a store
    const ownsStore = await storeService.getStoreByUserId(req.currentUser!.userId);
    if (ownsStore) throw new BadRequestError('User already owns a store');

    const storeObjectId: ObjectId = new ObjectId();

    // TODO: Upload images to cloudinary
    const imageResult: UploadApiResponse = (await uploadFile(
      image,
      true,
      true,
      'store',
      `store_img_${storeObjectId}`
    )) as UploadApiResponse;
    if (!imageResult.public_id) throw new BadRequestError(imageResult.message);

    let bgImgResult: UploadApiResponse = {} as UploadApiResponse;

    if (bgImage) {
      bgImgResult = (await uploadFile(
        image,
        true,
        true,
        'storeBg',
        `store_bg_${storeObjectId}`
      )) as UploadApiResponse;
      if (!bgImgResult.public_id) throw new BadRequestError(bgImgResult.message);
    }

    // Store Latitude and Longitude in reverse order because of the way
    // mongodb geospatial queries
    const store: IStoreDocument = {
      _id: storeObjectId,
      name,
      description,
      owner: req.currentUser!.userId,
      image: imageResult.secure_url,
      uId: `${Helpers.genrateRandomIntegers(12)}`,
      bgImage: bgImage ? bgImgResult.secure_url : '',
      locations: [{ location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }],
      badges: [],
      verified: false
    } as unknown as IStoreDocument;

    storeQueue.addStoreJob('addStoreToDB', { value: store, userId: req.currentUser!.userId });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Store created successfully', store });
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
