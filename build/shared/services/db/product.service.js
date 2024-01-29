"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
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
}
exports.productService = new ProductService();
