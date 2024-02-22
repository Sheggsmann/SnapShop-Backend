"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsMappingModel = void 0;
const mongoose_1 = require("mongoose");
const tagsMappingSchema = new mongoose_1.Schema({
    name: String,
    tags: [String]
});
const TagsMappingModel = (0, mongoose_1.model)('TagsMapping', tagsMappingSchema, 'TagsMapping');
exports.TagsMappingModel = TagsMappingModel;
