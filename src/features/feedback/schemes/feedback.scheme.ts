import Joi, { ObjectSchema } from 'joi';

const addFeedbackSchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(700).required()
});

export { addFeedbackSchema };
