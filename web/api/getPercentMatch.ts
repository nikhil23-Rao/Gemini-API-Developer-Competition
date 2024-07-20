import axios from "axios";

export const getPercentMatch = async (input: string, className: string) => {
  console.log(prompt);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "validation",
    { input, className },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  console.log(
    JSON.parse(
      res.data.response.candidates[0].content.parts[0].text.replace(
        /(\r\n|\n|\r)/gm,
        "",
      ),
    ),
  );
  return JSON.parse(
    (res.data.response.candidates[0].content.parts[0].text as string).replace(
      /(\r\n|\n|\r)/gm,
      "",
    ),
  );
  // setPossibleUnits(
  //   JSON.parse(res.data.response.candidates[0].content.parts[0].text),
  // );
};
