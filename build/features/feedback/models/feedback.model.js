"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModel = void 0;
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String }
});
const FeedbackModel = (0, mongoose_1.model)('Feedback', feedbackSchema, 'Feedback');
exports.FeedbackModel = FeedbackModel;
