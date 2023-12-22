import Joi, { ObjectSchema } from 'joi';

const orderSchema: ObjectSchema = Joi.object().keys({
  products: Joi.array().required().min(1).max(15).messages({
    'array.base': 'products must be an array',
    'array.min': 'invalid array length',
    'array.max': 'invalid array length',
    'array.empty': 'products is a required field'
  })
});

const updateOrderSchema: ObjectSchema = Joi.object().keys({});

const reportOrderSchema: ObjectSchema = Joi.object().keys({
  reason: Joi.string().min(1).max(1500).required().messages({
    'string.base': 'reason must be a string',
    'string.empty': 'reason cannot be empty'
  })
});

export { orderSchema, updateOrderSchema, reportOrderSchema };
