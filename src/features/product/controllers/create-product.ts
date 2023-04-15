import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { validator } from '@global/helpers/joi-validation-decorator';
import { productSchema } from '../schemes/product.scheme';
import { IProductDocument } from '../interfaces/product.interface';
import { uploadMultiple } from '@global/helpers/cloudinary_upload';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError } from '@global/helpers/error-handler';
import { productQueue } from '@service/queues/product.queue';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(productSchema)
  public async product(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const { name, description, images, videos, price, priceDiscount, quantity, category } = req.body;

    // Images upload
    const uploadedImages: string[] = [];

    const imageResponses: UploadApiResponse[] = (await uploadMultiple(
      images,
      true,
      true,
      'product_images'
    )) as UploadApiResponse[];

    imageResponses.forEach((imgRes) => {
      if (!imgRes.secure_url) {
        throw new BadRequestError('an error occurred while uploading the images');
      }
      uploadedImages.push(imgRes.secure_url);
    });

    // Videos Upload
    const uploadedVideos: string[] = [];

    if (videos && videos.length) {
      const videoResponses: UploadApiResponse[] = (await uploadMultiple(
        videos,
        true,
        true,
        'product_videos'
      )) as UploadApiResponse[];

      videoResponses.forEach((videoResponse) => {
        if (!videoResponse.secure_url) throw new BadRequestError('an error occurred while uploading videos');
        uploadedVideos.push(videoResponse.secure_url);
      });
    }

    const productObjectId: ObjectId = new ObjectId();
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
