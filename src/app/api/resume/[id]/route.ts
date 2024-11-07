import { dbConnect } from "@/lib/db";
import ResumeModel from "@/models/ResumeSchema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; // Import NextResponse for JSON response

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized User");

    const { id } = params;

    const data = await ResumeModel.findOne({ fileName: id });

    if (!data) throw new Error("Value not found");

    return NextResponse.json(data); // Use NextResponse for JSON response
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
