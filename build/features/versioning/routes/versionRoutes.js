"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionRoutes = void 0;
const get_version_1 = require("../controllers/get-version");
const update_version_1 = require("../controllers/update-version");
const express_1 = __importDefault(require("express"));
class VersionRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/app-version', get_version_1.getVersion.appVersion);
        this.router.put('/app-version', update_version_1.updateVersion.appVersion);
        return this.router;
    }
}
exports.versionRoutes = new VersionRoutes();