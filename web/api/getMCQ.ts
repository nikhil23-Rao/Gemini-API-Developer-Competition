import axios from "axios";

export const getMCQ = async (
  length: number,
  topic: string,
  style: string,
  chosenClass: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    "http://localhost:3001/mcqprompt",
    { length, style, chosenClass, topic },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  return res.data.response;
  // setPossibleUnits(
  //   JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  // );
};
