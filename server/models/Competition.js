// models/Competition.js
import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["WIECODES_WEEKEND", "SPECIAL"],
      default: "SPECIAL",
      required: true
    },
    name: { type: String, required: true },
    description: String,
    challenge_question: String,
    requirements: String,
    notes: String,
  info: String,
    prize: String,
    prizeLimit: String,
    rules: String,
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    visibility_type: {
      type: String,
      enum: ["public", "custom"],
      default: "public",
    },
    join_code: String, // only for custom competitions

    // ✅ Store numbers
    competitionNumber: { type: Number, required: true, unique: true }, // Overall #*** number
    wiecodesWeekendNumber: { type: Number }, // Only for WIECODES_WEEKEND: WW*** number

    // ✅ Store participants
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✅ Store templates
    templates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Template" }],

    // ✅ Store winners in order
    winners: [
      {
        position: { type: Number, required: true }, // 1 = first, 2 = second, etc.
        template: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
        // ✅ Published status
        published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Competition", competitionSchema);
