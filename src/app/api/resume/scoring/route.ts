import ResumeModel from "@/models/ResumeSchema";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { fileName, resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields: resumeText or jobDescription",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: result } = await axios.post(
      `${process.env.FLASK_SERVER}/api/score_resume`,
      {
        resume_text: resumeText,
        job_description: jobDescription,
      }
    );
    console.log(result);

    const updatedResume = await ResumeModel.findOneAndUpdate(
      { fileName: fileName },
      { $set: { atsScore: Math.ceil(result?.final_score) } },
      { new: true, upsert: true } // Return the updated document, and create a new document if it doesn't exist
    );

    console.log(updatedResume);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Resume scoring error:", error);
    return new Response(
      JSON.stringify({
        message: "Error processing resume",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
