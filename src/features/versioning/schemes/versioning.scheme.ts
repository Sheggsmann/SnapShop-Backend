import Joi, { ObjectSchema } from 'joi';

const versioningSchema: ObjectSchema = Joi.object().keys({
  version: Joi.string().length(5).required().messages({
    'string.base': 'version must be of type string',
    'string.length': 'version must be exactly 5 characters long'
  }),
  forceUpdate: Joi.boolean().messages({
    'boolean.base': 'forceUpdate must be of type boolean'
  })
});

export { versioningSchema };
