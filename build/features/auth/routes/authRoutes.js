"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const signup_1 = require("../controllers/signup");
const password_1 = require("../controllers/password");
const signin_1 = require("../controllers/signin");
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/signup', signup_1.signup.create);
        this.router.post('/signin', signin_1.siginin.read);
        this.router.post('/store-signin', signin_1.siginin.readStore);
        this.router.post('/validate-number', signup_1.signup.exists);
        this.router.put('/verify-account', signup_1.signup.verifyAccount);
        this.router.post('/resend-otp', signup_1.signup.resendOtp);
        this.router.post('/forgot-password', password_1.password.create);
        this.router.post('/reset-password', password_1.password.update);
        return this.router;
    }
}
exports.authRoutes = new AuthRoutes();
