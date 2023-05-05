import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { storeService } from '@service/db/store.service';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 30;

class Get {
  // lists all the stores in a paginated format
  public all = async (req: Request, res: Response): Promise<void> => {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const stores: IStoreDocument[] = await storeService.getStores(skip, limit);

    res.status(HTTP_STATUS.OK).json({ message: 'Stores', stores });
  };

  // Accepts a store id and returns all the store products and categories
  public storeByStoreId = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params;

    const store = await storeService.getStoreByStoreId(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (!store.isOwner(req.currentUser!.userId)) {
      throw new NotAuthorizedError('You are not the owner of this store');
    }

    const categorizedProducts = await storeService.getStoreProductsByCategory(storeId);
    const queryResult = {
      ...store.toJSON(),
      categories: [...categorizedProducts]
    };

    res.status(HTTP_STATUS.OK).json({ message: 'Store details', store: queryResult });
  };

  public productCategories = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params;

    const store = await storeService.getStoreByStoreId(storeId);
    if (!store) throw new BadRequestError('Store not found');

    res.status(HTTP_STATUS.OK).json({ message: 'Product Categories', categories: store.productCategories });
  };
}

export const getStores: Get = new Get();