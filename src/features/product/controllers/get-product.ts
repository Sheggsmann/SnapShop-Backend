import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { IProductDocument } from '@product/interfaces/product.interface';
import { productService } from '@service/db/product.service';
import { Request, Response } from 'express';
import { FeedCache } from '@service/redis/feed.cache';
import HTTP_STATUS from 'http-status-codes';

const feedCache: FeedCache = new FeedCache();
const PAGE_SIZE = 150;

class Get {
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;

    const products: IProductDocument[] = await productService.getProducts(skip, limit);
    const productsCount: number = await productService.getProductsCount();

    res.status(HTTP_STATUS.OK).json({ message: 'Products', products, productsCount });
  }

  public async productByProductId(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;

    const product = await productService.getProductById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Product', product });
  }

  public async exploreProducts(req: Request, res: Response): Promise<void> {
    const limit = Number(req.query.limit) ?? 25;
    const deviceId = req.query?.deviceId;

    if (!deviceId) throw new BadRequestError('Request failed! No deviceId');

    /**
     * endpoint: /explore-products?deviceId=abd454-debr4-ddkirn
     * query params: deviceId -> uuid generated on the frontend device
     *
     * HOW IT WORKS:
     * - Get the exploreProducts result already shown to the particular deviceId
     *
     * - Pass it as a query parameter to the [getExploreProducts()] function which returns
     *   products excluding the one in the already shown products array
     *
     * - Map the new results to the deviceId
     */

    const shownProductIds = await feedCache.getProductsByDeviceId(`${deviceId}`);
    const exploreProducts: IProductDocument[] = await productService.getExploreProducts(
      shownProductIds,
      limit
    );
    await feedCache.mapProductIdsToDeviceId(`${deviceId}`, exploreProducts);

    res.status(HTTP_STATUS.OK).json({ message: 'Explore Products', products: exploreProducts });
  }

  public async productsByStoreId(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const products: IProductDocument[] = await productService.getProductsByStoreId(storeId);

    res.status(HTTP_STATUS.OK).json({ message: 'Store products', products });
  }
}

export const getProduct: Get = new Get();
