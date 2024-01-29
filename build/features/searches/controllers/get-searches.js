"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearches = void 0;
const searches_service_1 = require("../../../shared/services/db/searches.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PAGE_SIZE = 50;
class Get {
    async all(req, res) {
        const { page } = req.params;
        const skip = (parseInt(page) - 1) * PAGE_SIZE;
        const limit = parseInt(page) * PAGE_SIZE;
        const searches = await searches_service_1.searchesService.getSearches(skip, limit);
        const searchesCount = await searches_service_1.searchesService.getSearchesCount();
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Searches', searches, currentSearchesCount: searches.length, searchesCount });
    }
}
exports.getSearches = new Get();
