import { Schema, model, models } from "mongoose";

const jobsSchema = new Schema({
  userId: String,
  company: String,
  title: String,
  location: String,
  description: String,
  redirectUrl: String,
  submittedAt: { type: Date, default: Date.now() },
});

const JobsModel = models.Jobs || model("Jobs", jobsSchema);

export default JobsModel;
