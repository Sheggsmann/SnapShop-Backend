import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';
import client, { Twilio } from 'twilio';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;
  public TWILIO_SID: string | undefined;
  public TWILIO_AUTH_TOKEN: string | undefined;
  public TWILIO_NUMBER: string | undefined;
  public TWILIO_WHATSAPP: string | undefined;

  private readonly DEFAULT_DATABSE_URL = 'mongodb://localhost:27017/snapshop-backend';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABSE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || 'promisehasarandomjwttoken';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || '';
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
    this.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
    this.TWILIO_SID = process.env.TWILIO_SID || '';
    this.TWILIO_NUMBER = process.env.TWILIO_NUMBER || '';
    this.TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP || '';
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
      cloud_name: config.CLOUDINARY_NAME
    });
  }

  public twilioConfig(): Twilio {
    return client(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
}

export const config: Config = new Config();
