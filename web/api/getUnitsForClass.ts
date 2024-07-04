import axios from "axios";

export const getUnitsForClass = async (
  ap: string,
  setPossibleUnits: (i: any) => void,
) => {
  console.log(ap);
  const res = await axios.post(
    "http://localhost:3001/get-AP-unit",
    { ap },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(res);

  console.log(JSON.parse(res.data.response));
  setPossibleUnits(JSON.parse(res.data.response));
};
