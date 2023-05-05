import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().optional().allow(null, ''),
  userId: Joi.string().required(),
  storeId: Joi.string().required(),
  userName: Joi.string().required(),
  storeName: Joi.string().required(),
  body: Joi.string().optional().allow(null, ''),
  images: Joi.array().max(5).optional(),
  isRead: Joi.boolean().optional(),
  isReply: Joi.boolean().optional(),
  isOrder: Joi.boolean().optional(),
  orderId: Joi.string().optional(),
  reply: Joi.object().optional()
});

export { addChatSchema };
