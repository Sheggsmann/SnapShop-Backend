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
exports.createStore = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const store_service_1 = require("../../../shared/services/db/store.service");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const store_scheme_1 = require("../schemes/store.scheme");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const mongodb_1 = require("mongodb");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, image, bgImage, description, address, latlng } = req.body;
            const [lat, lng] = latlng.split(',');
            const exists = yield store_service_1.storeService.getStoreByName(name);
            if (exists)
                throw new error_handler_1.BadRequestError('Store with name already exists');
            // Check if user already owns a store
            const ownsStore = yield store_service_1.storeService.getStoreByUserId(req.currentUser.userId);
            if (ownsStore)
                throw new error_handler_1.BadRequestError('User already owns a store');
            const storeObjectId = new mongodb_1.ObjectId();
            // TODO: Upload images to cloudinary
            const imageResult = (yield (0, cloudinary_upload_1.uploadFile)(image, true, true, 'store', `store_img_${storeObjectId}`));
            if (!imageResult.public_id)
                throw new error_handler_1.BadRequestError(imageResult.message);
            let bgImgResult = {};
            if (bgImage) {
                bgImgResult = (yield (0, cloudinary_upload_1.uploadFile)(image, true, true, 'storeBg', `store_bg_${storeObjectId}`));
                if (!bgImgResult.public_id)
                    throw new error_handler_1.BadRequestError(bgImgResult.message);
            }
            // Store Latitude and Longitude in reverse order because of the way
            // mongodb geospatial queries
            const store = {
                _id: storeObjectId,
                name,
                description,
                owner: req.currentUser.userId,
                image: imageResult.secure_url,
                uId: `${helpers_1.Helpers.genrateRandomIntegers(12)}`,
                bgImage: bgImage ? bgImgResult.secure_url : '',
                locations: [{ location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }],
                badges: [],
                verified: false
            };
            store_queue_1.storeQueue.addStoreJob('addStoreToDB', { value: store, userId: req.currentUser.userId });
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Store created successfully', store });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "store", null);
exports.createStore = new Create();
