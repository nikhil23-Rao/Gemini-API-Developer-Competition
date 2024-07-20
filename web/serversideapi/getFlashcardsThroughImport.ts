import axios from "axios";

export const getFlashcardsThroughImage = async (image: string) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "flashcardImage",
    { image },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  console.log(JSON.parse(res.data.response));

  return JSON.parse(res.data.response);
};
