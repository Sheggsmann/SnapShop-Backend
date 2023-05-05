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
exports.AuthModel = void 0;
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = require("mongoose");
const SALT_ROUND = 11;
const authSchema = new mongoose_1.Schema({
    uId: String,
    mobileNumber: String,
    password: String,
    passwordResetExpiresIn: Number,
    passwordResetToken: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verificationExpiersIn: Number
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});
authSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hashedPassword = yield (0, bcryptjs_1.hash)(this.password, SALT_ROUND);
            this.password = hashedPassword;
        }
        next();
    });
});
authSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = this.password;
        return (0, bcryptjs_1.compare)(password, hashedPassword);
    });
};
authSchema.methods.hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, bcryptjs_1.hash)(password, SALT_ROUND);
    });
};
const AuthModel = (0, mongoose_1.model)('Auth', authSchema, 'Auth');
exports.AuthModel = AuthModel;
