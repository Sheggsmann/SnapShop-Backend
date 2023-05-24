"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productConstants = void 0;
class Constants {
    constructor() {
        this.PRODUCT_IMAGE_FOLDER = 'product_images';
        this.PRODUCT_VIDEO_FOLDER = 'product_videos';
        this.PRODUCT_IMAGE_PREFIX = 'product_img_';
        this.PRODUCT_VIDEO_PREFIX = 'product_vid_';
        this.MAX_PRODUCT_IMAGES = 5;
        this.MAX_VIDEO_FILE_SIZE_IN_MB = 15;
    }
}
exports.productConstants = new Constants();
