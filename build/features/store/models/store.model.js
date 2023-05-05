"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModel = void 0;
const mongoose_1 = require("mongoose");
const storeSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    owner: { type: mongoose_1.Types.ObjectId, ref: 'User', index: true, required: true },
    uId: String,
    bgImage: String,
    image: String,
    description: String,
    locations: [
        {
            location: {
                type: { type: String, default: 'Point', enum: ['Point'] },
                coordinates: [Number]
            },
            address: String,
            isDefault: { type: Boolean, default: false }
        }
    ],
    verified: { type: Boolean, default: false },
    badges: [String],
    productsCount: { type: Number, default: 0 }
}, { timestamps: true });
storeSchema.index({ 'locations.location': '2dsphere' });
storeSchema.methods.isOwner = function (userId) {
    return String(this.owner) === String(userId);
};
const StoreModel = (0, mongoose_1.model)('Store', storeSchema, 'Store');
exports.StoreModel = StoreModel;