import axios from "axios";
export const getDashboardDetails = async () => {
  const { data } = await axios.get("/api/dashboard");
  return data;
};
