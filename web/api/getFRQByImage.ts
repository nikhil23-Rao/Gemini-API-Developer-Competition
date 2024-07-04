import axios from "axios";

export const getFRQByImage = async (
  length: number,
  image: string,
  chosenClass: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    "http://localhost:3001/frqimage",
    { length, chosenClass, image },
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
