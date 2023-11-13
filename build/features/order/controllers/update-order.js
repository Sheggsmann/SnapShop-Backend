"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = void 0;
// import { IOrderDocument } from '@order/interfaces/order.interface';
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class UpdateOrder {
    async orderPayment(req, res) {
        console.log('\n\n');
        console.log('[REQUEST HEADERS]:', req.headers);
        console.log('\n[REQUEST BODY]:', req.body);
        res.status(http_status_codes_1.default.OK);
    }
}
exports.updateOrder = new UpdateOrder();
