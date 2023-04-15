import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

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

export const uploadMultiple = async (
  files: string[],
  invalidate?: boolean,
  overwrite?: boolean,
  folder?: string,
  public_id?: string
): Promise<UploadReturnType[]> => {
  const promises = files.map((file) => {
    return uploadFile(file, invalidate, overwrite, folder, public_id);
  });

  const results: UploadReturnType[] = await Promise.all(promises);
  return results;
};
