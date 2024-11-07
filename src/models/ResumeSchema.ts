import { Schema, model, models } from "mongoose";

const resumeSchema = new Schema({
  userId: String,
  fileName: String,
  description: { type: String, default: "" },
  atsScore: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

const ResumeModel = models.Resume || model("Resume", resumeSchema);

export default ResumeModel;
