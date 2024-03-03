"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
const mongoose_1 = __importDefault(require("mongoose"));
class ProductService {
    async addProductToDB(product, storeId) {
        await product_model_1.ProductModel.create(product);
        await store_model_1.StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: 1 } });
    }
    async getProducts(skip, limit) {
        return (await product_model_1.ProductModel.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit));
    }
    async getProductsCount() {
        return await product_model_1.ProductModel.countDocuments({});
    }
    async getProductById(productId) {
        return await product_model_1.ProductModel.findOne({ _id: productId }).populate('store');
    }
    async getProductsByStoreId(storeId) {
        return await product_model_1.ProductModel.find({ store: storeId });
    }
    async getFrequentlyPurchasedProductsNearUser(location, limit) {
        const frequentlyPurchasedProducts = await store_model_1.StoreModel.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [location[0], location[1]] },
                    distanceField: 'distance',
                    maxDistance: 100000,
                    spherical: true
                }
            },
            {
                $lookup: {
                    from: 'Product',
                    localField: '_id',
                    foreignField: 'store',
                    pipeline: [{ $limit: 3 }],
                    as: 'products'
                }
            },
            { $unwind: '$products' },
            { $sort: { 'products.purchaseCount': -1 } },
            { $limit: limit },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    description: { $first: '$description' },
                    image: { $first: '$image' },
                    bgImage: { $first: '$bgImage' },
                    owner: { $first: '$owner' },
                    totalRatings: { $first: '$totalRatings' },
                    ratingsCount: { $first: '$ratingsCount' },
                    locations: { $first: '$locations' },
                    productCategories: { $first: '$productCategories' },
                    products: { $push: '$products' }
                }
            }
        ]);
        return frequentlyPurchasedProducts;
    }
    async getRandomProducts() {
        return [];
    }
    async getExploreProducts(blacklist, limit) {
        const products = await product_model_1.ProductModel.aggregate([
            {
                $match: {
                    $expr: {
                        $not: { $in: ['$_id', blacklist.map((id) => new mongoose_1.default.Types.ObjectId(id))] }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);
        return products;
    }
    async getNewArrivals() {
        return await product_model_1.ProductModel.find({}).sort({ createdAt: -1 }).limit(15);
    }
    async updateProduct(productId, updatedProduct) {
        await product_model_1.ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
    }
    async removeProductFromDB(productId, storeId) {
        await product_model_1.ProductModel.findByIdAndRemove(productId);
        await store_model_1.StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: -1 } });
    }
    async updateProductsPurchaseCount(products) {
        for (const product of products) {
            await product_model_1.ProductModel.updateOne({ _id: product.product._id }, { $inc: { purchaseCount: product.quantity } });
        }
    }
    async updateStoreProductsCategories(storeId, oldCategory, newCategory) {
        await product_model_1.ProductModel.updateMany({ store: storeId, category: oldCategory }, { $set: { category: newCategory } });
    }
}
exports.productService = new ProductService();
