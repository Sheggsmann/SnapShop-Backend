"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = void 0;
const version_service_1 = require("../../../shared/services/db/version.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async appVersion(req, res) {
        const version = await version_service_1.versioningService.getCurrentAppVersion();
        res.status(http_status_codes_1.default.OK).json({ message: 'App version', version });
    }
}
exports.getVersion = new Get();
