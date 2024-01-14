"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const get_maintenance_1 = require("../controllers/get-maintenance");
class AdminRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/maintenance', get_maintenance_1.getMaintenance.maintenance);
        return this.router;
    }
}
exports.adminRoutes = new AdminRoutes();
