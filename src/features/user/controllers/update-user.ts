import { uploadFile } from '@global/helpers/cloudinary_upload';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { validator } from '@global/helpers/joi-validation-decorator';
import { userService } from '@service/db/user.service';
import { userQueue } from '@service/queues/user.queue';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userSchema } from '@user/schemes/user.scheme';
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

    userQueue.addUserToDB('updateUserInDB', { key: req.currentUser!.userId, value: updatedUser });

    res.status(HTTP_STATUS.OK).json({ message: 'User updated successfully', updatedUser });
  }
}

export const updateUser: Update = new Update();
