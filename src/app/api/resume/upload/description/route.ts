import { dbConnect } from "@/lib/db";
import ResumeModel from "@/models/ResumeSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized User");

    const { desc } = await request.json(); // Parse the JSON body

    const resume = await ResumeModel.findOne({ userId: user.id })
      .sort({ submittedAt: -1 })
      .exec();

    if (!resume) {
      return new Response("No resume found", { status: 404 });
    }

    const updatedResume = await ResumeModel.findOneAndUpdate(
      { _id: resume._id }, // Update the most recent resume
      {
        $set: {
          ...resume.toObject(),
          description: desc,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return new Response(JSON.stringify(updatedResume), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
