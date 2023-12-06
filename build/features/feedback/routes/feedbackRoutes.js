"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const create_feedback_1 = require("../controllers/create-feedback");
const get_feedback_1 = require("../controllers/get-feedback");
class FeedbackRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/feedback/:skip', auth_middleware_1.authMiddleware.checkAuth, get_feedback_1.getFeedback.all);
        this.router.post('/feedback', auth_middleware_1.authMiddleware.checkAuth, create_feedback_1.createFeedback.feedback);
        return this.router;
    }
}
exports.feedbackRoutes = new FeedbackRoutes();
