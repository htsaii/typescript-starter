import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  events: [{ type: String }],
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  events: string[];
}
