"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenance = void 0;
const admin_service_1 = require("../../../shared/services/db/admin.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async maintenance(req, res) {
        const service = await admin_service_1.adminService.getAdminByRole('Service');
        let isUnderMaintenance = false;
        if (service) {
            isUnderMaintenance = service.maintenance;
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Maintenance', isUnderMaintenance });
    }
}
exports.getMaintenance = new Get();
