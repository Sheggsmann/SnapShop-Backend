import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { storeService } from '@service/db/store.service';
import { Helpers } from '@global/helpers/helpers';
import { validator } from '@global/helpers/joi-validation-decorator';
import { storeSlugSchema } from '@store/schemes/store.scheme';
import HTTP_STATUS from 'http-status-codes';

class ShareStore {
  public async getSlugLink(req: Request, res: Response): Promise<void> {
    const store: IStoreDocument | null = await storeService.getStoreByStoreId(req.params.storeId);

    let link = '';

    if (store && store?.slug) {
      link = Helpers.formatStoreLink(store.slug);
    } else {
      link = '';
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Store link', link });
  }

  @validator(storeSlugSchema)
  public async createStoreSlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.body;
    const { storeId } = req.params;

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(storeId);
    if (!store) throw new NotFoundError('Store not found');

    const cleanedSlug = Helpers.cleanSlug(slug);
    const exists = await storeService.getStoreBySlug(cleanedSlug);
    if (exists) throw new BadRequestError('Slug already in use');

    const storeLink = Helpers.formatStoreLink(cleanedSlug);
    await storeService.saveStoreSlug(storeId, cleanedSlug, storeLink);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Slug created successfully', slug: cleanedSlug, link: storeLink });
  }
}

export const shareStore: ShareStore = new ShareStore();
