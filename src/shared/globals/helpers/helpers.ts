import { IProductDocument } from '@product/interfaces/product.interface';
import { IOrderDocument } from '@order/interfaces/order.interface';

export class Helpers {
  static genrateRandomIntegers(len: number): number {
    const characters = '0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return parseInt(result, 10);
  }

  static generateOtp(len: number): string {
    const numbers = '0123456789';
    let otp = '';
    for (let i = 0; i < len; i++) {
      otp += Math.floor(Math.random() * numbers.length);
    }
    return otp;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseJson(prop: string): any {
    try {
      return JSON.parse(prop);
    } catch (err) {
      return prop;
    }
  }

  static escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  static formatDate(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getUTCDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  static calculateServiceFee(totalPrice: number) {
    if (totalPrice >= 0 && totalPrice <= 50000) return Math.round(totalPrice * 0.04);
    if (totalPrice > 50000 && totalPrice <= 100000) return Math.round(totalPrice * 0.03);
    return 2000;
  }

  static calculateOrderTotal(order: IOrderDocument): number {
    let total = order.products.reduce(
      (acc, item) => (acc += (item.product as IProductDocument).price * item.quantity),
      0
    );

    total += Helpers.calculateServiceFee(total);
    total += order?.deliveryFee || 0;

    return total;
  }

  static calculateOrderServiceFee(order: IOrderDocument): number {
    const total = order.products.reduce(
      (acc, item) => (acc += (item.product as IProductDocument).price * item.quantity),
      0
    );
    return Helpers.calculateServiceFee(total);
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const radius = 6378.1;
    const distance = radius * c;

    return distance;
  }
}
