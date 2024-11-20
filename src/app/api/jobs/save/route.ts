import { dbConnect } from "@/lib/db";
import JobsModel from "@/models/JobSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { company, title, location, description, redirectUrl } =
      await req.json();

    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized User");
    }

    const job = new JobsModel({
      userId: user.id,
      company,
      title,
      location,
      description,
      redirectUrl,
    });

    await job.save();

    return new Response("Job saved successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
