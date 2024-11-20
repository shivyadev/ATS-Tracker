import axios from "axios";

export const getJobDetails = async (title: string) => {
  try {
    const { data } = await axios.post("/api/jobs/search-by-title", {
      title: title, // Pass the title as expected in the request body
    });

    return data.jobs; // Return response data, not the full response object
  } catch (err) {
    console.log("Error in getJobDetails:", err);
    throw err; // Optionally rethrow or return a custom error message
  }
};

interface JobDetails {
  company: string;
  title: string;
  location: string;
  description: string;
  redirectUrl: string;
}

export const saveJobDetails = async (jobDetails: JobDetails) => {
  try {
    const { company, title, location, description, redirectUrl } = jobDetails;

    const { data } = await axios.post("/api/jobs/save", {
      company,
      title,
      location,
      description,
      redirectUrl,
    });

    if (data) return "Success";
    else throw new Error("Error occurred");
  } catch (err) {
    console.error(err);
  }
};
