import Joi, { ObjectSchema } from 'joi';

const reviewSchema: ObjectSchema = Joi.object().keys({
  productId: Joi.string().required().messages({
    'string.base': 'productId must be of type string',
    'string.empty': 'productId is a required field'
  }),
  body: Joi.string().max(1000).messages({
    'string.base': 'body must be of type string',
    'string.max': 'invalid body length'
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    'number.base': 'rating must be of type number',
    'number.empty': 'rating is a required field',
    'number.min': 'invalid rating',
    'number.max': 'invalid rating'
  })
});

export { reviewSchema };
