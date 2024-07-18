interface IProps {
  white?: boolean;
}

export const Splash = ({ white = false }: IProps) => {
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
      </div>
    </>
  );
};
