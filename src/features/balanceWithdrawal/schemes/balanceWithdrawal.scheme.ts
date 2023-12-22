import Joi, { ObjectSchema } from 'joi';

const balanceWithdrawalSchema: ObjectSchema = Joi.object().keys({
  amount: Joi.number().required().min(1000).max(1000000).messages({
    'number.base': 'amount must be of type number',
    'number.min': 'amount too little to withdraw',
    'number.max': 'amount too large to withdraw'
  }),
  bankName: Joi.string().required().messages({
    'string.base': 'bank name must be of type string',
    'string.empty': 'bank name is a required field'
  }),
  accountName: Joi.string().required().messages({
    'string.base': 'account name must be of type string',
    'string.empty': 'account name is a required field'
  }),
  accountNumber: Joi.string().required().messages({
    'string.base': 'account number should be characters',
    'string.empty': 'account number is a required field'
  })
});

export { balanceWithdrawalSchema };
