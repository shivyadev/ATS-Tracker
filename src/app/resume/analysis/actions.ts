import axios from "axios";

export const getFileUrl = async () => {
  const { data } = await axios.get("/api/resume/latest");
  const { fileName } = data;
  const fileUrl = process.env.NEXT_PUBLIC_AWS_FILE_URL + fileName;

  // Validate the URL before returning
  if (!fileUrl) {
    throw new Error("Invalid file URL");
  }

  return fileUrl;
};
