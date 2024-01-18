import Joi, { ObjectSchema } from 'joi';

const versioningSchema: ObjectSchema = Joi.object().keys({
  version: Joi.string().min(5).max(10).required().messages({
    'string.base': 'version must be of type string',
    'string.min': 'version must be greater than 4 characters long',
    'string.max': 'version must be less than 10 characters long'
  }),
  forceUpdate: Joi.boolean().messages({
    'boolean.base': 'forceUpdate must be of type boolean'
  }),
  update: Joi.boolean().messages({
    'boolean.base': 'update must be of type boolean'
  }),
  app: Joi.string().required().messages({
    'string.base': 'version must be of type string'
  })
});

export { versioningSchema };
