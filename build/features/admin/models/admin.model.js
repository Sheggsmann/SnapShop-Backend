"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    name: String,
    role: { type: String, unique: true },
    password: String,
    serviceChargeFromUsers: Number,
    serviceChargeFromStores: Number
}, {
    timestamps: true
});
const AdminModel = (0, mongoose_1.model)('Admin', adminSchema, 'Admin');
exports.AdminModel = AdminModel;
