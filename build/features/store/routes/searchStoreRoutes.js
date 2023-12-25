"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStoreRoutes = void 0;
const express_1 = __importDefault(require("express"));
const search_store_1 = require("../controllers/search-store");
const get_user_1 = require("../../user/controllers/get-user");
class SearchStoreRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/nearby-stores/:center', search_store_1.searchStore.store);
        this.router.get('/guest/feed', get_user_1.getUser.guestFeed);
        return this.router;
    }
}
exports.searchStoreRoutes = new SearchStoreRoutes();
