import axios from "axios";

export const getAnswerKey = async (query) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "answerkey",
    // "http://localhost:3001/answerkey",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res.data);
  return res.data.response;
};
