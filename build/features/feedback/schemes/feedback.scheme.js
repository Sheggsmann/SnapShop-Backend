"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeedbackSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addFeedbackSchema = joi_1.default.object().keys({
    title: joi_1.default.string().max(200).required(),
    description: joi_1.default.string().max(700).required()
});
exports.addFeedbackSchema = addFeedbackSchema;
