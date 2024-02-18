import Joi, { ObjectSchema } from 'joi';

const storeSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(100).messages({
    'string.base': 'name must be of type string',
    'string.min': 'invalid store name',
    'string.max': 'invalid store name',
    'string.empty': 'name is a required field'
  }),
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
  name: Joi.string().optional().allow(null, '').max(100).messages({
    'string.base': 'name must be of type string',
    'string.min': 'invalid store name',
    'string.max': 'invalid store name',
    'string.empty': 'name is a required field'
  }),
  image: Joi.string().optional().allow(null, ''),
  bgImage: Joi.string().optional().allow(null, ''),
  description: Joi.string().optional().max(1000).messages({
    'string.base': 'description must be of type string',
    'string.min': 'invalid store description',
    'string.max': 'invalid store description',
    'string.empty': 'description is a required field'
  }),
  email: Joi.string().email().optional().allow(null, '').min(2).max(100).messages({
    'string.base': 'email must be of type string',
    'string.min': 'invalid email',
    'string.max': 'invalid email',
    'string.email': 'invalid email'
  })
});

const storeLocationUpdateSchema: ObjectSchema = Joi.object().keys({
  latlng: Joi.string().required().messages({
    'any.required': 'latlng is a required field',
    'string.empty': 'latlng is not allowed to be empty'
  }),
  address: Joi.string().required().messages({
    'any.required': 'address is a required field',
    'string.empty': 'address is not allowed to be empty'
  })
});

const storeSlugSchema: ObjectSchema = Joi.object().keys({
  slug: Joi.string().required().min(5).max(20).messages({
    'any.required': 'slug is a required field',
    'string.empty': 'slug is a required field',
    'string.min': 'slug cannot be less than 5 characters',
    'string.max': 'slug cannot be more than 20 characters'
  })
});

const updateProductCategorySchema: ObjectSchema = Joi.object().keys({
  oldCategory: Joi.string().min(1).max(50).required(),
  newCategory: Joi.string().min(1).max(50).required()
});

export {
  storeSchema,
  storeUpdateSchema,
  storeLocationUpdateSchema,
  storeSlugSchema,
  updateProductCategorySchema
};
