import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  _id: Joi.string().optional(),
  status: Joi.string().optional(),
  conversationId: Joi.string().optional().allow(null, ''),
  sender: Joi.string().required(),
  receiver: Joi.string().required(),
  senderType: Joi.string().valid('User', 'Store').required(),
  receiverType: Joi.string().valid('User', 'Store').required(),
  body: Joi.string().optional().allow(null, ''),
  images: Joi.array().max(5).optional(),
  isRead: Joi.boolean().optional(),
  isReply: Joi.boolean().optional(),
  isOrder: Joi.boolean().optional(),
  reply: Joi.object().optional(),
  order: Joi.object().optional(),
  createdAt: Joi.date().optional()
});

export { addChatSchema };
