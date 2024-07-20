import axios from "axios";

export const getFlashcardsByUnit = async (prompt: string) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "flashcards",
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  console.log(
    JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  );
  return JSON.parse(res.data.response.candidates[0].content.parts[0].text);
  // setPossibleUnits(
  //   JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  // );
};
