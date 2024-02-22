"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsMappings = void 0;
const tagsMapping_service_1 = require("../../../shared/services/db/tagsMapping.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async tag(req, res) {
        const tagsMappings = await tagsMapping_service_1.tagsMappingService.getTagsMappings();
        res.status(http_status_codes_1.default.OK).json({ message: 'Tag mappings', tagsMappings });
    }
}
exports.getTagsMappings = new Get();
