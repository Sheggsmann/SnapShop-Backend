"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUploader = exports.deleteFile = exports.uploadMultiple = exports.videoUpload = exports.uploadFile = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const product_constants_1 = require("../../../features/product/constants/product.constants");
const multer_1 = __importDefault(require("multer"));
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
const uploadMultiple = async (files, type = 'image', invalidate, overwrite, folder, public_id) => {
    const promises = files.map((file) => {
        return type === 'image'
            ? (0, exports.uploadFile)(file, invalidate, overwrite, folder, public_id)
            : (0, exports.videoUpload)(file, invalidate, overwrite, folder, public_id);
    });
    const results = await Promise.all(promises);
    return results;
};
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
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        folder: product_constants_1.productConstants.PRODUCT_VIDEO_FOLDER,
        allowed_formats: ['mp4', 'mov'],
        limits: { fileSize: 5 * 1024 * 1024 }
    }
});
exports.videoUploader = (0, multer_1.default)({ storage });
