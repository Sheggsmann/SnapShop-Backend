"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_model_1 = require("../../../features/auth/models/auth.model");
class AuthService {
    async getUserByPhonenumber(mobileNumber) {
        return await auth_model_1.AuthModel.findOne({ mobileNumber });
    }
    async createAuthUser(data) {
        await auth_model_1.AuthModel.create(data);
    }
    async getAuthUserByOtp(otp, mobileNumber) {
        return await auth_model_1.AuthModel.findOne({
            mobileNumber,
            verificationToken: otp,
            verificationExpiersIn: { $gte: Date.now() }
        });
    }
    async updatePasswordToken(authId, otp, otpExpiration) {
        await auth_model_1.AuthModel.updateOne({ _id: authId }, {
            passwordResetToken: otp,
            passwordResetExpiresIn: otpExpiration
        });
    }
    async getAuthUserByPasswordToken(mobileNumber, passwordToken) {
        return await auth_model_1.AuthModel.findOne({
            mobileNumber,
            passwordResetToken: passwordToken
        });
    }
}
exports.authService = new AuthService();
