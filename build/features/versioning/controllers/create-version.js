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
exports.addVersion = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const version_service_1 = require("../../../shared/services/db/version.service");
const versioning_scheme_1 = require("../schemes/versioning.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Add {
    isLowerVersion(previousVersion, newVersion) {
        const previousIntArray = previousVersion.split('.').map(Number);
        const newIntArray = newVersion.split('.').map(Number);
        for (let i = 0; i < Math.max(previousIntArray.length, newIntArray.length); i++) {
            const previousValue = previousIntArray[i] || 0;
            const newValue = newIntArray[i] || 0;
            if (previousValue < newValue) {
                return true;
            }
            else if (previousValue > newValue) {
                return false;
            }
        }
        return false;
    }
    // TODO: implement authentication and data filter
    async appVersion(req, res) {
        const { version, forceUpdate, update, app } = req.body;
        // Reject if current version is less than existing version
        // 1.0.0
        const result = await version_service_1.versioningService.getCurrentAppVersion(app);
        if (result) {
            if (!Add.prototype.isLowerVersion(result.currentAppVersion, version)) {
                throw new error_handler_1.BadRequestError("Version can't be lower than existing version");
            }
        }
        await version_service_1.versioningService.newAppVersion(version, forceUpdate || false, update, app);
        res.status(http_status_codes_1.default.OK).json({ message: 'App Version Created successfully' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(versioning_scheme_1.versioningSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "appVersion", null);
exports.addVersion = new Add();
