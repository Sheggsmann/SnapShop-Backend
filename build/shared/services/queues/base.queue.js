"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueue = exports.serverAdapter = exports.bullAdapters = void 0;
const bull_1 = __importDefault(require("bull"));
const express_1 = require("@bull-board/express");
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const config_1 = require("../../../config");
exports.bullAdapters = [];
exports.serverAdapter = new express_1.ExpressAdapter().setBasePath('/queues');
class BaseQueue {
    constructor(queueName) {
        this.queue = new bull_1.default(queueName, `${config_1.config.REDIS_HOST}`);
        this.log = config_1.config.createLogger(`${queueName} Queue`);
        exports.bullAdapters.push(new bullAdapter_1.BullAdapter(this.queue));
        exports.bullAdapters = [...new Set(exports.bullAdapters)];
        (0, api_1.createBullBoard)({ queues: exports.bullAdapters, serverAdapter: exports.serverAdapter });
        this.queue.on('completed', (job) => job.remove());
        this.queue.on('global:completed', (jobId) => this.log.info(`Job ${jobId} is completed`));
        this.queue.on('global:stalled', (jobId) => this.log.info(`Job ${jobId} is stalled`));
    }
    addJob(name, data) {
        this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 50000 } });
    }
    processJob(name, concurrency, callback) {
        this.queue.process(name, concurrency, callback);
    }
}
exports.BaseQueue = BaseQueue;
