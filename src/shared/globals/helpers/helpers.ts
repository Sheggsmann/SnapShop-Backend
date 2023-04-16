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
}
