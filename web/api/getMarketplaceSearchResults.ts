import axios from "axios";

export const getMarketplaceSearchResults = async (
  array: any[],
  query: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    "http://localhost:3001/marketplace",
    { array, query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  return JSON.parse(res.data.response);
};
