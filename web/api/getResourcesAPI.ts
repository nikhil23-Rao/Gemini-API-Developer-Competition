import axios from "axios";

export const getResourcesAPI = async (query) => {
  const res = await axios.post(
    "http://localhost:3001/resourcefinder",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
};
