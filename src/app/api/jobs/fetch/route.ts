import { dbConnect } from "@/lib/db";
import JobsModel from "@/models/JobSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized User");
    }

    const jobs = await JobsModel.find({ userId: user.id })
      .sort({ submittedAt: -1 })
      .exec();

    if (!jobs) {
      throw new Error("Unable to find data");
    }

    return Response.json(jobs, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error Occurred", { status: 500 });
  }
}
