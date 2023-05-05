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
exports.authService = void 0;
const auth_model_1 = require("../../../features/auth/models/auth.model");
class AuthService {
    getUserByPhonenumber(mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_model_1.AuthModel.findOne({ mobileNumber });
        });
    }
    createAuthUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auth_model_1.AuthModel.create(data);
        });
    }
    getAuthUserByOtp(otp, mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_model_1.AuthModel.findOne({
                mobileNumber,
                verificationToken: otp,
                verificationExpiersIn: { $gte: Date.now() }
            });
        });
    }
    updatePasswordToken(authId, otp, otpExpiration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auth_model_1.AuthModel.updateOne({ _id: authId }, {
                passwordResetToken: otp,
                passwordResetExpiresIn: otpExpiration
            });
        });
    }
    getAuthUserByPasswordToken(mobileNumber, passwordToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_model_1.AuthModel.findOne({
                mobileNumber,
                passwordResetToken: passwordToken
            });
        });
    }
}
exports.authService = new AuthService();
