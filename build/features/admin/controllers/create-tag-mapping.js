"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTagMapping = void 0;
const tagsMapping_service_1 = require("../../../shared/services/db/tagsMapping.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    async tag(req, res) {
        const { name, tags } = req.body;
        await tagsMapping_service_1.tagsMappingService.addTagsMappingToDB(name, tags);
        res.status(http_status_codes_1.default.OK).json({ message: 'Tag mapping created successfully' });
    }
}
exports.createTagMapping = new Create();
