import { Request, Response } from 'express';
import { validator } from '@global/helpers/joi-validation-decorator';
import { IProductDocument, IProductFile, IUpdateProductFile } from '@product/interfaces/product.interface';
import { updateProductMediaSchema, updateProductSchema } from '@product/schemes/product.scheme';
import { productService } from '@service/db/product.service';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { productQueue } from '@service/queues/product.queue';
import { UploadApiResponse } from 'cloudinary';
import { deleteFile, uploadMultiple } from '@global/helpers/cloudinary_upload';
import { productConstants } from '@product/constants/product.constants';
import { IStoreDocument } from '@store/interfaces/store.interface';
import HTTP_STATUS from 'http-status-codes';

/* When updating a product, the images and videos are passed as an array of image/video files with the
following format.

[
  { public_id: '', content: 'base64:2ekfro },.
  { public_id: '', content: 'base64:3043jf' }
]

the 'public_id' is used to tell cloudinary what file to invalidate to ensure
our storage space over-utilized


=== MODIFIED ===

The images are uploaded on the frontend, then an array of object containing the details from IProductFile
interface are being sent to the backend.

eg:
[
  { public_id: "", url: "https://youtu.be/953vyZMO4cM" }
]
*/

class Update {
  @validator(updateProductSchema)
  public async product(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { name, images, videos, description, price, priceDiscount, quantity, category, tags } = req.body;

    const product: IProductDocument | null = await productService.getProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if ((product.store as unknown as IStoreDocument).owner.toString() !== req.currentUser!.userId) {
      throw new NotAuthorizedError('You are not the owner of this store');
    }

    if (priceDiscount) {
      if (parseInt(priceDiscount) > parseInt(price) || parseInt(priceDiscount) > product.price)
        throw new BadRequestError('Discount cannot be greater than price');
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (images) product.images = images;
    if (videos) product.videos = videos;
    if (price) product.price = price;
    if (priceDiscount) product.priceDiscount = priceDiscount;
    if (quantity) product.quantity = quantity;
    if (category) product.category = category;
    if (tags) product.tags = tags;

    await product.save();

    res.status(HTTP_STATUS.OK).json({ message: 'Product updated successfully', updatedProduct: product });
  }

  @validator(updateProductMediaSchema)
  public async productWithMedia(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { images, videos }: { images: IUpdateProductFile; videos: IUpdateProductFile } = req.body;

    const product: IProductDocument | null = await productService.getProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if ((product.store as unknown as IStoreDocument).owner.toString() !== req.currentUser!.userId) {
      throw new NotAuthorizedError('You are not the owner of this store');
    }

    // Check if images have exceeded the max image length
    const totalImages =
      product.images.length + (images?.uploaded?.length ?? 0) - (images?.deleted?.length ?? 0);

    if (totalImages > productConstants.MAX_PRODUCT_IMAGES) {
      throw new BadRequestError('Max number of images is 5');
    }

    const newProductImages: IProductFile[] = [];

    // Delete all modified images
    if (images?.deleted && images.deleted.length) {
      const deletePromises = images.deleted.map((img_public_id: string) => deleteFile(img_public_id));
      await Promise.all(deletePromises);
    }

    if (images?.deleted) {
      for (const item of product.images) {
        if (!images.deleted.find((public_id: string) => public_id === item.public_id)) {
          newProductImages.push(item);
        }
      }
    } else {
      newProductImages.push(...product.images);
    }

    // Upload new images to cloudinary
    const uploadedImages: IProductFile[] = [];
    if (images?.uploaded && images.uploaded.length) {
      const imagesToUpload = images.uploaded.map((img) => img.content);
      const imageResponses: UploadApiResponse[] = (await uploadMultiple(
        imagesToUpload,
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
    }

    newProductImages.push(...uploadedImages);

    // Upload videos if videos exist
    const uploadedVideos: IProductFile[] = [];
    if (videos?.uploaded && videos.uploaded.length) {
      const videosToUpload = videos.uploaded.map((vid) => vid.content);
      const videoResponses: UploadApiResponse[] = (await uploadMultiple(
        videosToUpload,
        'video',
        true,
        true,
        productConstants.PRODUCT_VIDEO_FOLDER
      )) as UploadApiResponse[];

      videoResponses.forEach((vidRes) => {
        if (!vidRes.public_id) {
          throw new BadRequestError('An error occurred while uploading video');
        }
        uploadedVideos.push({ url: vidRes.secure_url, public_id: vidRes.public_id });
      });
    }

    const updatedProduct: IProductDocument = {
      images: newProductImages,
      videos: videos?.uploaded?.length ? uploadedVideos : product.videos
    } as IProductDocument;

    productQueue.addProductJob('updateProductInDB', { key: productId, value: updatedProduct });

    res.status(HTTP_STATUS.OK).json({ message: 'Product updated successfully', updatedProduct });
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    productQueue.addProductJob('removeProductFromDB', { key: productId, storeId: req.currentUser!.storeId });
    res.status(HTTP_STATUS.OK).json({ message: 'Product deleted successfully', productId });
  }
}

export const updateProduct: Update = new Update();
