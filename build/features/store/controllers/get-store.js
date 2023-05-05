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
exports.getStores = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const product_service_1 = require("../../../shared/services/db/product.service");
const store_service_1 = require("../../../shared/services/db/store.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PAGE_SIZE = 30;
class Get {
    constructor() {
        // lists all the stores in a paginated format
        this.all = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = parseInt(page) * PAGE_SIZE;
            const stores = yield store_service_1.storeService.getStores(skip, limit);
            res.status(http_status_codes_1.default.OK).json({ message: 'Stores', stores });
        });
        // Accepts a store id and returns all the store products and categories
        this.storeByStoreId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const store = yield store_service_1.storeService.getStoreByStoreId(storeId);
            if (!store) {
                throw new error_handler_1.NotFoundError('Store not found');
            }
            if (!store.isOwner(req.currentUser.userId)) {
                throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
            }
            const categorizedProducts = yield store_service_1.storeService.getStoreProductsByCategory(storeId);
            const queryResult = Object.assign(Object.assign({}, store.toJSON()), { categories: [...categorizedProducts] });
            res.status(http_status_codes_1.default.OK).json({ message: 'Store details', store: queryResult });
        });
        this.productCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const storeId = req.currentUser.storeId;
            const store = yield store_service_1.storeService.getStoreByStoreId(`${storeId}`);
            if (!store)
                throw new error_handler_1.BadRequestError('Store not found');
            res.status(http_status_codes_1.default.OK).json({ message: 'Product Categories', categories: store.productCategories });
        });
        this.products = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const storeId = req.currentUser.storeId;
            const products = yield product_service_1.productService.getProductsByStoreId(`${storeId}`);
            res.status(http_status_codes_1.default.OK).json({ message: 'Product Categories', products });
        });
    }
}
exports.getStores = new Get();
