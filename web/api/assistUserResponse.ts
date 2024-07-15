import axios from "axios";
export const assistUserResponse = async (old, message) => {
  const res = await axios.post(
    "http://localhost:3001/assist",
    { old, message },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data.response;
};
