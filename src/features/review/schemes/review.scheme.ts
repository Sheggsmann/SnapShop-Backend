import Joi, { ObjectSchema } from 'joi';

const reviewSchema: ObjectSchema = Joi.object().keys({
  productId: Joi.string().messages({
    'string.base': 'productId must be of type string'
  }),
  storeId: Joi.string()
    .when('productId', {
      is: Joi.string().required(),
      then: Joi.optional(),
      otherwise: Joi.string().optional()
    })
    .messages({
      'any.required': 'storeId is a required field',
      'string.base': 'storeId must be of type string',
      'string.empty': 'storeId is a required field'
    }),
  body: Joi.string().optional().max(1000).messages({
    'string.base': 'body must be of type string',
    'string.max': 'invalid body length'
  }),
  type: Joi.string().allow('store', 'product').required().messages({
    'string.empty': 'type is a required field and must be one of (store) or (product)',
    'any.required': 'type is a required field and must be one of (store) or (product)'
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    'number.base': 'rating must be of type number',
    'number.empty': 'rating is a required field',
    'number.min': 'invalid rating',
    'number.max': 'invalid rating'
  })
});

export { reviewSchema };
