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
exports.createStore = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const store_service_1 = require("../../../shared/services/db/store.service");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const store_scheme_1 = require("../schemes/store.scheme");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const mongodb_1 = require("mongodb");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    async store(req, res) {
        const { name, description, address, latlng } = req.body;
        const [lat, lng] = latlng.split(',');
        const exists = await store_service_1.storeService.getStoreByName(name);
        if (exists)
            throw new error_handler_1.BadRequestError('Store with name already exists');
        // Check if user already owns a store
        const ownsStore = await store_service_1.storeService.getStoreByUserId(req.currentUser.userId);
        if (ownsStore)
            throw new error_handler_1.BadRequestError('User already owns a store');
        const storeObjectId = new mongodb_1.ObjectId();
        const slug = helpers_1.Helpers.generateUniqueSlug(name);
        // Store Latitude and Longitude in reverse order because of the way
        // mongodb geospatial queries
        const store = {
            _id: storeObjectId,
            name,
            description,
            slug,
            slugUrl: helpers_1.Helpers.formatStoreLink(slug),
            owner: req.currentUser.userId,
            uId: `${helpers_1.Helpers.genrateRandomIntegers(12)}`,
            locations: [{ location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }],
            badges: [],
            verified: false,
            mobileNumber: req.currentUser.mobileNumber,
            escrowBalance: 0,
            mainBalance: 0
        };
        store_queue_1.storeQueue.addStoreJob('addStoreToDB', { value: store, userId: req.currentUser.userId });
        // sign a new jwt token appending the storeId to it
        const jwtPayload = {
            mobileNumber: req.currentUser.mobileNumber,
            uId: req.currentUser.uId,
            userId: req.currentUser.userId,
            roles: req.currentUser.roles,
            storeId: storeObjectId
        };
        const authToken = helpers_1.Helpers.signToken(jwtPayload);
        res.status(http_status_codes_1.default.CREATED).json({ message: 'Store created successfully', store, token: authToken });
    }
    // Add Joi validation
    async productCategory(req, res) {
        const { category } = req.body;
        const store = await store_service_1.storeService.getStoreByStoreId(`${req.currentUser.storeId}`);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        if (store.productCategories.includes(category.toLowerCase()))
            throw new error_handler_1.BadRequestError('Category already exists');
        const categories = [...store.productCategories, category.toLowerCase()];
        await store_service_1.storeService.updateStore(`${req.currentUser.storeId}`, { productCategories: categories });
        res.status(http_status_codes_1.default.OK).json({ message: 'Product category created successfully', category });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "store", null);
exports.createStore = new Create();
