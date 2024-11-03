import { Schema, model, models } from "mongoose";

const resumeSchema = new Schema({
  userId: String,
  fileName: String,
  description: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
});

const ResumeModel = models.Resume || model("Resume", resumeSchema);

export default ResumeModel;
