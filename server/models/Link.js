import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'facebook'],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model('Link', linkSchema);
