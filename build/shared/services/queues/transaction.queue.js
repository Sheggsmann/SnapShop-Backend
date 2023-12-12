"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionQueue = void 0;
const base_queue_1 = require("./base.queue");
const transaction_worker_1 = require("../../workers/transaction.worker");
class TransactionQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Transactions');
        this.processJob('addTransactionToDB', 5, transaction_worker_1.transactionsWorker.addTransactionToDB);
    }
    addTransactionJob(name, data) {
        this.addJob(name, data);
    }
}
exports.transactionQueue = new TransactionQueue();
