import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { validator } from '@global/helpers/joi-validation-decorator';
import { productSchema } from '../schemes/product.scheme';
import { IProductDocument, IProductFile } from '../interfaces/product.interface';
import { uploadMultiple } from '@global/helpers/cloudinary_upload';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError } from '@global/helpers/error-handler';
import { productQueue } from '@service/queues/product.queue';
import { productConstants } from '@product/constants/product.constants';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(productSchema)
  public async product(req: Request, res: Response): Promise<void> {
    const { storeId, name, description, images, videos, price, priceDiscount, quantity, category } = req.body;

    const productObjectId: ObjectId = new ObjectId();

    // Images upload
    const uploadedImages: IProductFile[] = [];

    const imageResponses: UploadApiResponse[] = (await uploadMultiple(
      images,
      'image',
      true,
      true,
      productConstants.PRODUCT_IMAGE_FOLDER
    )) as UploadApiResponse[];

    imageResponses.forEach((imgRes) => {
      if (!imgRes.public_id) {
        throw new BadRequestError('An error occurred while uploading the images');
      }
      uploadedImages.push({ url: imgRes.secure_url, public_id: imgRes.public_id });
    });

    // Videos Upload
    const uploadedVideos: IProductFile[] = [];

    if (videos && videos.length) {
      const videoResponses: UploadApiResponse[] = (await uploadMultiple(
        videos,
        'video',
        true,
        true,
        productConstants.PRODUCT_VIDEO_FOLDER
      )) as UploadApiResponse[];

      videoResponses.forEach((videoRes) => {
        if (!videoRes.public_id) throw new BadRequestError('An error occurred while uploading videos');
        uploadedVideos.push({ url: videoRes.secure_url, public_id: videoRes.public_id });
      });
    }

    const product: IProductDocument = {
      _id: productObjectId,
      name,
      description,
      price,
      category,
      images: uploadedImages,
      store: storeId,
      videos: uploadedVideos.length ? uploadedVideos : [],
      priceDiscount: priceDiscount ?? 0,
      quantity: quantity ?? 0
    };

    productQueue.addProductJob('addProductToDB', { value: product, key: storeId });

    res.status(HTTP_STATUS.OK).json({ message: 'Product created successfully', product });
  }
}

export const createProduct: Create = new Create();
