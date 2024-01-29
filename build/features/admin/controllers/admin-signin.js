"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSignin = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const admin_service_1 = require("../../../shared/services/db/admin.service");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const user_interface_1 = require("../../user/interfaces/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class SignIn {
    async read(req, res) {
        const { email, role, password } = req.body;
        const admin = await admin_service_1.adminService.getAdmin(role, email);
        if (!admin)
            throw new error_handler_1.BadRequestError('Admin not found');
        const isPasswordCorrect = await admin.comparePassword(password);
        if (!isPasswordCorrect)
            throw new error_handler_1.BadRequestError('Invalid credentials');
        const adminJwt = helpers_1.Helpers.signToken({
            adminId: admin._id,
            roles: [user_interface_1.Role.Admin],
            name: admin.name,
            email: admin.email
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Signin Successful', admin, token: adminJwt });
    }
}
exports.adminSignin = new SignIn();
