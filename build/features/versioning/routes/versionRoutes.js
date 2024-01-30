"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionRoutes = void 0;
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const user_interface_1 = require("../../user/interfaces/user.interface");
const create_version_1 = require("../controllers/create-version");
const get_version_1 = require("../controllers/get-version");
const update_version_1 = require("../controllers/update-version");
const express_1 = __importDefault(require("express"));
class VersionRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/app-version', get_version_1.getVersion.appVersion);
        this.router.get('/app-version/:app', get_version_1.getVersion.appVersion);
        this.router.put('/app-version', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), update_version_1.updateVersion.appVersion);
        this.router.post('/app-version', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo([user_interface_1.Role.Admin]), create_version_1.addVersion.appVersion);
        return this.router;
    }
}
exports.versionRoutes = new VersionRoutes();
