import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().trim().allow(''),
  }),
};

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value)
    ? value
    : helpers.error('any.invalid', { message: 'Invalid id format' });
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// -----------------------
// SHARED REMINDER SCHEMA
// -----------------------

const reminderSchema = Joi.object({
  enabled: Joi.boolean().default(false),

  dateTime: Joi.date()
    .iso()
    .allow(null)
    .when('enabled', {
      is: true,
      then: Joi.required().messages({
        'any.required': 'dateTime is required when reminder is enabled',
      }),
    }),

  repeatEveryDays: Joi.number().integer().min(1).allow(null),
}).default({});

// --------------------------------------
// CREATE NOTE
// --------------------------------------
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(''),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),

    reminder: reminderSchema,
  }),
};

// --------------------------------------
// UPDATE NOTE
// --------------------------------------
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),

  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),

    reminder: reminderSchema,
  }).min(1),
};
