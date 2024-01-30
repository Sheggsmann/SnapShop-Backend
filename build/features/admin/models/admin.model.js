"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = require("mongoose");
const SALT_ROUND = 11;
const adminSchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, unique: true },
    role: { type: String, unique: true },
    password: String,
    serviceChargeFromUsers: Number,
    serviceChargeFromStores: Number,
    maintenance: { type: Boolean, default: false }
}, {
    timestamps: true
});
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await (0, bcryptjs_1.hash)(this.password, SALT_ROUND);
        this.password = hashedPassword;
    }
    next();
});
adminSchema.methods.comparePassword = async function (password) {
    const hashedPassword = this.password;
    return (0, bcryptjs_1.compare)(password, hashedPassword);
};
const AdminModel = (0, mongoose_1.model)('Admin', adminSchema, 'Admin');
exports.AdminModel = AdminModel;
