import Joi, { ObjectSchema } from 'joi';

const mobileNumberSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.min': 'invalid number',
    'string.max': 'invalid number',
    'string.empty': 'mobile number is required'
  }),
  otpProvider: Joi.string().required().messages({
    'string.base': 'otp provider must be of type string',
    'string.empty': 'otp provider is required'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.min': 'invalid number',
    'string.max': 'invalid number',
    'string.empty': 'mobile number is required'
  }),
  password: Joi.string().min(4).max(20).messages({
    'string.base': 'password must be of type string',
    'string.min': 'invalid password',
    'string.max': 'invalid password',
    'string.empty': 'password is required'
  }),
  otp: Joi.string().length(4).required().messages({
    'string.base': 'otp must be of type string',
    'string.empty': 'otp is a required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'passwords should match',
    'any.required': 'confirm password is a required field'
  })
});

export { passwordSchema, mobileNumberSchema };
