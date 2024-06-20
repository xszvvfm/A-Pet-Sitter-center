import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  sitterId: Joi.number().required().messages({
    'any.required': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.REQUIRED,
    'number.base': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.NUMBER_BASE,
    'number.integer': MESSAGES.RESERVATIONS.COMMON.SITTER_ID.INTEGER,
  }),
  date: Joi.date().iso().greater('now').required().messages({
    'any.required': MESSAGES.RESERVATIONS.COMMON.DATE.REQUIRED,
    'date.base': MESSAGES.RESERVATIONS.COMMON.DATE.DATE_BASE,
    'date.format': MESSAGES.RESERVATIONS.COMMON.DATE.INVALID_DATE,
    'date.greater': MESSAGES.RESERVATIONS.CREATE.INVALID_DATE,
  }),
  service: Joi.string()
    .valid('PET_WALKING', 'PET_CARE', 'PET_GROOMING')
    .required()
    .messages({
      'any.required': MESSAGES.RESERVATIONS.COMMON.SERVICE.REQUIRED,
      'any.only': MESSAGES.RESERVATIONS.COMMON.SERVICE.INVALID_SERVICE_TYPE,
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
