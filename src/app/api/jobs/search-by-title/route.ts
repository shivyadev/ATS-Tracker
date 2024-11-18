import axios from "axios";

export async function POST(req: Request) {
  const BASE_URL = process.env.ADZUNA_BASE_URL;
  const BASE_PARAMS = process.env.ADZUNA_BASE_PARAMS;
  const APP_ID = process.env.ADZUNA_APP_ID;
  const API_KEY = process.env.ADZUNA_API_KEY;

  try {
    const { title } = await req.json();
    const country = "in";

    if (!title) {
      throw new Error("Title undefined");
    }

    const targetURL = `${BASE_URL}/${country.toLowerCase()}/${BASE_PARAMS}&results_per_page=50&app_id=${APP_ID}&app_key=${API_KEY}&what_or=${title}`;

    const response = await axios.get(targetURL); // Use the dynamic URL

    if (!response || !response.data) {
      return new Response("Data not found", { status: 400 });
    }

    const { data } = response;

    return Response.json({ jobs: data?.results }, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ msg: "Error Occurred", error: err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
