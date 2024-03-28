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
exports.shareStore = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const store_service_1 = require("../../../shared/services/db/store.service");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const store_scheme_1 = require("../schemes/store.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ShareStore {
    async getSlugLink(req, res) {
        const store = await store_service_1.storeService.getStoreByStoreId(req.params.storeId);
        let link = '';
        if (store && store?.slug) {
            link = helpers_1.Helpers.formatStoreLink(store.slug);
        }
        else {
            link = '';
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Store link', link });
    }
    async createStoreSlug(req, res) {
        const { slug } = req.body;
        const { storeId } = req.params;
        const store = await store_service_1.storeService.getStoreByStoreId(storeId);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        const cleanedSlug = helpers_1.Helpers.cleanSlug(slug);
        const exists = await store_service_1.storeService.getStoreBySlug(cleanedSlug);
        if (exists)
            throw new error_handler_1.BadRequestError('Slug already in use');
        const storeLink = helpers_1.Helpers.formatStoreLink(cleanedSlug);
        await store_service_1.storeService.saveStoreSlug(storeId, cleanedSlug, storeLink);
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Slug created successfully', slug: cleanedSlug, link: storeLink });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeSlugSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShareStore.prototype, "createStoreSlug", null);
exports.shareStore = new ShareStore();
