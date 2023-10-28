import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startTime: { type: Date },
  endTime: { type: Date },
  invitees: [{ type: String }],
});

export interface Event extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime: Date;
  invitees: string[];
}
