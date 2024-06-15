import Lottie from "lottie-react";
import animation from "../../public/loadingspace.json";

export const ProcessingRequest = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <img
        src="/logo.png"
        style={{ position: "relative", bottom: 50, width: 40 }}
        alt=""
      />
      <Lottie animationData={animation} />
      <p
        style={{ fontSize: 20, fontWeight: "bold" }}
        className="text-gradient-black"
      >
        Processing request...
      </p>
    </div>
  );
};
