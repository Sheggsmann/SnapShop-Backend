"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceWithdraw = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const balanceWithdrawal_scheme_1 = require("../schemes/balanceWithdrawal.scheme");
const store_service_1 = require("../../../shared/services/db/store.service");
const balanceWithdraw_service_1 = require("../../../shared/services/db/balanceWithdraw.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class BalanceWithdraw {
    async requestWithdrawal(req, res) {
        const { amount, accountName, accountNumber, bankName } = req.body;
        const store = await store_service_1.storeService.getStoreByStoreId(`${req.currentUser.storeId}`);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        if (Number(amount) > Number(store.mainBalance)) {
            throw new error_handler_1.BadRequestError('Insufficient balance');
        }
        // Check if pending withdrawal balances are not greater than store's mainBalance
        const pendingWithdrawalRequests = await balanceWithdraw_service_1.balanceWithdrawalService.getPendingWithdrawalRequestsForStore(`${req.currentUser.storeId}`);
        const withdrawalBalance = pendingWithdrawalRequests.reduce((acc, curr) => (acc += curr.amount), 0);
        if (amount > Number(store.mainBalance) - withdrawalBalance) {
            throw new error_handler_1.BadRequestError('Insufficient balance');
        }
        await balanceWithdraw_service_1.balanceWithdrawalService.addWithdrawalRequestToDB({
            store: req.currentUser.storeId,
            amount,
            accountName,
            accountNumber,
            bankName
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Withdrawal request placed successfully' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(balanceWithdrawal_scheme_1.balanceWithdrawalSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BalanceWithdraw.prototype, "requestWithdrawal", null);
exports.balanceWithdraw = new BalanceWithdraw();