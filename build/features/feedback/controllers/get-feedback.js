"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedback = void 0;
const feedback_model_1 = require("../models/feedback.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PAGE_SIZE = 60;
class Get {
    async all(req, res) {
        const { page } = req.params;
        const skip = (parseInt(page) - 1) * PAGE_SIZE;
        const limit = parseInt(page) * PAGE_SIZE;
        const feedbacks = (await feedback_model_1.FeedbackModel.find({})
            .skip(skip)
            .limit(limit));
        res.status(http_status_codes_1.default.OK).json({ message: 'Feedback', feedbacks });
    }
}
exports.getFeedback = new Get();
