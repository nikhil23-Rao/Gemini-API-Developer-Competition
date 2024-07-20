import axios from "axios";

export const getMarketplaceSearchResults = async (
  array: any[],
  query: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "marketplace",
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
