"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchesQueue = void 0;
const base_queue_1 = require("./base.queue");
const searches_worker_1 = require("../../workers/searches.worker");
class SearchesQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Searches');
        this.processJob('addSearchTermToDB', 5, searches_worker_1.searchesWorker.addSearchTermToDB);
    }
    addSearchTermJob(name, data) {
        this.addJob(name, data);
    }
}
exports.searchesQueue = new SearchesQueue();
