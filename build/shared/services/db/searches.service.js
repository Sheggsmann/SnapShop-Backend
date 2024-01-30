"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchesService = void 0;
const searches_model_1 = require("../../../features/searches/models/searches.model");
class Searches {
    async add(searchParam, location, user) {
        await searches_model_1.SearchesModel.create({ searchParam, location, user });
    }
    async getSearches(skip, limit) {
        return await searches_model_1.SearchesModel.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstname email mobileNumber expoPushToken roles');
    }
    async getSearchesCount() {
        return await searches_model_1.SearchesModel.countDocuments({});
    }
}
exports.searchesService = new Searches();
