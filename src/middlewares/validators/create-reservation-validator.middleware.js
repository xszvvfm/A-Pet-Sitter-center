import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  sitterId: Joi.number().required().messages({
    'any.required': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.REQUIRED,
    'number.base': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.NUMBER_BASE,
    'number.integer': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.INTEGER,
  }),
  date: Joi.date().required().messages({
    'any.required': MESSAGES.RESERVATIONS.COMMON.DATE.REQUIRED,
    'date.base': MESSAGES.RESERVATIONS.COMMON.DATE.DATE_BASE,
  }),
  service: Joi.string().required().messages({
    'any.required': MESSAGES.RESERVATIONS.COMMON.SERVICE.REQUIRED,
  }),
});

export const createReservationValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
