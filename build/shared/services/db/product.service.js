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
exports.productService = void 0;
const product_model_1 = require("../../../features/product/models/product.model");
const store_model_1 = require("../../../features/store/models/store.model");
class ProductService {
    addProductToDB(product, storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield product_model_1.ProductModel.create(product);
            yield store_model_1.StoreModel.updateOne({ _id: storeId }, { $inc: { productsCount: 1 } });
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.ProductModel.findOne({ _id: productId }).populate('store');
        });
    }
    updateProduct(productId, updatedProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            yield product_model_1.ProductModel.updateOne({ _id: productId }, { $set: updatedProduct });
        });
    }
}
exports.productService = new ProductService();
