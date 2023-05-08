import Joi, { ObjectSchema } from 'joi';

const userSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().min(2).max(100).messages({
    'string.base': 'email must be of type string',
    'string.min': 'invalid email',
    'string.max': 'invalid email',
    'string.email': 'invalid email',
    'string.empty': 'email is a required field'
  }),
  image: Joi.string().optional().allow(null, '')
});

export { userSchema };
