import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.model';

class UserService {
  public async createUser(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    return (await UserModel.findOne({ authId }).populate(
      'authId',
      'mobileNumber verified uId'
    )) as IUserDocument;
  }
}

export const userService: UserService = new UserService();
