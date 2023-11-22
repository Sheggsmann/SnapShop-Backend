"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
class Helpers {
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
    static calculateServiceFee(totalPrice) {
        if (totalPrice >= 0 && totalPrice <= 50000) {
            return Math.round(totalPrice * 0.04);
        }
        else if (totalPrice > 50000 && totalPrice <= 100000) {
            return Math.round(totalPrice * 0.03);
        }
        else {
            return Math.round(totalPrice * 0.02);
        }
    }
}
exports.Helpers = Helpers;
