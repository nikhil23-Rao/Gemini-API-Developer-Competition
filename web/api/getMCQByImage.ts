import axios from "axios";

export const getMCQByImage = async (
  length: number,
  image: string,
  style: string,
  chosenClass: string,
) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "mcqimage",
    { length, style, chosenClass, image },
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
