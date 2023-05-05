"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const error_handler_1 = require("../helpers/error-handler");
const config_1 = require("../../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    protect(req, res, next) {
        let token = '';
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token)
            throw new error_handler_1.NotAuthorizedError('Token is not available. Please login.');
        try {
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.JWT_TOKEN);
            req.currentUser = payload;
        }
        catch (err) {
            throw new error_handler_1.NotAuthorizedError('Token is invalid. Please login');
        }
        next();
    }
    restrictTo(roles) {
        return (req, res, next) => {
            roles.forEach((role) => {
                if (!req.currentUser.roles.includes(role)) {
                    throw new error_handler_1.NotAuthorizedError('You do not have the permissions to access this route.');
                }
            });
            next();
        };
    }
    checkAuth(req, res, next) {
        if (!req.currentUser)
            throw new error_handler_1.NotAuthorizedError('Authentication is required to access this route');
        next();
    }
}
exports.authMiddleware = new AuthMiddleware();
