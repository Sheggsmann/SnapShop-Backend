import Joi, { ObjectSchema } from 'joi';

const adminSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('Root', 'Manager', 'Service').required(),
  email: Joi.string().email().required().min(2).max(100)
});

export { adminSchema };
