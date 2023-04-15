import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.length': 'invalid mobile number',
    'string.empty': 'mobile number is a required field'
  }),
  password: Joi.string().required().min(4).max(20).messages({
    'string.base': 'password must be of type string',
    'string.min': 'invalid password',
    'string.max': 'invalid password',
    'string.empty': 'password is a required field'
  })
});

export { loginSchema };
