"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = void 0;
const feedback_model_1 = require("../models/feedback.model");
const feedback_scheme_1 = require("../schemes/feedback.scheme");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    async feedback(req, res) {
        const { title, description } = req.body;
        const feedbackData = {
            title,
            description
        };
        await feedback_model_1.FeedbackModel.create(feedbackData);
        res.status(http_status_codes_1.default.OK).json({ message: 'Feedback created successfully', feedback: feedbackData });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(feedback_scheme_1.addFeedbackSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "feedback", null);
exports.createFeedback = new Create();
