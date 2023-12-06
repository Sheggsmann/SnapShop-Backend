"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = void 0;
const feedback_model_1 = require("../models/feedback.model");
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
exports.createFeedback = new Create();
