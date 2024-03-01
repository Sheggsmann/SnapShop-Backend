"use strict";
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
        this.EARTH_RADIUS = 6378.1;
        this.UNIT = 'km';
        this.store = async (req, res) => {
            const { center } = req.params;
            if (!req.query.searchParam)
                throw new error_handler_1.BadRequestError('Search param is required');
            if (`${req.query.searchParam}`.length > 100)
                throw new error_handler_1.BadRequestError('Search param is too long');
            // const maxPrice = req.query.maxPrice ?? this.MAX_PRICE;
            // const minPrice = req.query.minPrice ?? this.MIN_PRICE;
            const unit = req.query.unit ?? this.UNIT;
            const distance = req.query.distance
                ? this.clampDistance(parseInt(req.query.distance), unit)
                : this.DEFAULT_DISTANCE;
            const [lat, lng] = center.split(',');
            if (!lat || !lng)
                throw new error_handler_1.BadRequestError('Please provide latitude and longitude in format lat,lng');
            if (!unit || !['km', 'm'].includes(unit))
                throw new error_handler_1.BadRequestError('Unit must be km(kilometers) or m(meters)');
            const radius = unit === 'km' ? distance / this.EARTH_RADIUS : distance / (this.EARTH_RADIUS * 1000);
            const token = helpers_1.Helpers.getTokenFromHeader(req);
            let authPayload = null;
            if (token)
                authPayload = helpers_1.Helpers.parseToken(token);
            searches_queue_1.searchesQueue.addSearchTermJob('addSearchTermToDB', {
                searchParam: `${req.query.searchParam}`,
                location: [parseFloat(lat), parseFloat(lng)],
                user: authPayload ? authPayload?.userId : ''
            });
            const products = await store_service_1.storeService.getNearbyStores(`${req.query.searchParam}`, parseFloat(lat), parseFloat(lng), radius, Boolean(req.query?.anywhere === 'true'));
            res.status(http_status_codes_1.default.OK).json({ message: 'Search results', products, productsCount: products.length });
        };
        this.clampDistance = (distance, unit = 'km') => {
            // using 1 for kilometers and 1000 for meters
            const unitFactor = unit === 'km' ? 1 : 1000;
            const d = Math.min(distance, this.MAX_DISTANCE * unitFactor);
            return d;
        };
    }
}
exports.searchStore = new SearchStore();
