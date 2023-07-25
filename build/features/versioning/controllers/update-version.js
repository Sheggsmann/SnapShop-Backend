"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const version_service_1 = require("../../../shared/services/db/version.service");
const versioning_scheme_1 = require("../schemes/versioning.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    isLowerVersion(previousVersion, newVersion) {
        return parseInt(previousVersion.replaceAll('.', ''), 10) < parseInt(newVersion.replaceAll('.', ''), 10);
    }
    // TODO: implement authentication and data filter
    async appVersion(req, res) {
        const { version, forceUpdate } = req.body;
        // Reject if current version is less than existing version
        // 1.0.0
        const result = await version_service_1.versioningService.getCurrentAppVersion();
        if (!Update.prototype.isLowerVersion(result.currentAppVersion, version)) {
            throw new error_handler_1.BadRequestError("Version can't be lower than existing version");
        }
        await version_service_1.versioningService.updateAppVersion(version, forceUpdate || false);
        res.status(http_status_codes_1.default.OK).json({ message: 'Updated successfully' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(versioning_scheme_1.versioningSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "appVersion", null);
exports.updateVersion = new Update();
