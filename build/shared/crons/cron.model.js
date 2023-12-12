"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobModel = void 0;
const mongoose_1 = require("mongoose");
const cronJobSchema = new mongoose_1.Schema({
    schedule: { type: String, required: true, unique: true },
    lastExecutionTime: { type: Number, default: null }
}, { timestamps: true });
const CronJobModel = (0, mongoose_1.model)('CronJobs', cronJobSchema, 'CronJobs');
exports.CronJobModel = CronJobModel;
