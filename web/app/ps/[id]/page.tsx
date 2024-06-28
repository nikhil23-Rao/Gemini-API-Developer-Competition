import { Button } from "@mui/material";
import "../../globals.css";
export default function ProblemSetViewer({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="header">
          <a
            className="fa fa-home fa-2x"
            style={{
              color: "#fff",
              position: "absolute",
              top: 40,
              left: 40,
              zIndex: 1000000,
              fontSize: 22,
            }}
            href="/questiongenerate"
          >
            Back
          </a>
          <div
            className="inner-header flex"
            style={{ flexDirection: "column" }}
          >
            <h1
              style={{
                fontSize: "4vw",
                fontWeight: "bold",
                maxWidth: "80%",
              }}
            >
              AP Stats U1-8 MCQ Quiz
            </h1>
            <p style={{ marginTop: 30, color: "lightgray", maxWidth: "40%" }}>
              Description
            </p>
            <Button
              style={{ backgroundColor: "#fff", color: "#000", marginTop: 40 }}
            >
              Start Problem Set
            </Button>
          </div>
          <div>
            <svg
              className="waves"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shape-rendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="parallax">
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="0"
                  fill="rgba(255,255,255,0.7"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(255,255,255,0.5)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(255,255,255,0.3)"
                />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>

        <h1
          style={{
            marginTop: 40,
            fontWeight: "bold",
            fontSize: "2vw",
            color: "#000",
            textAlign: "center",
          }}
          className="text-gradient-black"
        >
          Discussion Thread
        </h1>
      </div>
    </>
  );
}
