import { dbConnect } from "@/lib/db";
import ResumeModel from "@/models/ResumeSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized User");

    const data = await ResumeModel.findOne({ userId: user.id })
      .sort({ submittedAt: -1 })
      .exec();

    if (!data) throw new Error("Value not found");

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}
