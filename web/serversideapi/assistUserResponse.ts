import axios from "axios";
export const assistUserResponse = async (old, message) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "assist",
    // "http://localhost:3001/assist",
    { old, message },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data.response;
};

export const assistUserResponseImg = async (img, details) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "assistimg",
    { img, details },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res.data);
  return res.data.response;
};
