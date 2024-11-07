import { dbConnect } from "@/lib/db";
import ResumeModel from "@/models/ResumeSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ message: "Missing user" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resumes = await ResumeModel.find(
      { userId: user.id },
      { fileName: 1, atsScore: 1, submittedAt: 1, description: 1 }
    );

    console.log(resumes);

    return new Response(
      JSON.stringify({
        resumes,
        userName: user.firstName,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching resumes",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
