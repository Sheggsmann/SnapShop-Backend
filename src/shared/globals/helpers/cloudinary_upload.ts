import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { productConstants } from '@product/constants/product.constants';
import multer from 'multer';

export type UploadReturnType = UploadApiResponse | UploadApiErrorResponse | undefined;

export const uploadFile = (
  file: string,
  invalidate?: boolean,
  overwrite?: boolean,
  folder?: string,
  public_id?: string
): Promise<UploadReturnType> => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        invalidate,
        overwrite,
        public_id,
        folder,
        use_filename: true
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
};

export const videoUpload = (
  file: string,
  invalidate?: boolean,
  overwrite?: boolean,
  folder?: string,
  public_id?: string
): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: 'video',
        chunk_size: 50000,
        public_id,
        overwrite,
        invalidate,
        folder,
        use_filename: true
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
};

export const uploadMultiple = async (
  files: string[],
  type: 'video' | 'image' = 'image',
  invalidate?: boolean,
  overwrite?: boolean,
  folder?: string,
  public_id?: string
): Promise<UploadReturnType[]> => {
  const promises = files.map((file) => {
    return type === 'image'
      ? uploadFile(file, invalidate, overwrite, folder, public_id)
      : videoUpload(file, invalidate, overwrite, folder, public_id);
  });

  const results: UploadReturnType[] = await Promise.all(promises);
  return results;
};

export const deleteFile = (
  public_id: string
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.destroy(
      public_id,
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    folder: productConstants.PRODUCT_VIDEO_FOLDER,
    allowed_formats: ['mp4', 'mov'],
    limits: { fileSize: 5 * 1024 * 1024 }
  }
});

export const videoUploader = multer({ storage });
