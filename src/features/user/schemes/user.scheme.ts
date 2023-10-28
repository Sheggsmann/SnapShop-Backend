import Joi, { ObjectSchema } from 'joi';

const userSchema: ObjectSchema = Joi.object().keys({
<<<<<<< HEAD
  email: Joi.string().email().min(2).max(100).optional().allow(null, '').messages({
=======
  email: Joi.string().email().optional().allow(null, '').min(2).max(100).messages({
>>>>>>> features/chat-feature
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

export { userSchema, saveStoreSchema, likedProductSchema };
