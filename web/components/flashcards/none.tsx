import createData from "../../public/createData.json";
import Lottie from "lottie-react";

interface IProps {
  setModal: (i: boolean) => void;
}

export const None = ({ setModal }: IProps) => {
  return (
    <>
      <Lottie
        animationData={createData}
        loop
        style={{ width: "33vw", marginTop: 30 }}
      />
      <button
        className={"primary-effect"}
        style={{
          width: 400,
          borderRadius: 200,
          marginTop: 50,
          marginBottom: 50,
          cursor: "pointer",
        }}
        onClick={() => setModal(true)}
      >
        <span
          style={{
            cursor: "pointer",
          }}
        >
          Create New Set
        </span>
      </button>
    </>
  );
};
