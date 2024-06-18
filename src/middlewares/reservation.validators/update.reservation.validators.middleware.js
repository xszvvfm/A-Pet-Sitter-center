import Joi from 'joi';
// import { MESSAGES } from '../../constants/messages.const.js';

const schema = Joi.object({
  sitter_id: Joi.number(),
  date: Joi.string(),
  service: Joi.string(),
})
  .min(1)
  .messages({ 'object.min': '하나는 입력해주세요' });

export const updateReservationValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

// sitter_id: Joi.number()
//     .required()
//     .messages({
//       number: MESSAGES.PESITTER.IS_NOT_NUMBER,
//       'any.required': MESSAGES.PESITTER.REQUIRED,
//     }),
