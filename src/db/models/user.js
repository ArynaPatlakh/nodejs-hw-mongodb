import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwors: { type: String, required: true, unique: true, minlength: 6 },
  },
  { timestamps: true, versionKey: false },
);

export const UsersCollection = model('users', usersSchema);