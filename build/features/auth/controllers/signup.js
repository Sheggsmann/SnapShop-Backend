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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.OTP_EXPIRES_IN = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const mongodb_1 = require("mongodb");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const config_1 = require("../../../config");
const signup_1 = require("../schemes/signup");
const sms_transport_1 = require("../../../shared/services/sms/sms.transport");
const user_interface_1 = require("../../user/interfaces/user.interface");
const auth_queue_1 = require("../../../shared/services/queues/auth.queue");
const user_queue_1 = require("../../../shared/services/queues/user.queue");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.OTP_EXPIRES_IN = 5 * 60 * 1000;
class SignUp {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mobileNumber, password, firstname, lastname, otpProvider, app } = req.body;
            // If the user exists, send an otp to the user
            const userExists = yield auth_service_1.authService.getUserByPhonenumber(mobileNumber);
            if (userExists) {
                throw new error_handler_1.BadRequestError('User already exists');
            }
            const authObjectId = new mongodb_1.ObjectId();
            const userObjectId = new mongodb_1.ObjectId();
            const uId = `${helpers_1.Helpers.genrateRandomIntegers(12)}`;
            // TODO: Generate 4 digit OTP
            // const otp = `${Helpers.generateOtp(4)}`;
            const otp = '1111';
            const authData = {
                _id: authObjectId,
                verified: false,
                verificationExpiersIn: Date.now() + exports.OTP_EXPIRES_IN,
                verificationToken: otp,
                uId,
                mobileNumber,
                password
            };
            // TODO: Create User
            const userData = {
                _id: userObjectId,
                authId: authObjectId,
                firstname,
                lastname,
                mobileNumber,
                password,
                profilePicture: '',
                role: [user_interface_1.Role.User],
                savedStores: [],
                likedStores: [],
                deliveryAddresses: [],
                notifications: {
                    messages: true
                }
            };
            // TODO:  Add to redis cache
            // TODO: Save to database
            auth_queue_1.authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
            user_queue_1.userQueue.addUserJob('addUserToDB', { value: userData });
            // TODO: Send OTP to user via otp method
            const msg = yield sms_transport_1.smsTransport.sendSms(mobileNumber, `SnapShop Otp: ${otp}`, otpProvider);
            // if (msg === 'error') throw new BadRequestError('Error sending sms');
            const jwtPayload = {
                mobileNumber,
                uId,
                userId: userObjectId,
                roles: [user_interface_1.Role.User],
                profilePicture: ''
            };
            const authToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.config.JWT_TOKEN);
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Account created', token: authToken });
        });
    }
    exists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mobileNumber } = req.body;
            const userExists = yield auth_service_1.authService.getUserByPhonenumber(mobileNumber);
            if (userExists)
                throw new error_handler_1.BadRequestError('Mobile number already in use.');
            res.status(http_status_codes_1.default.OK).json({ message: 'Not in use' });
        });
    }
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mobileNumber, otp } = req.body;
            const user = yield auth_service_1.authService.getAuthUserByOtp(otp, mobileNumber);
            if (!user)
                throw new error_handler_1.BadRequestError('Otp is invalid');
            if (user.verified)
                throw new error_handler_1.BadRequestError('User already verified');
            user.verified = true;
            user.verificationExpiersIn = 0;
            user.verificationToken = '';
            yield user.save();
            res.status(http_status_codes_1.default.OK).json({ message: 'Account verified successfully' });
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mobileNumber, otpProvider } = req.body;
            const user = yield auth_service_1.authService.getUserByPhonenumber(mobileNumber);
            if (!user)
                throw new error_handler_1.NotFoundError('User not found');
            if (user.verified)
                throw new error_handler_1.BadRequestError('User already verified');
            // const otp = `${Helpers.generateOtp(4)}`;
            const otp = `1111`;
            user.verificationToken = otp;
            user.verificationExpiersIn = Date.now() + exports.OTP_EXPIRES_IN;
            yield user.save();
            const msg = yield sms_transport_1.smsTransport.sendSms(mobileNumber, `SnapShop Otp: ${otp}`, otpProvider);
            // if (msg === 'error') throw new BadRequestError('Error sending sms');
            res.status(http_status_codes_1.default.OK).json({ message: 'Otp resent successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(signup_1.signupSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignUp.prototype, "create", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(signup_1.verifyAccountSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignUp.prototype, "verifyAccount", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(signup_1.resendOtpSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignUp.prototype, "resendOtp", null);
exports.signup = new SignUp();
