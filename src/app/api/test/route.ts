import { dbConnect } from "@/lib/db";

export async function GET(request: Request): Promise<Response> {
  try {
    await dbConnect();
    return new Response("DB connected", { status: 200 });
  } catch (err) {
    console.error("Error occurred", err);
    return new Response("Failed to connect to the database", { status: 500 });
  }
}