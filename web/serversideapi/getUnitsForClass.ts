import axios from "axios";

export const getUnitsForClass = async (
  ap: string,
  setPossibleUnits: (i: any) => void,
) => {
  console.log(ap);
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "get-AP-unit",
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
