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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
const user_interface_1 = require("../../../features/user/interfaces/user.interface");
const user_model_1 = require("../../../features/user/models/user.model");
const mongodb_1 = require("mongodb");
class StoreService {
    addStoreToDB(userId, store) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdStore = store_model_1.StoreModel.create(store);
            const user = user_model_1.UserModel.updateOne({ _id: userId }, { $inc: { storeCount: 1 }, $push: { roles: user_interface_1.Role.StoreOwner } });
            yield Promise.all([createdStore, user]);
        });
    }
    getStores(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield store_model_1.StoreModel.find({}).skip(skip).limit(limit);
            return stores;
        });
    }
    getStoreByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield store_model_1.StoreModel.findOne({ name });
        });
    }
    getStoreByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield store_model_1.StoreModel.findOne({ owner: userId });
        });
    }
    getStoreByStoreId(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield store_model_1.StoreModel.findOne({ _id: storeId });
        });
    }
    getNearbyStores(searchParam, latitude, longitude, radius, minPrice, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield product_model_1.ProductModel.aggregate([
                { $match: { name: searchParam } },
                { $match: { $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }] } },
                { $lookup: { from: 'Store', localField: 'store', foreignField: '_id', as: 'store' } },
                { $unwind: '$store' },
                {
                    $match: {
                        'store.locations.location': { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
                    }
                },
                { $limit: 1000 }
            ]);
            return products;
        });
    }
    getStoreProductsByCategory(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield product_model_1.ProductModel.aggregate([
                { $match: { store: new mongodb_1.ObjectId(storeId) } },
                { $group: { _id: '$category', products: { $push: '$$ROOT' } } }
            ]);
            return products;
        });
    }
    updateStore(storeId, updatedStore) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store_model_1.StoreModel.updateOne({ _id: storeId }, { $set: updatedStore });
        });
    }
}
exports.storeService = new StoreService();
