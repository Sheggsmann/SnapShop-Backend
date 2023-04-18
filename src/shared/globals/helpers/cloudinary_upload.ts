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
