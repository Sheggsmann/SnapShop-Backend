"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadMultiple = exports.videoUpload = exports.uploadFile = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadFile = (file, invalidate, overwrite, folder, public_id) => {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.upload(file, {
            invalidate,
            overwrite,
            public_id,
            folder,
            use_filename: true
        }, (error, result) => {
            if (error)
                resolve(error);
            resolve(result);
        });
    });
};
exports.uploadFile = uploadFile;
const videoUpload = (file, invalidate, overwrite, folder, public_id) => {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.upload(file, {
            resource_type: 'video',
            chunk_size: 50000,
            public_id,
            overwrite,
            invalidate,
            folder,
            use_filename: true
        }, (error, result) => {
            if (error)
                resolve(error);
            resolve(result);
        });
    });
};
exports.videoUpload = videoUpload;
const uploadMultiple = (files, type = 'image', invalidate, overwrite, folder, public_id) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = files.map((file) => {
        return type === 'image'
            ? (0, exports.uploadFile)(file, invalidate, overwrite, folder, public_id)
            : (0, exports.videoUpload)(file, invalidate, overwrite, folder, public_id);
    });
    const results = yield Promise.all(promises);
    return results;
});
exports.uploadMultiple = uploadMultiple;
const deleteFile = (public_id) => {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.destroy(public_id, (error, result) => {
            if (error)
                resolve(error);
            resolve(result);
        });
    });
};
exports.deleteFile = deleteFile;
