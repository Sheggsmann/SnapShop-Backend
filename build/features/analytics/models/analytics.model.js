"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModel = void 0;
const mongoose_1 = require("mongoose");
const analyticsSchema = new mongoose_1.Schema({
    store: {},
    product: {},
    user: {},
    event: String
}, {
    timestamps: true
});
const AnalyticsModel = (0, mongoose_1.model)('Analytics', analyticsSchema, 'Analytics');
exports.AnalyticsModel = AnalyticsModel;
