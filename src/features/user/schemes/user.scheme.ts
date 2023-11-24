import Joi, { ObjectSchema } from 'joi';

const userSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().optional().allow(null, '').min(2).max(100).messages({
    'string.base': 'email must be of type string',
    'string.min': 'invalid email',
    'string.max': 'invalid email',
    'string.email': 'invalid email'
  }),
  image: Joi.string().optional().allow(null, '')
});

const saveStoreSchema: ObjectSchema = Joi.object().keys({
  storeId: Joi.string().required().messages({
    'string.base': 'storeId must be a string',
    'string.empty': 'storeId is a required field'
  })
});

const likedProductSchema: ObjectSchema = Joi.object().keys({
  productId: Joi.string().required().messages({
    'string.base': 'productId must be a string',
    'string.empty': 'productId is a required field'
  })
});

const savePushTokenSchema: ObjectSchema = Joi.object().keys({
  pushToken: Joi.string().required().messages({
    'string.base': 'pushToken must be a string',
    'string.empty': 'pushToken is required'
  })
});

export { userSchema, saveStoreSchema, likedProductSchema, savePushTokenSchema };
