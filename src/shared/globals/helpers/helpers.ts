import { IProductDocument } from '@product/interfaces/product.interface';
import { IOrderDocument } from '@order/interfaces/order.interface';
import { config } from '@root/config';
import { AuthUserPayload } from '@auth/interfaces/auth.interface';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import JWT from 'jsonwebtoken';

export class Helpers {
  static formatStoreLink(slug: string): string {
    return `${config.WEBSITE_URL}/store/${slug}`;
  }

  static generateUniqueSlug(input: string): string {
    const words = input.split(' ');
    const cleanedInput = words[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/\s/gi, '')
      .trim()
      .toLowerCase();
    const uniqueId = uuidv4().split('-')[0];
    const slug = `${cleanedInput.substring(0, 20)}-${uniqueId}`;
    return slug;
  }

  static cleanSlug(slug: string): string {
    const cleanedName = slug
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    return cleanedName;
  }

  static signToken(jwtPayload: object): string {
    return JWT.sign(jwtPayload, config.JWT_TOKEN!);
  }

  static parseToken(token: string): AuthUserPayload | null {
    try {
      const payload: AuthUserPayload = JWT.verify(token, config.JWT_TOKEN!) as AuthUserPayload;
      return payload;
    } catch (err) {
      return null;
    }
  }

  static getTokenFromHeader(req: Request): string | null {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

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
