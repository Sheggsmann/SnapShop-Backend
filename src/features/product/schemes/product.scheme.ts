import Joi, { ObjectSchema } from 'joi';

const productSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(100).messages({
    'string.base': 'name must be of type string',
    'string.min': 'invalid name length',
    'string.max': 'invalid name length',
    'string.empty': 'name is a required field'
  }),
  description: Joi.string().required().min(5).max(1000).messages({
    'string.base': 'description must be of type string',
    'string.min': 'invalid description length',
    'string.max': 'invalid description length',
    'string.empty': 'description is a required field'
  }),
  price: Joi.number().required().min(1).messages({
    'number.base': 'price must be of type number',
    'number.min': 'price should be greater than 1'
  }),
  images: Joi.array().min(1).max(5).messages({
    'array.base': 'images must be of type array',
    'array.min': 'invalid array length',
    'array.max': 'invalid array length'
  }),
  category: Joi.string().required().messages({
    'string.base': 'category must be of type string',
    'string.empty': 'category is a required field'
  }),
  priceDiscount: Joi.number().optional().allow(null, 0),
  quantity: Joi.number().optional().allow(null, 0),
  video: Joi.array().max(1).optional()
});

export { productSchema };