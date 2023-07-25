"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchesService = void 0;
const searches_model_1 = require("../../../features/searches/models/searches.model");
class Searches {
    async add(searchParam, location) {
        await searches_model_1.SearchesModel.create({ searchParam, location });
    }
}
exports.searchesService = new Searches();
