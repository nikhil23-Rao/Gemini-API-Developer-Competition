import { Flashcard } from "@/types/flashcard/Flashcard";
import { Button } from "@mui/material";
import ProgressBar from "@ramonak/react-progress-bar";
import ReactCardFlip from "react-card-flip";

interface IProps {
  progressView: number;
  cardFlipped: boolean;
  setCardFlipped: (i: boolean) => void;
  currentCardInView: Flashcard;
  currentSetInView: Flashcard[];
  setProgressView: (i: number) => void;
  setCurrentCardInView: (i: Flashcard) => void;
}

export const Flipper = ({
  progressView,
  cardFlipped,
  setCardFlipped,
  currentCardInView,
  currentSetInView,
  setProgressView,
  setCurrentCardInView,
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
      <ReactCardFlip isFlipped={cardFlipped} flipDirection="vertical">
        <div
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            padding: 200,
          }}
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          <h1
            style={{
              fontSize: 35,
              height: 20,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            {currentCardInView.term}
          </h1>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            padding: 200,
          }}
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          <h1 style={{ fontSize: 18 }}>{currentCardInView.definition}</h1>
        </div>
      </ReactCardFlip>
      <div style={{ position: "absolute", bottom: 20, right: 20 }}>
        <Button style={{ color: "#fff", backgroundColor: "#4255FF" }}>
          Export to Quizlet
        </Button>
      </div>
      <div style={{ position: "absolute", bottom: 20, left: 20 }}>
        <Button style={{ color: "#fff", backgroundColor: "#8B4448" }}>
          Edit Flashcards
        </Button>
      </div>
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

        <p style={{ marginRight: 20, marginLeft: 20 }}>{`${
          currentSetInView.indexOf(currentCardInView) + 1
        } / ${currentSetInView.length}`}</p>
        <div
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            border: "1px solid #eee",
            borderRadius: 200,
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
    </div>
  );
};
