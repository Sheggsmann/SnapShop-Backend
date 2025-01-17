import { AuthModel } from '@auth/models/auth.model';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.model';

class UserService {
  public async createUser(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  public async getUsers(skip: number, limit: number): Promise<IUserDocument[]> {
    const users: IUserDocument[] = await UserModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return users;
  }

  public async getUsersCount(): Promise<number> {
    return await UserModel.countDocuments({});
  }

  public async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email });
  }

  public async getUserById(userId: string): Promise<IUserDocument> {
    return (await UserModel.findOne({ _id: userId }).populate(
      'authId',
      'mobileNumber verified uId'
    )) as IUserDocument;
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    return (await UserModel.findOne({ authId }).populate(
      'authId',
      'mobileNumber verified uId'
    )) as IUserDocument;
  }

  public async updateUser(userId: string, updatedUser: Partial<IUserDocument>): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: updatedUser });
  }

  public async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    await UserModel.deleteOne({ _id: userId });
    await AuthModel.deleteOne({ _id: user.authId });
  }
}

export const userService: UserService = new UserService();
