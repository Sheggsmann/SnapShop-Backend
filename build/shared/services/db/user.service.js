"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = require("../../../features/user/models/user.model");
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.UserModel.create(data);
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield user_model_1.UserModel.findOne({ _id: userId }).populate('authId', 'mobileNumber verified uId'));
        });
    }
    getUserByAuthId(authId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield user_model_1.UserModel.findOne({ authId }).populate('authId', 'mobileNumber verified uId'));
        });
    }
}
exports.userService = new UserService();
