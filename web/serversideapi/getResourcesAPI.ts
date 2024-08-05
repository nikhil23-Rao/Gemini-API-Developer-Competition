import axios from "axios";

export const getResourcesAPI = async (query) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "resourcefinder/",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
};
