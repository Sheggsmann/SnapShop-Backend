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
exports.signup = exports.OTP_EXPIRES_IN = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const mongodb_1 = require("mongodb");
const auth_interface_1 = require("../interfaces/auth.interface");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const signup_1 = require("../schemes/signup");
const sms_transport_1 = require("../../../shared/services/sms/sms.transport");
const user_interface_1 = require("../../user/interfaces/user.interface");
const auth_queue_1 = require("../../../shared/services/queues/auth.queue");
const user_queue_1 = require("../../../shared/services/queues/user.queue");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.OTP_EXPIRES_IN = 5 * 60 * 1000;
class SignUp {
    async create(req, res) {
        const { mobileNumber, password, firstname, lastname, otpProvider, source, app } = req.body;
        // If the user exists, send an otp to the user
        const userExists = await auth_service_1.authService.getUserByPhonenumber(mobileNumber);
        if (userExists) {
            throw new error_handler_1.BadRequestError('User already exists');
        }
        const authObjectId = new mongodb_1.ObjectId();
        const userObjectId = new mongodb_1.ObjectId();
        const uId = `${helpers_1.Helpers.genrateRandomIntegers(12)}`;
        // TODO: Generate 4 digit OTP
        // const otp = `${Helpers.generateOtp(4)}`;
        // const otp = '1111';
        // TODO: Send OTP to user via otp method
        // const msg = await smsTransport.sendSms(mobileNumber, `SnapShup OTP: ${otp}`, otpProvider);
        // notify me about our sms service
        // if (msg === 'error')
        // throw new BadRequestError(`Account not created, we couldn't send your otp at this time.`);
        const authData = {
            _id: authObjectId,
            verified: false,
            // verificationExpiersIn: Date.now() + OTP_EXPIRES_IN,
            // verificationToken: otp,
            uId,
            mobileNumber,
            password
        };
        const userRoles = [user_interface_1.Role.User];
        if (app === auth_interface_1.Apps.Merchant) {
            userRoles.push(user_interface_1.Role.StoreOwner);
        }
        // TODO: Create User
        const userData = {
            _id: userObjectId,
            authId: authObjectId,
            firstname,
            lastname,
            mobileNumber,
            password,
            source,
            profilePicture: '',
            role: userRoles,
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
        const jwtPayload = {
            mobileNumber,
            uId,
            userId: userObjectId,
            roles: userRoles,
            profilePicture: ''
        };
        const authToken = helpers_1.Helpers.signToken(jwtPayload);
        res.status(http_status_codes_1.default.CREATED).json({ message: 'Account created', token: authToken });
    }
    async exists(req, res) {
        const { mobileNumber } = req.body;
        const userExists = await auth_service_1.authService.getUserByPhonenumber(mobileNumber);
        if (userExists)
            throw new error_handler_1.BadRequestError('Mobile number already in use.');
        res.status(http_status_codes_1.default.OK).json({ message: 'Not in use' });
    }
    async verifyAccount(req, res) {
        const { mobileNumber, otp } = req.body;
        const user = await auth_service_1.authService.getAuthUserByOtp(otp, mobileNumber);
        if (!user)
            throw new error_handler_1.BadRequestError('Otp is invalid');
        if (user.verified)
            throw new error_handler_1.BadRequestError('User already verified');
        user.verified = true;
        user.verificationExpiersIn = 0;
        user.verificationToken = '';
        await user.save();
        res.status(http_status_codes_1.default.OK).json({ message: 'Account verified successfully' });
    }
    async resendOtp(req, res) {
        const { mobileNumber, otpProvider } = req.body;
        const user = await auth_service_1.authService.getUserByPhonenumber(mobileNumber);
        if (!user)
            throw new error_handler_1.NotFoundError('User not found');
        if (user.verified)
            throw new error_handler_1.BadRequestError('User already verified');
        const otp = `${helpers_1.Helpers.generateOtp(4)}`;
        // const otp = `1111`;
        const msg = await sms_transport_1.smsTransport.sendSms(mobileNumber, `SnapShop OTP: ${otp}`, otpProvider);
        if (msg === 'error')
            throw new error_handler_1.BadRequestError('Error sending sms');
        user.verificationToken = otp;
        user.verificationExpiersIn = Date.now() + exports.OTP_EXPIRES_IN;
        await user.save();
        res.status(http_status_codes_1.default.OK).json({ message: 'Otp resent successfully' });
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
