import axios from "axios";

export const getFlashcardsByUnit = async (prompt: string) => {
  console.log(prompt);
  const res = await axios.post(
    "http://localhost:3001/flashcards",
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
