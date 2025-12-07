import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const reminderSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    dateTime: {
      type: Date,
      default: null,
    },
    repeatEveryDays: {
      type: Number,
      min: 1,
      default: null,
    },
    lastTriggered: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      enum: [...TAGS],
      default: 'Todo',
    },

    reminder: {
      type: reminderSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

noteSchema.index(
  {
    title: 'text',
    content: 'text',
  },
  {
    name: 'NoteTextIndex',
    weights: {
      title: 5,
      content: 1,
    },
    default_language: 'english',
  },
);

export const Note = model('Note', noteSchema);
