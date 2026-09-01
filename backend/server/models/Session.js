import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    sourceText: { type: String, required: true },
    mode: { type: String, enum: ["flashcards", "quiz"], required: true },
    data: { type: Object, required: true }, // the validated { type, items } payload
  },
  { timestamps: true }
);

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
