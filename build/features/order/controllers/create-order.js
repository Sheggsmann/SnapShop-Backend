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
exports.createOrder = void 0;
const user_service_1 = require("../../../shared/services/db/user.service");
const mongodb_1 = require("mongodb");
const order_queue_1 = require("../../../shared/services/queues/order.queue");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const order_scheme_1 = require("../schemes/order.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const { products } = req.body;
            const orderObjectId = new mongodb_1.ObjectId();
            const user = yield user_service_1.userService.getUserById(req.currentUser.userId);
            const orderData = {
                _id: orderObjectId,
                store: storeId,
                user: {
                    userId: req.currentUser.userId,
                    name: `${user.firstname} ${user.lastname}`,
                    mobileNumber: user.mobileNumber
                },
                products
            };
            order_queue_1.orderQueue.addOrderJob('addOrderToDB', { value: orderData });
            res.status(http_status_codes_1.default.OK).json({ message: 'Order created successfully', order: orderData });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(order_scheme_1.orderSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "order", null);
exports.createOrder = new Create();
