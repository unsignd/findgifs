import { Schema, model } from 'mongoose';

const gifSchema = new Schema({
  name: [String],
  url: String,
  createdAt: Number,
  createdBy: [String],
  upvote: {
    type: Map,
    of: Number,
  },
  isVerified: Boolean,
});

export const Gif = model('gif', gifSchema);
