import { uploadFile } from '@global/helpers/cloudinary_upload';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { userService } from '@service/db/user.service';
import { userQueue } from '@service/queues/user.queue';
import { IUserDocument } from '@user/interfaces/user.interface';
import {
  likedProductSchema,
  savePushTokenSchema,
  saveStoreSchema,
  userSchema
} from '@user/schemes/user.scheme';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Update {
  @validator(userSchema)
  public async user(req: Request, res: Response): Promise<void> {
    const { email, image } = req.body;

    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);
    if (!user) throw new NotFoundError('User not found');

    // Upload Images if they are images
    let imageResult: UploadApiResponse = {} as UploadApiResponse;
    if (image) {
      imageResult = (await uploadFile(image, true, true, 'user')) as UploadApiResponse;
      if (!imageResult.secure_url) throw new BadRequestError(imageResult.message);
    }

    const updatedUser: Pick<IUserDocument, 'profilePicture' | 'email'> = {
      profilePicture: image ? imageResult.secure_url : user.profilePicture,
      email
    };

    userQueue.addUserJob('updateUserInDB', { key: req.currentUser!.userId, value: updatedUser });

    res.status(HTTP_STATUS.OK).json({ message: 'User updated successfully', updatedUser });
  }

  /**
   * @param
   * @desc defines an endpoint to save/unsave a store
   */
  @validator(saveStoreSchema)
  public async saveStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.body;
    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);

    let newSavedStores: string[] = [];

    if ((user.savedStores as string[]).includes(storeId)) {
      newSavedStores = (user.savedStores as string[]).filter((sId) => sId.toString() !== storeId) as string[];
    } else {
      newSavedStores = [...user.savedStores, storeId] as string[];
    }

    const updatedUser: Pick<IUserDocument, 'savedStores'> = {
      savedStores: newSavedStores
    };

    userQueue.addUserJob('updateUserInDB', { key: req.currentUser!.userId, value: updatedUser });

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Store saved successfully', savedStores: updatedUser.savedStores });
  }

  /**
   * @param
   * @desc defines an endpoint to like or unlike a product
   */
  @validator(likedProductSchema)
  public async likeProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.body;
    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);

    let newLikedProducts: string[] = [];

    if ((user.likedProducts as string[]).includes(productId)) {
      newLikedProducts = (user.likedProducts as string[]).filter(
        (pId) => pId.toString() !== productId
      ) as string[];
    } else {
      newLikedProducts = [...user.likedProducts, productId] as string[];
    }

    const updatedUser: Pick<IUserDocument, 'likedProducts'> = {
      likedProducts: newLikedProducts
    };

    userQueue.addUserJob('updateUserInDB', { key: req.currentUser!.userId, value: updatedUser });

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Product liked successfully', likedProducts: updatedUser.likedProducts });
  }

  /**
   * @param
   * @desc defines the endpoint to store expo push token
   */
  @validator(savePushTokenSchema)
  public async savePushNotificationToken(req: Request, res: Response): Promise<void> {
    const { pushToken } = req.body;
    const updatedUser: Pick<IUserDocument, 'expoPushToken'> = { expoPushToken: pushToken };
    userQueue.addUserJob('updateUserInDB', { key: req.currentUser!.userId, value: updatedUser });

    res.status(HTTP_STATUS.OK).json({ message: 'PushToken saved successfully' });
  }
}

export const updateUser: Update = new Update();
