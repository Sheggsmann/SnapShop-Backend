"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Delete {
    async user(req, res) {
        // implement function to delete user from user model and auth model. 
        await user_service_1.userService.deleteUser(req.params.userId);
        res.status(http_status_codes_1.default.OK).json({ message: "User deleted successfully" });
    }
}
exports.deleteUser = new Delete();
