import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.length': 'invalid number',
    'string.empty': 'mobile number is required'
  }),
  password: Joi.string().min(4).max(100).messages({
    'string.base': 'password must be of type string',
    'string.min': 'invalid password',
    'string.max': 'invalid password',
    'string.empty': 'password is required'
  }),
  firstname: Joi.string().required().messages({
    'string.base': 'Firstname must be of type string',
    'string.empty': 'first name is required'
  }),
  lastname: Joi.string().required().messages({
    'string.base': 'Lastname must be of type string',
    'string.empty': 'last name is required'
  }),
  source: Joi.string().required().max(100).messages({
    'string.base': 'Source is required',
    'string.empty': 'source is required',
    'string.max': 'source must be less than 100 characters long'
  }),
  otpProvider: Joi.string().required().messages({
    'string.base': 'otp provider must be of type string',
    'string.empty': 'otp provider is required'
  }),
  app: Joi.string().optional().valid('merchant').messages({
    'string.base': 'app must be of type string'
  }),
  lat: Joi.number().optional(),
  lng: Joi.number().optional()
});

const verifyAccountSchema: ObjectSchema = Joi.object().keys({
  mobileNumber: Joi.string().required().length(14).messages({
    'string.base': 'mobile number must be of type string',
    'string.length': 'invalid mobile number',
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
    'string.length': 'invalid mobile number',
    'string.empty': 'mobile number is required'
  }),
  otpProvider: Joi.string().required().messages({
    'string.base': 'otp provider must be of type string',
    'string.empty': 'otp provider is required'
  })
});

export { signupSchema, resendOtpSchema, verifyAccountSchema };
