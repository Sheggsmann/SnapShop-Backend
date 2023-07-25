"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionModel = void 0;
const mongoose_1 = require("mongoose");
const versioningSchema = new mongoose_1.Schema({
    currentAppVersion: String,
    forceUpdate: String
}, { timestamps: true });
exports.VersionModel = (0, mongoose_1.model)('Versioning', versioningSchema, 'Versioning');
