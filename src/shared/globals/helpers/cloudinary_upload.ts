import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export const uploadFile = (
  file: string,
  invalidate: boolean,
  overwrite: boolean,
  public_id: string,
  folder: string
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
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
