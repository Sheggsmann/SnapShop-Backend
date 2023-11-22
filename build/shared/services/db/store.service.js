"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
const user_interface_1 = require("../../../features/user/interfaces/user.interface");
const user_model_1 = require("../../../features/user/models/user.model");
const mongodb_1 = require("mongodb");
class StoreService {
    async addStoreToDB(userId, store) {
        const createdStore = store_model_1.StoreModel.create(store);
        const user = user_model_1.UserModel.updateOne({ _id: userId }, { $inc: { storeCount: 1 }, $push: { roles: user_interface_1.Role.StoreOwner } });
        await Promise.all([createdStore, user]);
    }
    async getStores(skip, limit) {
        const stores = await store_model_1.StoreModel.find({}).skip(skip).limit(limit);
        return stores;
    }
    async getStoreByName(name) {
        return await store_model_1.StoreModel.findOne({ name });
    }
    async getStoreByUserId(userId) {
        return await store_model_1.StoreModel.findOne({ owner: userId });
    }
    async getStoreByStoreId(storeId) {
        return await store_model_1.StoreModel.findOne({ _id: storeId });
    }
    async getNearbyStores(searchParam, latitude, longitude, radius, minPrice, maxPrice) {
        const products = await product_model_1.ProductModel.aggregate([
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
    }
    async getStoreProductsByCategory(storeId) {
        const products = await product_model_1.ProductModel.aggregate([
            { $match: { store: new mongodb_1.ObjectId(storeId) } },
            { $group: { _id: '$category', products: { $push: '$$ROOT' } } }
        ]);
        return products;
    }
    async getClosestStores(location, limit) {
        const closestStores = await store_model_1.StoreModel.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [location[0], location[1]]
                    },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 100000 // Maximum distance in meter
                }
            },
            { $limit: limit }
        ]);
        return closestStores;
    }
    async updateStore(storeId, updatedStore) {
        await store_model_1.StoreModel.updateOne({ _id: storeId }, { $set: updatedStore });
    }
    async updateStoreEscrowBalance(storeId, balance) {
        if (Number(balance) > 0) {
            await store_model_1.StoreModel.updateOne({ _id: storeId }, { $set: { escrowBalance: Number(balance) } });
        }
    }
}
exports.storeService = new StoreService();
