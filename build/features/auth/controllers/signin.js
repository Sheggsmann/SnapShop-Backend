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
exports.siginin = void 0;
const signin_1 = require("../schemes/signin");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const config_1 = require("../../../config");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const store_service_1 = require("../../../shared/services/db/store.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class SignIn {
    async verifyLoginDetails(mobileNumber, password) {
        const existingUser = await auth_service_1.authService.getUserByPhonenumber(mobileNumber);
        if (!existingUser)
            throw new error_handler_1.BadRequestError('Invalid credentials');
        const passwordMatch = await existingUser.comparePassword(password);
        if (!passwordMatch)
            throw new error_handler_1.BadRequestError('Invalid credentials');
        if (!existingUser.verified)
            throw new error_handler_1.BadRequestError('Account not verified');
        return existingUser;
    }
    async read(req, res) {
        const { mobileNumber, password } = req.body;
        const authUser = await SignIn.prototype.verifyLoginDetails(mobileNumber, password);
        const user = await user_service_1.userService.getUserByAuthId(`${authUser._id}`);
        const userJwt = jsonwebtoken_1.default.sign({
            uId: user.uId,
            userId: user._id,
            roles: user.roles,
            profilePicture: user.profilePicture,
            mobileNumber: authUser.mobileNumber
        }, config_1.config.JWT_TOKEN);
        res.status(http_status_codes_1.default.OK).json({ message: 'User login successful', token: userJwt, user });
    }
    async readStore(req, res) {
        const { mobileNumber, password } = req.body;
        const authUser = await SignIn.prototype.verifyLoginDetails(mobileNumber, password);
        const user = await user_service_1.userService.getUserByAuthId(`${authUser._id}`);
        const store = await store_service_1.storeService.getStoreByUserId(`${user._id}`);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found.');
        const userJwt = jsonwebtoken_1.default.sign({
            uId: user.uId,
            userId: user._id,
            storeId: store._id,
            roles: user.roles,
            profilePicture: user.profilePicture,
            mobileNumber: authUser.mobileNumber
        }, config_1.config.JWT_TOKEN);
        res.status(http_status_codes_1.default.OK).json({ message: 'Store login successful', token: userJwt, user, store });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(signin_1.loginSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignIn.prototype, "read", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(signin_1.loginSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignIn.prototype, "readStore", null);
exports.siginin = new SignIn();
