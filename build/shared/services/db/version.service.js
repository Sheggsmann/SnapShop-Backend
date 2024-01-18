"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versioningService = void 0;
const version_model_1 = require("../../../features/versioning/models/version.model");
class VersioningService {
    async getCurrentAppVersion(app = 'store') {
        const versions = await version_model_1.VersionModel.find({ app }).sort({ createdAt: -1 });
        return versions[0];
    }
    async updateAppVersion(version, forceUpdate = false, update = false, app = 'store') {
        const existingDocument = await version_model_1.VersionModel.findOne({});
        if (!existingDocument) {
            await version_model_1.VersionModel.create({ currentAppVersion: version, forceUpdate });
        }
        else {
            existingDocument.currentAppVersion = version;
            existingDocument.forceUpdate = forceUpdate;
            existingDocument.update = update;
            existingDocument.app = app;
            await existingDocument.save();
        }
    }
    async newAppVersion(version, forceUpdate = false, update = false, app = 'store') {
        const existing = await version_model_1.VersionModel.findOne({ version, app });
        if (existing)
            return;
        await version_model_1.VersionModel.create({ currentAppVersion: version, forceUpdate, update, app });
    }
}
exports.versioningService = new VersioningService();
