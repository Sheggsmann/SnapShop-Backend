"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const admin_interface_1 = require("../../../features/admin/interfaces/admin.interface");
const admin_model_1 = require("../../../features/admin/models/admin.model");
class AdminService {
    async createAdmin(data) {
        await admin_model_1.AdminModel.create(data);
    }
    async getAdminByRole(role) {
        return await admin_model_1.AdminModel.findOne({ role });
    }
    async getAdminByEmail(email) {
        return await admin_model_1.AdminModel.findOne({ email });
    }
    async getAdmin(role, email) {
        return await admin_model_1.AdminModel.findOne({ role, email });
    }
    async updateServiceAdminUserCharge(amount) {
        await admin_model_1.AdminModel.updateOne({ role: admin_interface_1.AdminRole.Service }, { $inc: { serviceChargeFromUsers: amount } });
    }
    async updateServiceAdminStoreCharge(amount) {
        await admin_model_1.AdminModel.updateOne({ role: admin_interface_1.AdminRole.Service }, { $inc: { serviceChargeFromStores: amount } });
    }
    async createAppServiceAdmin() {
        const serviceAdmin = await AdminService.prototype.getAdminByRole('Service');
        if (!serviceAdmin) {
            await AdminService.prototype.createAdmin({
                name: 'Service Admin',
                role: admin_interface_1.AdminRole.Service,
                password: '',
                serviceChargeFromStores: 0,
                serviceChargeFromUsers: 0
            });
        }
    }
}
exports.adminService = new AdminService();
