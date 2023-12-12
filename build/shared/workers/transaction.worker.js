"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsWorker = void 0;
const config_1 = require("../../config");
const transaction_service_1 = require("../services/db/transaction.service");
const log = config_1.config.createLogger('Transactions Worker');
class TransactionsWorker {
    async addTransactionToDB(job, done) {
        try {
            const { data } = job;
            await transaction_service_1.transactionService.addTransactionToDB(data);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.transactionsWorker = new TransactionsWorker();
