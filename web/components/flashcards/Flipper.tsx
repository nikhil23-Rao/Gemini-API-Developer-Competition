import { Flashcard } from "@/types/flashcard/Flashcard";
import "react-responsive-modal/styles.css";
import { Button } from "@mui/material";
import ProgressBar from "@ramonak/react-progress-bar";
import ReactCardFlip from "react-card-flip";
import Modal from "react-responsive-modal";
import "font-awesome/css/font-awesome.css";

interface IProps {
  progressView: number;
  cardFlipped: boolean;
  setCardFlipped: (i: boolean) => void;
  currentCardInView: Flashcard;
  currentSetInView: Flashcard[];
  setProgressView: (i: number) => void;
  setCurrentCardInView: (i: Flashcard) => void;
  quizletModal: boolean;
  setQuizletModal: (i: boolean) => void;
  color?: string;
}

export const Flipper = ({
  progressView,
  cardFlipped,
  setCardFlipped,
  currentCardInView,
  currentSetInView,
  setProgressView,
  setCurrentCardInView,
  quizletModal,
  setQuizletModal,
  color,
}: IProps) => {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <ProgressBar
          completed={progressView}
          width="95%"
          bgColor="#1F2E5E"
          customLabel=" "
        />
      </div>
      <ReactCardFlip
        isFlipped={cardFlipped}
        flipDirection="vertical"
        cardStyles={{
          back: {
            height: 450,
            overflowY: "scroll",
            textAlign: "center",
            backgroundColor: "transparent",
          },
          front: {
            height: 450,
            overflowY: "scroll",
            textAlign: "center",
            backgroundColor: "transparent",
          },
        }}
      >
        <div
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            padding: 100,
          }}
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          <h1
            style={{
              fontSize: 35,
              height: 20,
              lineHeight: 1.4,
              textAlign: "center",
              marginTop: 100,
              color,
            }}
          >
            {currentCardInView.term}
          </h1>
        </div>

        <div
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            padding: 200,
          }}
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          <p style={{ fontSize: 25, lineHeight: 1.4, width: "100%", color }}>
            {currentCardInView.definition}
          </p>
        </div>
      </ReactCardFlip>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            border: "1px solid #eee",
            borderRadius: 200,
            backgroundColor: "#fff",
          }}
          onClick={() => {
            if (currentSetInView.indexOf(currentCardInView) + -1 === -1) {
              setCurrentCardInView(
                currentSetInView[currentSetInView.length - 1],
              );
              const numerator = currentSetInView.length;
              const denominator = currentSetInView.length;
              setProgressView(Math.round((numerator / denominator) * 100));
            } else {
              setCurrentCardInView(
                currentSetInView[
                  currentSetInView.indexOf(currentCardInView) + -1
                ],
              );
              const numerator = currentSetInView.indexOf(currentCardInView) - 1;
              const denominator = currentSetInView.length;
              setProgressView(Math.round((numerator / denominator) * 100));
            }
          }}
        >
          <i
            className="fa fa-arrow-left fa-2x"
            style={{
              cursor: "pointer",
              color: "navy",
            }}
          ></i>
        </div>

        <p
          style={{ marginRight: 20, marginLeft: 20, fontWeight: "bold", color }}
        >{`${currentSetInView.indexOf(currentCardInView) + 1} / ${
          currentSetInView.length
        }`}</p>
        <div
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            border: "1px solid #eee",
            borderRadius: 200,
            backgroundColor: "#fff",
          }}
        >
          <i
            className="fa fa-arrow-right fa-2x"
            style={{
              cursor: "pointer",
              color: "navy",
            }}
            onClick={() => {
              if (
                currentSetInView.indexOf(currentCardInView) + 1 ===
                currentSetInView.length
              ) {
                setCurrentCardInView(currentSetInView[0]);
                const numerator = 0;
                const denominator = currentSetInView.length;
                setProgressView(Math.round((numerator / denominator) * 100));
              } else {
                setCurrentCardInView(
                  currentSetInView[
                    currentSetInView.indexOf(currentCardInView) + 1
                  ],
                );
                const numerator =
                  currentSetInView.indexOf(currentCardInView) + 2;
                const denominator = currentSetInView.length;
                setProgressView(Math.round((numerator / denominator) * 100));
              }
            }}
          ></i>
        </div>
      </div>

      <Modal
        open={quizletModal}
        onClose={() => setQuizletModal(false)}
        styles={{
          modal: {
            width: "50%",
            height: "40%",
            marginTop: "10%",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2.5vw",
              color: "#4255FF",
              fontWeight: "bold",
              marginTop: 40,
            }}
          >
            Exporting to Quizlet
          </h1>
        </div>
        <ol style={{ marginTop: 45, paddingLeft: 45 }}>
          <li>
            Step 1: Head on over to create a new imported set on Quizlet with{" "}
            <a
              href="https://quizlet.com/create-set"
              style={{ color: "#4255FF", textDecoration: "underline" }}
              target="_blank"
            >
              this link
            </a>
          </li>{" "}
          <li>Step 2: Click on the import button</li>{" "}
          <li>
            Step 3: Paste. The results are already copied to your clipboard.
            (Command/CTRL + V)
          </li>{" "}
        </ol>
      </Modal>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: color ? "3%" : 20,
          top: color ? 40 : "",
        }}
      >
        <Button
          style={{ color: "#fff", backgroundColor: "#4255FF" }}
          onClick={() => {
            setQuizletModal(true);
            let str = ``;

            for (const card of currentSetInView) {
              let term = card.term;
              let def = card.definition;

              str += term + `\t` + def + "\n";
            }

            navigator.clipboard.writeText(str);
            console.log(str);
            //
          }}
        >
          Export to Quizlet
        </Button>
      </div>
    </div>
  );
};
