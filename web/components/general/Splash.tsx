import { login } from "@/utils/signInWithGoogle";
import { useEffect, useState } from "react";

interface IProps {
  white?: boolean;
}

export const Splash = ({ white = false }: IProps) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 3000);
  }, []);
  return (
    <>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src={white ? "/whitelogo.png" : "logo.png"} width={200} alt="" />
        {show && (
          <>
            <h1>Trouble Connecting to Network</h1>{" "}
            <button style={{ padding: 20, marginTop: 30 }} onClick={login}>
              Retry Login
            </button>
          </>
        )}
      </div>
    </>
  );
};
