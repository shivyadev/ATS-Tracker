import { dbConnect } from "@/lib/db";
import JobsModel from "@/models/JobSchema";
import ResumeModel from "@/models/ResumeSchema";

export async function GET(): Promise<Response> {
  try {
    await dbConnect();

    await ResumeModel.deleteMany({});
    await JobsModel.deleteMany({});

    return new Response("DB connected", { status: 200 });
  } catch (err) {
    console.error("Error occurred", err);
    return new Response("Failed to connect to the database", { status: 500 });
  }
}
