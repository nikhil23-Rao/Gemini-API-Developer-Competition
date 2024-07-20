import axios from "axios";

export const getFRQ = async (
  length: number,
  topic: string,
  style: string,
  chosenClass: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "frqprompt",
    { length, style, chosenClass, topic },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  return res.data;
  // setPossibleUnits(
  //   JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  // );
};
