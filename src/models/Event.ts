import mongoose, { Schema, Document } from "mongoose";

export type Importance = "normal" | "important" | "critical";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  importance: Importance;
  user: mongoose.Types.ObjectId; // Reference to the User model
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  importance: {
    type: String,
    enum: ["normal", "important", "critical"],
    default: "normal",
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IEvent>("Event", EventSchema);
