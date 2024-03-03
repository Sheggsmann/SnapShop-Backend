"use strict";
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
        this.all = async (req, res) => {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = parseInt(page) * PAGE_SIZE;
            const stores = await store_service_1.storeService.getStores(skip, limit);
            const storesCount = await store_service_1.storeService.getStoresCount();
            res.status(http_status_codes_1.default.OK).json({ message: 'Stores', stores, storesCount });
        };
        this.myStore = async (req, res) => {
            const store = await store_service_1.storeService.getStoreByStoreId(`${req.currentUser.storeId}`);
            if (!store)
                throw new error_handler_1.NotFoundError('Store not found');
            res.status(http_status_codes_1.default.OK).json({ message: 'Store', store });
        };
        // Accepts a store id and returns all the store products and categories
        this.storeByStoreId = async (req, res) => {
            const { storeId } = req.params;
            const store = await store_service_1.storeService.getProtectedStoreByStoreid(storeId);
            if (!store) {
                throw new error_handler_1.NotFoundError('Store not found');
            }
            const categorizedProducts = await store_service_1.storeService.getStoreProductsByCategory(storeId);
            const queryResult = {
                ...store?.toJSON?.(),
                categories: [...categorizedProducts]
            };
            res.status(http_status_codes_1.default.OK).json({ message: 'Store details', store: queryResult });
        };
        this.storeByStoreName = async (req, res) => {
            const { name } = req.params;
            const store = await store_service_1.storeService.getStoreByName(name);
            res.status(http_status_codes_1.default.OK).json({ message: 'Store details', store });
        };
        this.productCategories = async (req, res) => {
            const storeId = req.currentUser.storeId;
            const store = await store_service_1.storeService.getStoreByStoreId(`${storeId}`);
            if (!store)
                throw new error_handler_1.BadRequestError('Store not found');
            res.status(http_status_codes_1.default.OK).json({ message: 'Product Categories', categories: store.productCategories });
        };
        this.storeByStoreSlug = async (req, res) => {
            const { slug } = req.params;
            const store = await store_service_1.storeService.getStoreBySlug(slug);
            if (!store)
                throw new error_handler_1.NotFoundError('Store not found');
            const categorizedProducts = await store_service_1.storeService.getStoreProductsByCategory(store._id.toString());
            const queryResult = { ...store.toJSON(), categories: [...categorizedProducts] };
            res.status(http_status_codes_1.default.OK).json({ message: 'Store details', store: queryResult });
        };
        this.products = async (req, res) => {
            const storeId = req.currentUser.storeId;
            const products = await product_service_1.productService.getProductsByStoreId(`${storeId}`);
            res.status(http_status_codes_1.default.OK).json({ message: 'Product Categories', products });
        };
    }
}
exports.getStores = new Get();
