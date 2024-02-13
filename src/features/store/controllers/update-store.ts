import { uploadFile } from '@global/helpers/cloudinary_upload';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { storeService } from '@service/db/store.service';
import { storeQueue } from '@service/queues/store.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import {
  storeLocationUpdateSchema,
  storeUpdateSchema,
  updateProductCategorySchema
} from '@store/schemes/store.scheme';
import { Request, Response } from 'express';
import { savePushTokenSchema } from '@user/schemes/user.scheme';
import { storeConstants } from '@store/constants/store.constant';
import { productService } from '@service/db/product.service';
import HTTP_STATUS from 'http-status-codes';

class Update {
  @validator(storeUpdateSchema)
  public async store(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const { name, description, bgImage, image } = req.body;

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(storeId);
    if (!store) throw new NotFoundError('Store not found');

    if (!store.isOwner(req.currentUser!.userId))
      throw new NotAuthorizedError('You are not the owner of this store');

    // Upload Images if they are images
    let imageResult: UploadApiResponse = {} as UploadApiResponse;
    if (image) {
      imageResult = (await uploadFile(image, true, true, 'store')) as UploadApiResponse;
      if (!imageResult.secure_url) throw new BadRequestError(imageResult.message);
    }

    let bgImageResult: UploadApiResponse = {} as UploadApiResponse;
    if (bgImage) {
      bgImageResult = (await uploadFile(bgImage, true, true, 'storeBg')) as UploadApiResponse;
      if (!bgImageResult.secure_url) throw new BadRequestError(bgImageResult.message);
    }

    const updatedStore: IStoreDocument = {
      name: name ? name : store.name,
      description: description ? description : store.description,
      image: image ? imageResult.secure_url : store.image,
      bgImage: bgImage ? bgImageResult.secure_url : store.bgImage
    } as IStoreDocument;

    storeQueue.addStoreJob('updateStoreInDB', { value: updatedStore, key: storeId });

    res.status(HTTP_STATUS.OK).json({ message: 'Store updated successfully.', updatedStore });
  }

  @validator(storeLocationUpdateSchema)
  public async storeLocation(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const { latlng, address } = req.body;
    const [lat, lng] = latlng.split(',');

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(storeId);
    if (!store) throw new NotFoundError('Store not found');

    if (!store.isOwner(req.currentUser!.userId))
      throw new NotAuthorizedError('You are not the owner of this store');

    // You can only update store once in 30 days unless you are a pro-user
    if (
      store.locationUpdatedAt &&
      Date.now() - (store.locationUpdatedAt || 0) < storeConstants.LOCATION_UPDATE_INTERVAL_IN_MS
    ) {
      throw new BadRequestError(
        'You cannot update your store location now. Wait 30 days or consider a pro plan'
      );
    }

    store.locations = [
      { location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }
    ];
    store.locationUpdatedAt = Date.now();

    storeQueue.addStoreJob('updateStoreInDB', { value: store, key: storeId });

    res.status(HTTP_STATUS.OK).json({ message: 'Location updated successfully' });
  }

  public async verify(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(storeId);
    if (!store) throw new NotFoundError('Store not found');

    const updatedStore: IStoreDocument = {
      verified: true
    } as IStoreDocument;

    storeQueue.addStoreJob('updateStoreInDB', { key: storeId, value: updatedStore });

    res.status(HTTP_STATUS.OK).json({ message: 'Store verified successfully' });
  }

  @validator(savePushTokenSchema)
  public async savePushNotificationToken(req: Request, res: Response): Promise<void> {
    const { pushToken } = req.body;
    const updatedStore: Pick<IStoreDocument, 'expoPushToken'> = { expoPushToken: pushToken };
    storeQueue.addStoreJob('updateStoreInDB', { key: req.currentUser!.storeId, value: updatedStore });

    res.status(HTTP_STATUS.OK).json({ message: 'PushToken saved successfully' });
  }

  @validator(updateProductCategorySchema)
  public async productCategory(req: Request, res: Response): Promise<void> {
    let { oldCategory, newCategory } = req.body;
    oldCategory = oldCategory.toLowerCase().trim();
    newCategory = newCategory.toLowerCase().trim();

    if (oldCategory === newCategory) throw new BadRequestError('Category names are the same');

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(`${req.currentUser!.storeId}`);
    if (!store) throw new NotFoundError('Store not found');

    // Return 400 if the new category exists in any of the product categories
    if (store.productCategories.find((category) => category.trim().toLowerCase() === newCategory))
      throw new BadRequestError('Category already exists');

    // Replace the old category in the store.productCategories with the oldCategory
    const categoryId = store.productCategories.findIndex(
      (category) => category.trim().toLowerCase() === oldCategory
    );
    if (categoryId > -1) {
      store.productCategories[categoryId] = newCategory;
      await storeService.updateStore(`${req.currentUser!.storeId}`, store);
      await productService.updateStoreProductsCategories(
        `${req.currentUser!.storeId}`,
        oldCategory,
        newCategory
      );
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Category updated successfully', store });
  }
}

export const updateStore: Update = new Update();
