"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const order_service_1 = require("../../../shared/services/db/order.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    myOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield order_service_1.orderService.getUserOrders(req.currentUser.userId);
            res.status(http_status_codes_1.default.OK).json({ message: 'User orders', orders });
        });
    }
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = req.params;
            const order = yield order_service_1.orderService.getOrderByOrderId(orderId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Order details', order });
        });
    }
    storeOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const orders = yield order_service_1.orderService.getOrdersByStoreId(storeId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Store orders', orders });
        });
    }
}
exports.getOrders = new Get();
