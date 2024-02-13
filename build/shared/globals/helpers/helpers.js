"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
const config_1 = require("../../../config");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Helpers {
    static formatStoreLink(slug) {
        return `${config_1.config.WEBSITE_URL}/stores/s/${slug}`;
    }
    static generateUniqueSlug(input) {
        const cleanedInput = input.replace(/\s/gi, '').trim().toLowerCase();
        const uniqueId = (0, uuid_1.v4)().split('-')[0];
        const slug = `${cleanedInput.substring(0, 4)}-${uniqueId}`;
        return slug;
    }
    static cleanSlug(slug) {
        const cleanedName = slug
            .replace(/[^\w\s]/gi, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');
        return cleanedName;
    }
    static signToken(jwtPayload) {
        return jsonwebtoken_1.default.sign(jwtPayload, config_1.config.JWT_TOKEN, { expiresIn: '7d' });
    }
    static parseToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.JWT_TOKEN);
            return payload;
        }
        catch (err) {
            return null;
        }
    }
    static getTokenFromHeader(req) {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
    static genrateRandomIntegers(len) {
        const characters = '0123456789';
        const charactersLength = characters.length;
        let result = '';
        for (let i = 0; i < len; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return parseInt(result, 10);
    }
    static generateOtp(len) {
        const numbers = '0123456789';
        let otp = '';
        for (let i = 0; i < len; i++) {
            otp += Math.floor(Math.random() * numbers.length);
        }
        return otp;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parseJson(prop) {
        try {
            return JSON.parse(prop);
        }
        catch (err) {
            return prop;
        }
    }
    static escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    static formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth()}/${date.getUTCDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
    static calculateServiceFee(totalPrice) {
        if (totalPrice >= 0 && totalPrice <= 50000)
            return Math.round(totalPrice * 0.04);
        if (totalPrice > 50000 && totalPrice <= 100000)
            return Math.round(totalPrice * 0.03);
        return 2000;
    }
    static calculateOrderTotal(order) {
        let total = order.products.reduce((acc, item) => (acc += item.product.price * item.quantity), 0);
        total += Helpers.calculateServiceFee(total);
        total += order?.deliveryFee || 0;
        return total;
    }
    static calculateOrderServiceFee(order) {
        const total = order.products.reduce((acc, item) => (acc += item.product.price * item.quantity), 0);
        return Helpers.calculateServiceFee(total);
    }
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const dlat = toRadians(lat2 - lat1);
        const dlon = toRadians(lon2 - lon1);
        const a = Math.sin(dlat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const radius = 6378.1;
        const distance = radius * c;
        return distance;
    }
}
exports.Helpers = Helpers;
