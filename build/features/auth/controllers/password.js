"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = void 0;
const password_1 = require("../schemes/password");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const signup_1 = require("./signup");
const sms_transport_1 = require("../../../shared/services/sms/sms.transport");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Password {
    async create(req, res) {
        const { mobileNumber, otpProvider } = req.body;
        const existingUser = await auth_service_1.authService.getUserByPhonenumber(mobileNumber);
        if (!existingUser)
            throw new error_handler_1.BadRequestError('Invalid credentials');
        // const otp = `${Helpers.generateOtp(4)}`;
        const otp = '1111';
        await auth_service_1.authService.updatePasswordToken(`${existingUser._id}`, otp, Date.now() + signup_1.OTP_EXPIRES_IN);
        await sms_transport_1.smsTransport.sendSms(mobileNumber, `Snapshup password reset token: ${otp}`, otpProvider);
        res.status(http_status_codes_1.default.OK).json({ message: 'Password reset otp sent.' });
    }
    async update(req, res) {
        const { password, otp, mobileNumber } = req.body;
        const existingUser = await auth_service_1.authService.getAuthUserByPasswordToken(mobileNumber, otp);
        if (!existingUser)
            throw new error_handler_1.BadRequestError('Invalid token.');
        if (new Date(existingUser.passwordResetExpiresIn).getTime() <= Date.now())
            throw new error_handler_1.BadRequestError('Reset token has expired.');
        existingUser.password = password;
        existingUser.passwordResetExpiresIn = undefined;
        existingUser.passwordResetToken = '';
        await existingUser.save();
        res.status(http_status_codes_1.default.OK).json({ message: 'Password reset successfully.' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(password_1.mobileNumberSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Password.prototype, "create", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(password_1.passwordSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Password.prototype, "update", null);
exports.password = new Password();
