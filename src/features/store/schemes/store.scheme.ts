import Joi, { ObjectSchema } from 'joi';

const storeSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(100).messages({
    'string.base': 'name must be of type string',
    'string.min': 'invalid store name',
    'string.max': 'invalid store name',
    'string.empty': 'name is a required field'
  }),
  image: Joi.string().required().messages({
    'any.required': 'image is a required field',
    'string.empty': 'image is not allowed to be empty'
  }),
  bgImage: Joi.string().optional().allow(null, ''),
  description: Joi.string().required().min(2).max(1000).messages({
    'string.base': 'description must be of type string',
    'string.min': 'invalid store description',
    'string.max': 'invalid store description',
    'string.empty': 'description is a required field'
  }),
  address: Joi.string().min(1).max(200).messages({
    'string.base': 'address must be of type string',
    'string.min': 'invalid store address',
    'string.max': 'invalid store address',
    'string.empty': 'address is a required field'
  }),
  latlng: Joi.string().required().messages({
    'any.required': 'latlng is a required field',
    'string.empty': 'latlng is not allowed to be empty'
  })
});

const storeUpdateSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(100).messages({
    'string.base': 'name must be of type string',
    'string.min': 'invalid store name',
    'string.max': 'invalid store name',
    'string.empty': 'name is a required field'
  }),
  image: Joi.string().optional().allow(null, ''),
  bgImage: Joi.string().optional().allow(null, ''),
  description: Joi.string().required().min(2).max(1000).messages({
    'string.base': 'description must be of type string',
    'string.min': 'invalid store description',
    'string.max': 'invalid store description',
    'string.empty': 'description is a required field'
  })
});

export { storeSchema, storeUpdateSchema };
