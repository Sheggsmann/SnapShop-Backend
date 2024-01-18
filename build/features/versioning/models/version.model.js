"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionModel = void 0;
const mongoose_1 = require("mongoose");
const versioningSchema = new mongoose_1.Schema({
    currentAppVersion: String,
    update: Boolean,
    forceUpdate: Boolean,
    app: {
        type: String,
        default: 'store',
        enum: ['user', 'store']
    }
}, { timestamps: true });
exports.VersionModel = (0, mongoose_1.model)('Versioning', versioningSchema, 'Versioning');
