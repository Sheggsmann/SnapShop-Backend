"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceWithdrawalService = void 0;
const balanceWithdrawal_interface_1 = require("../../../features/balanceWithdrawal/interfaces/balanceWithdrawal.interface");
const balanceWithdrawal_model_1 = require("../../../features/balanceWithdrawal/models/balanceWithdrawal.model");
class BalanceWithdrawalService {
    async addWithdrawalRequestToDB(data) {
        await balanceWithdrawal_model_1.BalanceWithdrawalModel.create(data);
    }
    async getPendingWithdrawalRequestsForStore(storeId) {
        return await balanceWithdrawal_model_1.BalanceWithdrawalModel.find({
            store: storeId,
            status: balanceWithdrawal_interface_1.balanceWithdrawalStatus.PENDING
        }).populate('store');
    }
}
exports.balanceWithdrawalService = new BalanceWithdrawalService();
