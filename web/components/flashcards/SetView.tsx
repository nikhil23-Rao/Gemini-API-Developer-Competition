import { Cardset } from "@/types/flashcard/Cardset";
import { Flashcard } from "@/types/flashcard/Flashcard";
import { Badge, Button } from "@mui/material";

interface IProps {
  set: Cardset;
  setCurrentSetInView: (i: Flashcard[]) => void;
  setCurrentCardInView: (i: Flashcard) => void;
  setOpenSet: (i: boolean) => void;
  setEditModal: (i: boolean) => void;
  setProgressView: (i: number) => void;
  setFlashcards?: (i: Flashcard[]) => void;
  setId: (i: string) => void;
  setName: (i: string) => void;
}
export const SetView = ({
  set,
  setCurrentCardInView,
  setCurrentSetInView,
  setOpenSet,
  setProgressView,
  setEditModal,
  setFlashcards,
  setId,
  setName,
}: IProps) => {
  return (
    <section
      className="section"
      style={{
        width: 400,
        border: "2px solid #eee",
        padding: 20,
        cursor: "pointer",
        zoom: 0.8,
        marginTop: 360,
      }}
    >
      <figure
        className="figure"
        onClick={() => {
          setCurrentSetInView([...set.flashcardSet]);
          setCurrentCardInView([...set.flashcardSet][0]);
          setOpenSet(true);
          setProgressView(0);
        }}
      >
        <img
          className="img"
          style={{
            border: "2px solid #eee",
          }}
          src={set.seed}
        />
      </figure>
      <article
        onClick={() => {
          setCurrentSetInView([...set.flashcardSet]);
          setCurrentCardInView([...set.flashcardSet][0]);
          setOpenSet(true);
          setProgressView(0);
        }}
        className="article"
        style={{
          paddingTop: 25,
          paddingBottom: 25,
          paddingLeft: 10,
        }}
      >
        <span className="span" style={{ letterSpacing: 1 }}>
          {set.class}
        </span>
        <h1
          className="h3"
          style={{
            marginTop: 20,
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          {set.cardsetName}
        </h1>
        <p className="p" style={{ marginTop: 8 }}>
          Covers concepts on: {set.units.join(", ")}
        </p>
      </article>
      <Button
        style={{
          position: "relative",
          marginLeft: "84%",
          marginTop: 20,
          color: "#000",
        }}
        onClick={() => {
          setName(set.cardsetName);
          setId(set.docid);
          if (setFlashcards) {
            setFlashcards([...set.flashcardSet] as Flashcard[]);
          }
          setOpenSet(false);
          setEditModal(true);
        }}
      >
        <i className="fa fa-gear fa-2x"></i>
      </Button>
    </section>
  );
};
