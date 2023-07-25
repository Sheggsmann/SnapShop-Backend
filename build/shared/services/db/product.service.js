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
        return (await product_model_1.ProductModel.find({}).skip(skip).limit(limit));
    }
    async getProductById(productId) {
        return await product_model_1.ProductModel.findOne({ _id: productId }).populate('store');
    }
    async getProductsByStoreId(storeId) {
        return await product_model_1.ProductModel.find({ store: storeId });
    }
    async updateProduct(productId, updatedProduct) {
        await product_model_1.ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
    }
}
exports.productService = new ProductService();
