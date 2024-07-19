import createData from "../../public/createData.json";
import Lottie from "lottie-react";

interface IProps {
  setModal: (i: boolean) => void;
  color: string;
}

export const None = ({ setModal, color }: IProps) => {
  return (
    <>
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Lottie
          animationData={createData}
          loop
          style={{ width: "15vw", marginTop: 30 }}
        />
        <p>No sets yet. Create one now!</p>
        <button
          className={`primary-effect ${
            color === ("white" || "black") ? "default" : color
          }`}
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
      </div>
    </>
  );
};
