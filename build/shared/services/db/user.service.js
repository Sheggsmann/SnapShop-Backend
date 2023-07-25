"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = require("../../../features/user/models/user.model");
class UserService {
    async createUser(data) {
        await user_model_1.UserModel.create(data);
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
}
exports.userService = new UserService();
