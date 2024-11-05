import axios from "axios";
import pdfToText from "react-pdftotext";

export const getFileUrl = async () => {
  const { data } = await axios.get("/api/resume/latest");
  const { fileName } = data;
  const fileUrl = process.env.NEXT_PUBLIC_AWS_FILE_URL + fileName;

  if (!fileUrl) {
    throw new Error("Invalid file URL");
  }

  return fileUrl;
};

export const resumeScoring = async () => {
  try {
    const { data: pdfData } = await axios.get("/api/resume/latest");
    const { fileName, description } = pdfData;
    const fileUrl = process.env.NEXT_PUBLIC_AWS_FILE_URL + fileName;

    // Load the PDF document
    const response = await axios.get(fileUrl, { responseType: "blob" });
    const pdfBlob = response.data;

    const pdfText = await pdfToText(pdfBlob);

    const { data } = await axios.post("/api/resume/scoring", {
      resumeText: pdfText,
      jobDescription: description,
    });

    return data;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
  }
};
