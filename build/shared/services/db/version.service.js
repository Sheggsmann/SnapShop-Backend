"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versioningService = void 0;
const version_model_1 = require("../../../features/versioning/models/version.model");
class VersioningService {
    async getCurrentAppVersion() {
        return (await version_model_1.VersionModel.findOne());
    }
    async updateAppVersion(version, forceUpdate = false) {
        const existingDocument = await version_model_1.VersionModel.findOne({});
        if (!existingDocument) {
            await version_model_1.VersionModel.create({ currentAppVersion: version, forceUpdate });
        }
        else {
            existingDocument.currentAppVersion = version;
            existingDocument.forceUpdate = forceUpdate;
            await existingDocument.save();
        }
    }
}
exports.versioningService = new VersioningService();
