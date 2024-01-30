"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchesModel = void 0;
const mongoose_1 = require("mongoose");
const searchesSchema = new mongoose_1.Schema({
    searchParam: String,
    location: [],
    user: { ref: 'User', type: mongoose_1.Types.ObjectId, index: true }
}, {
    timestamps: true
});
const SearchesModel = (0, mongoose_1.model)('Searches', searchesSchema, 'Searches');
exports.SearchesModel = SearchesModel;
