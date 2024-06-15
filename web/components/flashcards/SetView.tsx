import { Cardset } from "@/types/flashcard/Cardset";
import { Flashcard } from "@/types/flashcard/Flashcard";

interface IProps {
  set: Cardset;
  setCurrentSetInView: (i: Flashcard[]) => void;
  setCurrentCardInView: (i: Flashcard) => void;
  setOpenSet: (i: boolean) => void;
  setProgressView: (i: number) => void;
}
export const SetView = ({
  set,
  setCurrentCardInView,
  setCurrentSetInView,
  setOpenSet,
  setProgressView,
}: IProps) => {
  return (
    <section
      className="section"
      style={{
        width: 400,
        border: "2px solid #eee",
        padding: 20,
        cursor: "pointer",
        marginTop: 50,
        zoom: 0.8,
      }}
      onClick={() => {
        setCurrentSetInView([...set.flashcardSet]);
        setCurrentCardInView([...set.flashcardSet][0]);
        setOpenSet(true);
        setProgressView(0);
      }}
    >
      <figure className="figure">
        <img
          className="img"
          style={{
            border: "2px solid #eee",
          }}
          src={set.seed}
        />
      </figure>
      <article
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
    </section>
  );
};
