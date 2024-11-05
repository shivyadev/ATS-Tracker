import scoreResume from "@/lib/pythonBridge";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields: resumeText or jobDescription",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await scoreResume(resumeText, jobDescription);
    console.log(result);
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
