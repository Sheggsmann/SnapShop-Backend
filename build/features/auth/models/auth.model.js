"use strict";
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
        transform(_, ret) {
            delete ret.password;
            return ret;
        }
    }
});
authSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await (0, bcryptjs_1.hash)(this.password, SALT_ROUND);
        this.password = hashedPassword;
    }
    next();
});
authSchema.methods.comparePassword = async function (password) {
    const hashedPassword = this.password;
    return (0, bcryptjs_1.compare)(password, hashedPassword);
};
authSchema.methods.hashPassword = async function (password) {
    return (0, bcryptjs_1.hash)(password, SALT_ROUND);
};
const AuthModel = (0, mongoose_1.model)('Auth', authSchema, 'Auth');
exports.AuthModel = AuthModel;
