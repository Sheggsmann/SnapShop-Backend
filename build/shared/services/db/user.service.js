"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const auth_model_1 = require("../../../features/auth/models/auth.model");
const user_model_1 = require("../../../features/user/models/user.model");
class UserService {
    async createUser(data) {
        await user_model_1.UserModel.create(data);
    }
    async getUsers(skip, limit) {
        const users = await user_model_1.UserModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return users;
    }
    async getUsersCount() {
        return await user_model_1.UserModel.countDocuments({});
    }
    async getUserById(userId) {
        return (await user_model_1.UserModel.findOne({ _id: userId }).populate('authId', 'mobileNumber verified uId'));
    }
    async getUserByAuthId(authId) {
        return (await user_model_1.UserModel.findOne({ authId }).populate('authId', 'mobileNumber verified uId'));
    }
    async updateUser(userId, updatedUser) {
        await user_model_1.UserModel.updateOne({ _id: userId }, { $set: updatedUser });
    }
    async deleteUser(userId) {
        const user = await this.getUserById(userId);
        await user_model_1.UserModel.deleteOne({ _id: userId });
        await auth_model_1.AuthModel.deleteOne({ _id: user.authId });
    }
}
exports.userService = new UserService();
