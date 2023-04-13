import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.min': 'invalid number',
    'string.max': 'invalid number',
    'string.empty': 'mobile number is required'
  }),
  password: Joi.string().min(4).max(10).messages({
    'string.base': 'password must be of type string',
    'string.min': 'invalid password',
    'string.max': 'invalid password',
    'string.empty': 'password is required'
  }),
  firstname: Joi.string().required().messages({
    'string.base': 'Firstname is required',
    'string.empty': 'first name is required'
  }),
  lastname: Joi.string().required().messages({
    'string.base': '',
    'string.empty': 'last name is required'
  }),
  otpProvider: Joi.string().required().messages({
    'string.base': 'otp provider must be of type string',
    'string.empty': 'otp provider is required'
  })
});

const verifyAccountSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.empty': 'mobile number is required'
  }),
  otp: Joi.string().required().length(4).messages({
    'string.base': 'otp must be of type string',
    'string.empty': 'otp is required'
  })
});

const resendOtpSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.empty': 'mobile number is required'
  }),
  otpProvider: Joi.string().required().messages({
    'string.base': 'otp provider must be of type string',
    'string.empty': 'otp provider is required'
  })
});

export { signupSchema, resendOtpSchema, verifyAccountSchema };
