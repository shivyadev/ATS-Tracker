import { getSignedURL } from "@/app/resume/upload/actions";
import { computeSHA256 } from "@/lib/crypto";
import { dbConnect } from "@/lib/db";
import ResumeModel from "@/models/ResumeSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized User");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const desc = formData.get("desc") as string;

    const signedURL = await getSignedURL({
      type: file.type,
      size: file.size,
      checksum: await computeSHA256(file),
    });

    const url = signedURL.success?.url;
    const fileKey = signedURL.success?.fileKey;

    await fetch(url!, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const resume = new ResumeModel({
      userId: user.id,
      fileName: fileKey,
      description: desc,
    });

    await resume.save();

    return new Response("File Saved Successfully", { status: 200 });
  } catch (err) {
    console.error("Error occurred", err);
    return new Response("Error occurred", { status: 500 });
  }
}
