"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const user_interface_1 = require("../interfaces/user.interface");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    authId: { type: mongoose_1.Types.ObjectId, ref: 'Auth', index: true },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    mobileNumber: String,
    source: String,
    email: { type: String, unique: true, trim: true },
    roles: { type: [], default: [user_interface_1.Role.User] },
    savedStores: [{ type: mongoose_1.Types.ObjectId, ref: 'Store' }],
    likedProducts: [{ type: mongoose_1.Types.ObjectId, ref: 'Product' }],
    profilePicture: { type: String, default: '' },
    deliveryAddresses: [],
    notifications: {
        messages: { type: Boolean, default: true }
    },
    storeCount: { type: Number, default: 0 },
    expoPushToken: String
}, {
    timestamps: true,
    minimize: false
});
const UserModel = (0, mongoose_1.model)('User', userSchema, 'User');
exports.UserModel = UserModel;
