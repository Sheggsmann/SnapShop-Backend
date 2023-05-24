import { uploadFile } from '@global/helpers/cloudinary_upload';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { storeService } from '@service/db/store.service';
import { storeQueue } from '@service/queues/store.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { storeUpdateSchema } from '@store/schemes/store.scheme';
import { Request, Response } from 'express';
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
}

export const updateStore: Update = new Update();
