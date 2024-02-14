"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
const user_interface_1 = require("../../../features/user/interfaces/user.interface");
const user_model_1 = require("../../../features/user/models/user.model");
const mongoose_1 = require("mongoose");
const helpers_1 = require("../../globals/helpers/helpers");
class StoreService {
    async addStoreToDB(userId, store) {
        const createdStore = store_model_1.StoreModel.create(store);
        const user = user_model_1.UserModel.updateOne({ _id: userId }, { $inc: { storeCount: 1 }, $push: { roles: user_interface_1.Role.StoreOwner } });
        await Promise.all([createdStore, user]);
    }
    async getStores(skip, limit) {
        const stores = await store_model_1.StoreModel.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return stores;
    }
    async getStoresCount() {
        return await store_model_1.StoreModel.countDocuments({});
    }
    async getStoreByName(name) {
        return (await store_model_1.StoreModel.findOne({ name }).select('name image verified'));
    }
    async getStoreByUserId(userId) {
        return await store_model_1.StoreModel.findOne({ owner: userId });
    }
    async getStoreByStoreId(storeId) {
        return await store_model_1.StoreModel.findOne({ _id: storeId });
    }
    async getNearbyStores(searchParam, latitude, longitude, radius) {
        searchParam = helpers_1.Helpers.escapeRegExp(`${searchParam}`);
        const products = await product_model_1.ProductModel.aggregate([
            {
                $search: {
                    index: 'searchProducts',
                    compound: {
                        should: [
                            {
                                text: {
                                    query: searchParam,
                                    path: 'name',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                    score: { boost: { value: 100 } }
                                }
                            },
                            {
                                text: {
                                    query: searchParam,
                                    path: 'tags',
                                    fuzzy: { maxEdits: 1, prefixLength: 1 },
                                    score: { boost: { value: 400 } }
                                }
                            },
                            {
                                text: {
                                    query: searchParam,
                                    path: 'description',
                                    fuzzy: { maxEdits: 1 },
                                    score: { boost: { value: 100 } }
                                }
                            }
                        ]
                    }
                }
            },
            { $limit: 50 },
            {
                $lookup: {
                    from: 'Store',
                    localField: 'store',
                    foreignField: '_id',
                    as: 'store'
                }
            },
            { $unwind: '$store' },
            {
                $match: {
                    'store.locations.location': { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    store: 1,
                    price: 1,
                    priceDiscount: 1,
                    quantity: 1,
                    images: 1,
                    videos: 1,
                    tags: 1,
                    productsCount: 1,
                    score: { $meta: 'searchScore' }
                }
            }
        ]);
        const productsWithDistance = products.map((product) => {
            const storeLocation = product.store.locations[0].location.coordinates;
            const distance = helpers_1.Helpers.calculateDistance(latitude, longitude, storeLocation[1], storeLocation[0]);
            return {
                ...product,
                distance: distance.toFixed(2)
            };
        });
        return productsWithDistance;
    }
    async getStoreProductsByCategory(storeId) {
        const products = await product_model_1.ProductModel.aggregate([
            { $match: { store: new mongoose_1.Types.ObjectId(storeId) } },
            { $group: { _id: '$category', products: { $push: '$$ROOT' } } }
        ]);
        return products;
    }
    async getClosestStores(location, limit) {
        let closestStores = [];
        // closestStores = await StoreModel.aggregate([
        //   {
        //     $geoNear: {
        //       near: {
        //         type: 'Point',
        //         coordinates: [location[0], location[1]]
        //       },
        //       distanceField: 'distance',
        //       spherical: true,
        //       maxDistance: 100000 // Maximum distance in meter
        //     }
        //   },
        //   { $limit: limit }
        // ]);
        closestStores = await store_model_1.StoreModel.find({
            _id: {
                $in: [
                    '65c38942a24acaa08606f879',
                    '65cb9319a5eed00296967e83',
                    '65bb88cd77df69b429c17179',
                    '65c33804a24acaa08606f62d',
                    '65bf8dc3a24acaa08606e358',
                    '65b664ab89662250a9da2899',
                    '656da469676d4e7bbc5b3152',
                    '65bba66677df69b429c171bd',
                    '65a824ba3b58d98511079fe4',
                    '65b4eb8d89662250a9da1fa4'
                ]
            }
        });
        return closestStores;
    }
    async updateStore(storeId, updatedStore) {
        await store_model_1.StoreModel.updateOne({ _id: storeId }, { $set: updatedStore });
    }
    async updateStoreEscrowBalance(storeId, balance) {
        if (Number(balance) > 0) {
            await store_model_1.StoreModel.updateOne({ _id: storeId }, { $inc: { escrowBalance: Number(balance) } });
        }
    }
    async saveStoreSlug(storeId, slug) {
        await store_model_1.StoreModel.updateOne({ _id: storeId }, { $set: { slug } });
    }
    async getStoreBySlug(slug) {
        return await store_model_1.StoreModel.findOne({ slug });
    }
}
exports.storeService = new StoreService();
