"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsMappingService = void 0;
const tag_mapping_model_1 = require("../../../features/admin/models/tag-mapping.model");
class TagsMappingService {
    async addTagsMappingToDB(name, tags) {
        await tag_mapping_model_1.TagsMappingModel.create({ name, tags });
    }
    async getTagsMappings() {
        return await tag_mapping_model_1.TagsMappingModel.find({});
    }
}
exports.tagsMappingService = new TagsMappingService();
