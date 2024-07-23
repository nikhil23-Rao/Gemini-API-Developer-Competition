"use client";
import { Flipper } from "@/components/flashcards/Flipper";
import "../../globals.css";
import { Splash } from "@/components/general/Splash";
import { Cardset } from "@/types/flashcard/Cardset";
import { Flashcard } from "@/types/flashcard/Flashcard";
import { getTheme } from "@/utils/getTheme";
import db from "@/utils/initDB";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function FlashcardViewer({
  params,
}: {
  params: { id: string };
}) {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [openSet, setOpenSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSetInView, setCurrentSetInView] = useState<Flashcard[]>([]);
  const [currentCardInView, setCurrentCardInView] = useState<Flashcard>();
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState("My New Set");
  const [search, setSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chosenClass, setChosenClass] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [progressView, setProgressView] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [id, setId] = useState<string>();
  const [userFlashCardSets, setUserFlashCardSets] = useState<any[]>([]);
  const [imported, setImported] = useState<string>();
  const [possibleUnits, setPossibleUnits] = useState<
    [{ name: string }] | null
  >();
  const [flashcards, setFlashcards] = useState<Array<Flashcard> | []>([]);
  const [loadingSets, setLoadingSets] = useState(true);

  const [quizletModal, setQuizletModal] = useState(false);
  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();
  const [flashcardSet, setFlashcardSet] = useState<Cardset>();
  useEffect(() => {
    const q = query(
      collection(db, "flashcards"),
      where("docid", "==", params.id),
    );
    if (params.id) {
      console.log("hey");
      getDocs(q).then((res) => setFlashcardSet(res.docs[0].data() as Cardset));
    }
  }, [params.id]);

  useEffect(() => {
    if (flashcardSet) {
      setCurrentCardInView(flashcardSet.flashcardSet[0]);
    }
  }, [typeof flashcardSet]);

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  if (!flashcardSet || !currentCardInView) return <Splash></Splash>;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
          height: "100vh",
        }}
      >
        <div
          style={{
            height: "100vh",
            overflowY: "hidden",
            color: "#000",
            backgroundColor: theme.backgroundColor,
          }}
        >
          <a
            style={{
              color: theme.textColor,
              position: "absolute",
              top: 40,
              left: 40,
              zIndex: 1000000,
              fontSize: 22,
            }}
            href="/home"
          >
            Back
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100vw",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "50%",
                alignContent: "center",
                padding: 20,
                border: "2px solid #eee",
              }}
            >
              <h1
                style={{
                  alignSelf: "flex-start",
                  color: theme.textColor,
                  fontWeight: "bold",
                  fontSize: 24,
                }}
              >
                {flashcardSet.cardsetName}
              </h1>
              <p
                style={{
                  alignSelf: "flex-start",
                  color: theme.textColor,
                  fontSize: 14,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  marginTop: 8,
                }}
              >
                {flashcardSet.class}
              </p>
              <Flipper
                cardFlipped={cardFlipped}
                quizletModal={quizletModal}
                setQuizletModal={setQuizletModal}
                currentCardInView={currentCardInView}
                currentSetInView={flashcardSet.flashcardSet}
                progressView={progressView}
                setCardFlipped={setCardFlipped}
                setCurrentCardInView={setCurrentCardInView}
                color={theme.textColor}
                setProgressView={setProgressView}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
