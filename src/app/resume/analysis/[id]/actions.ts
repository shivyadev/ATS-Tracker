import axios from "axios";
import pdfToText from "react-pdftotext";

export const getFileUrl = async (id: string) => {
  const { data } = await axios.get(`/api/resume/${id}`);
  const { fileName, description } = data;
  const fileUrl = process.env.NEXT_PUBLIC_AWS_FILE_URL + fileName;

  if (!fileUrl) {
    throw new Error("Invalid file URL");
  }

  return { fileUrl, description };
};

export const resumeScoring = async (id: string) => {
  try {
    const { data: pdfData } = await axios.get(`/api/resume/${id}`);
    const { fileName, description } = pdfData;
    const fileUrl = process.env.NEXT_PUBLIC_AWS_FILE_URL + fileName;

    // Load the PDF document
    const response = await axios.get(fileUrl, { responseType: "blob" });
    const pdfBlob = response.data;

    const pdfText = await pdfToText(pdfBlob);

    const { data } = await axios.post("/api/resume/scoring", {
      fileName: id,
      resumeText: pdfText,
      jobDescription: description,
    });

    return data;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
  }
};

export const getJobDetails = async (resumeSkills: Record<string, string[]>) => {
  let combinedSkills = "";

  Object.keys(resumeSkills).map((key, idx) => {
    resumeSkills[key].map((skill, _) => {
      combinedSkills += skill + " ";
    });
  });

  const { data } = await axios.post("/api/jobs/search-by-keywords", {
    skills: combinedSkills,
  });

  return { data: data.jobs, skills: combinedSkills };
};
