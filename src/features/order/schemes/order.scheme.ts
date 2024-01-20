import Joi, { ObjectSchema } from 'joi';

const productSchema: ObjectSchema = Joi.object({
  product: Joi.object().required(),
  quantity: Joi.number().integer().min(0).max(100).required()
});

const orderSchema: ObjectSchema = Joi.object().keys({
  products: Joi.array().items(productSchema).required().min(1).max(15).messages({
    'array.base': 'products must be an array',
    'array.min': 'invalid array length',
    'array.max': 'invalid array length',
    'array.empty': 'products is a required field'
  })
});

const updateOrderSchema: ObjectSchema = Joi.object().keys({
  deliveryFee: Joi.number().min(1).max(200000).messages({
    'number.base': 'deliveryFee should be a number',
    'number.min': 'deliveryFee should be greater than 1',
    'number.max': 'deliveryFee is too big'
  }),
  products: Joi.array().items(productSchema).min(1).max(50).messages({
    'array.base': 'please select one or more products',
    'array.min': 'no product selected',
    'array.max': 'too many products'
  })
});

const reportOrderSchema: ObjectSchema = Joi.object().keys({
  reason: Joi.string().min(1).max(1500).required().messages({
    'string.base': 'reason must be a string',
    'string.empty': 'reason cannot be empty'
  })
});

export { orderSchema, updateOrderSchema, reportOrderSchema };
