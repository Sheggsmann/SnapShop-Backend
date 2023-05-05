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
exports.searchStore = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const store_service_1 = require("../../../shared/services/db/store.service");
const searches_queue_1 = require("../../../shared/services/queues/searches.queue");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class SearchStore {
    constructor() {
        this.MAX_DISTANCE = 120; // km
        this.DEFAULT_DISTANCE = 5; // km
        this.MIN_PRICE = 0;
        this.MAX_PRICE = 10000000;
        this.UNIT = 'km';
        this.store = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { center } = req.params;
            if (!req.query.searchParam)
                throw new error_handler_1.BadRequestError('Search param is required');
            const searchParam = new RegExp(helpers_1.Helpers.escapeRegExp(`${req.query.searchParam}`), 'i');
            const maxPrice = (_a = req.query.maxPrice) !== null && _a !== void 0 ? _a : this.MAX_PRICE;
            const minPrice = (_b = req.query.minPrice) !== null && _b !== void 0 ? _b : this.MIN_PRICE;
            const unit = (_c = req.query.unit) !== null && _c !== void 0 ? _c : this.UNIT;
            const distance = req.query.distance
                ? this.clampDistance(parseInt(req.query.distance), unit)
                : this.DEFAULT_DISTANCE;
            const [lat, lng] = center.split(',');
            if (!lat || !lng)
                throw new error_handler_1.BadRequestError('Please provide latitude and longitude in format lat,lng');
            if (!unit || !['km', 'm'].includes(unit))
                throw new error_handler_1.BadRequestError('Unit must be km(kilometers) or m(meters)');
            const radius = unit === 'km' ? distance / 6378.1 : distance / 1000 / 6378.1;
            searches_queue_1.searchesQueue.addSearchTermJob('addSearchTermToDB', {
                searchParam: `${req.query.searchParam}`,
                location: [parseFloat(lat), parseFloat(lng)]
            });
            const products = yield store_service_1.storeService.getNearbyStores(searchParam, parseFloat(lat), parseFloat(lng), radius, minPrice * 1, maxPrice * 1);
            res.status(http_status_codes_1.default.OK).json({ message: 'Search results', products });
        });
        this.clampDistance = (distance, unit = 'km') => {
            // using 1 for kilometers and 1000 for meters
            const d = Math.min(Math.max(distance, unit === 'km' ? 1 : 1000), this.MAX_DISTANCE);
            return d;
        };
    }
}
exports.searchStore = new SearchStore();
