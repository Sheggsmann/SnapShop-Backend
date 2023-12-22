"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["ACTIVE"] = "active";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["DISPUTE"] = "dispute";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
