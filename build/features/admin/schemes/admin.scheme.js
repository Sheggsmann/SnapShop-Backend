"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const adminSchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(2).max(100).required(),
    password: joi_1.default.string().min(6).max(100).required(),
    role: joi_1.default.string().valid('Root', 'Manager', 'Service').required(),
    email: joi_1.default.string().email().required().min(2).max(100)
});
exports.adminSchema = adminSchema;
