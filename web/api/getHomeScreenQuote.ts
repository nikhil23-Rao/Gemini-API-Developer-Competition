import axios from "axios";

export const getHomeScreenQuote = async () => {
  let ye = process.env.NEXT_QUOTE_API_KEY as string;
  console.log(ye);
  const { data } = await axios.get(
    "https://api.api-ninjas.com/v1/quotes?category=knowledge",
  );
  console.log(data);
  return data;
  // setPossibleUnits(
  //   JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  // );
};
