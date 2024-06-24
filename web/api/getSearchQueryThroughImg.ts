import axios from "axios";

export const getSearchQueryThroughImg = async (image, chosenClass) => {
  const res = await axios.post(
    "http://localhost:3001/resourceimgquery",
    { image, chosenClass },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res.data.response);
  console.log(JSON.parse(JSON.stringify(res.data.response)));
  return JSON.parse(JSON.stringify(res.data.response));
};
