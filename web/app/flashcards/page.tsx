"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import { None } from "@/components/flashcards/none";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Tabs,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import ComponentTab from "@/components/general/Tabs";
import { classes } from "@/data/classes";
import { flashcardOptions } from "@/data/optionsFlashcards";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { getUnitsForClass } from "@/api/getUnitsForClass";
import { getFlashcardsByUnit } from "@/api/getFlashcardsByUnit";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import db from "@/utils/initDB";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactCardFlip from "react-card-flip";
import "../globals.css";
import { Splash } from "@/components/general/Splash";
import Lottie from "lottie-react";
import animation from "../../public/loadingspace.json";
import axios from "axios";
import { getFlashcardsThroughPrompt } from "@/api/getFlashcardsThroughPrompt";

export default function Flashcards() {
  const [modal, setModal] = useState(false);
  const [openSet, setOpenSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSetInView, setCurrentSetInView] = useState<any[]>([]);
  const [currentCardInView, setCurrentCardInView] = useState<any>();
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState("My New Set");
  const [prompt, setPrompt] = useState("");
  const [chosenClass, setChosenClass] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [userFlashCardSets, setUserFlashCardSets] = useState<any[]>([]);
  const [possibleUnits, setPossibleUnits] = useState<
    [{ name: string }] | null
  >();
  const [flashcards, setFlashcards] = useState<any>([]);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (chosenClass.length > 0) {
      // Call getUnits API
      setSelectedUnits([]);
      getUnitsForClass(chosenClass, setPossibleUnits);
    }
  }, [chosenClass]);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "flashcards"),
        where("createdById", "==", currentUser?.id),
      );

      let duplicate = false;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let createdSets: any = [];
        snapshot.docs.forEach((doc) => {
          userFlashCardSets.map((set) => {
            if (set.seed === doc.data().seed) duplicate = true;
          });
          if (duplicate) return;
          // if (userFlashCardSets.includes(doc.data())) return;
          else {
            createdSets.push(doc.data());
            setUserFlashCardSets(createdSets);
            console.log(createdSets);
            duplicate = false;
          }
        });
      });
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(flashcards);
  }, [flashcards]);

  if (loading) {
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
  }
  if (flashcards.length > 0) {
    return (
      <>
        <i
          className="fa fa-window-close fa-2x"
          style={{
            color: "red",
            position: "absolute",
            top: 50,
            right: 100,
            cursor: "pointer",
          }}
          onClick={() => setModal(false)}
        ></i>
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          animate={{ y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 140,
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 130 }}
          >
            Review: {name}
          </h1>
          {flashcards.map((card) => (
            <>
              <div className="card-main" style={{ marginTop: 80 }}>
                <div className="card-img">
                  <div
                    style={{ backgroundColor: "#000", height: "100%" }}
                    className="gradientbg"
                  ></div>
                </div>
                <div className="card-content">
                  Term:{" "}
                  <TextareaAutosize
                    className="card-title"
                    value={card.term}
                    style={{
                      border: "none",
                      outline: "none",
                      resize: "none",
                      width: "35vw",
                    }}
                    onChange={(e) => {
                      let oldFlashcards = [...flashcards];
                      const target: any = oldFlashcards.find(
                        (c) => c.term === card.term,
                      );

                      const newCard = {
                        term: e.target.value,
                        definition: card.definition,
                      };

                      Object.assign(target, newCard);

                      setFlashcards([...oldFlashcards] as any);
                    }}
                  ></TextareaAutosize>
                  Definition:{" "}
                  <TextareaAutosize
                    className="card-description"
                    value={card.definition}
                    style={{
                      border: "none",
                      outline: "none",
                      resize: "none",
                      width: "35vw",
                    }}
                    onChange={(e) => {
                      let oldFlashcards = [...flashcards];
                      const target: any = oldFlashcards.find(
                        (c) => c.definition === card.definition,
                      );

                      const newCard = {
                        definition: e.target.value,
                        term: card.term,
                      };

                      Object.assign(target, newCard);

                      setFlashcards([...oldFlashcards] as any);
                    }}
                  ></TextareaAutosize>
                  <div className="card-date">
                    <p className="date">Generated by Vertex</p>
                  </div>
                </div>
              </div>
            </>
          ))}
          <div
            style={{ marginTop: 20, cursor: "pointer" }}
            className="text-gradient-black"
          >
            <i className="fa fa-arrow-down"></i> Generate More with AI
          </div>
          <div
            style={{ marginTop: 20, cursor: "pointer" }}
            className="text-gradient-black"
            onClick={() => {
              setFlashcards([
                ...flashcards,
                { term: "New Term", definition: "add definition" },
              ]);
            }}
          >
            <i className="fa fa-plus-circle"></i> Add Own Card
          </div>
          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              bottom: 50,
              cursor: "pointer",
              position: "fixed",
            }}
            onClick={async () => {
              await addDoc(collection(db, "flashcards"), {
                createdById: currentUser?.id,
                createdByDocId: currentUser?.docid,
                flashcardSet: flashcards,
                cardsetName: name,
                class: chosenClass,
                units: selectedUnits,
                seed: `https://api.dicebear.com/8.x/identicon/svg?seed=${Math.floor(
                  Math.random() * 1000000,
                ).toString()}`,
              });

              setModal(false);
              setFlashcards([]);
              // firebase save
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Save
            </span>
          </button>
        </motion.div>
      </>
    );
  }

  if (modal) {
    return (
      <>
        <i
          className="fa fa-window-close fa-2x"
          style={{
            color: "red",
            position: "absolute",
            top: 50,
            right: 100,
            cursor: "pointer",
          }}
          onClick={() => setModal(false)}
        ></i>
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          animate={{ y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 40,
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 130 }}
          >
            Create Flashcards
          </h1>
          <TextField
            id="outlined-basic"
            label={"Enter Set Name"}
            variant="outlined"
            value={name}
            style={{ width: 400, marginTop: 80 }}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            color={name.length > 0 ? "primary" : "error"}
          />
          <FormControl style={{ width: 400, marginTop: 20, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Class Related To
            </InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenClass}
              label="Expected Graduation Year"
              onChange={(e) => setChosenClass(e.target?.value as string)}
            >
              {currentUser?.selectedClasses.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, value) => {
                  setTabValue(value);
                }}
                aria-label="basic tabs example"
              >
                {flashcardOptions.map((obj, idx) => (
                  <ComponentTab t={obj} idx={idx} />
                ))}
              </Tabs>
            </Box>
          </Box>
          {tabValue == 0 ? (
            <>
              <FormControl
                style={{ width: 400, marginTop: 20, marginBottom: 20 }}
              >
                <InputLabel id="demo-simple-select-label">
                  {selectedUnits.length > 0
                    ? `${selectedUnits.length} Unit(s) Selected`
                    : "Units (If Applicable)"}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUnits.length > 0 ? "" : "Units Listed Below"}
                  label="Expected Graduation Year"
                  onClick={() => {}}
                >
                  {possibleUnits?.map((u) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          padding: 15,
                        }}
                      >
                        <ListItemText primary={u.name} />
                        <Checkbox
                          checked={selectedUnits.includes(u.name)}
                          onClick={() => {
                            if (selectedUnits.includes(u.name)) {
                              return setSelectedUnits(
                                selectedUnits.filter((unit) => unit !== u.name),
                              );
                            }
                            setSelectedUnits([...selectedUnits, u.name]);
                          }}
                        />
                      </div>
                    </>
                  ))}
                </Select>
              </FormControl>
              <p>Units Selected:</p>{" "}
              {selectedUnits.map((u) => (
                <p>{u}</p>
              ))}
            </>
          ) : tabValue === 1 ? (
            <>
              {" "}
              <TextareaAutosize
                id="outlined-basic"
                placeholder="Generate flashcards on..."
                value={prompt}
                style={{
                  width: 400,
                  marginTop: 20,
                  height: 100,
                  border: "2px solid #CBCBCB",
                  borderRadius: 5,
                  resize: "none",
                  padding: 20,
                }}
                onChange={(e) => {
                  setPrompt(e.currentTarget.value);
                }}
                color={prompt.length > 0 ? "primary" : "error"}
              />
            </>
          ) : (
            <></>
          )}

          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              marginTop: 50,
              cursor:
                chosenClass.length === 0 || selectedUnits.length === 0
                  ? "disabled"
                  : "pointer",
              backgroundColor:
                chosenClass.length === 0 || selectedUnits.length === 0
                  ? "gray"
                  : "",
            }}
            onClick={async () => {
              if (tabValue == 1) {
                setLoading(true);
                const generated = await getFlashcardsThroughPrompt(
                  prompt,
                  chosenClass,
                );
                setFlashcards(generated);
                setLoading(false);
              }

              if (selectedUnits.length > 0) {
                setLoading(true);
                const generated = await getFlashcardsByUnit(
                  `${chosenClass} - Unit about: ${selectedUnits.join(", ")}`,
                );
                setFlashcards(generated);
                setLoading(false);
              }
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Create New Set
            </span>
          </button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <AppSidebar />
      <Modal
        open={openSet}
        onClose={() => setOpenSet(false)}
        styles={{
          modal: {
            width: "100vw",
            overflowY: "scroll",
            overflowX: "hidden",
          },
          modalContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        {currentCardInView && (
          <div>
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
                  } else {
                    setCurrentCardInView(
                      currentSetInView[
                        currentSetInView.indexOf(currentCardInView) + -1
                      ],
                    );
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
                    } else {
                      setCurrentCardInView(
                        currentSetInView[
                          currentSetInView.indexOf(currentCardInView) + 1
                        ],
                      );
                    }
                  }}
                ></i>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "10%",
        }}
      >
        <h1
          className="text-gradient-black"
          style={{ fontSize: "4vw", marginTop: 50 }}
        >
          My Flashcards
        </h1>
        <p
          style={{
            marginTop: 40,
            maxWidth: "30%",
            textAlign: "center",
            color: "gray",
            fontSize: 14,
          }}
        >
          Welcome to your flashcards. To get started, create a new set of
          flashcards with the button below. If you already have flashcard sets,
          you can view them by clicking on the containers below. Use AI to help
          create a boilerplate to help you study.
        </p>

        <Button
          variant="outlined"
          style={{ marginTop: 20 }}
          onClick={() => setModal(true)}
        >
          <i className="fa fa-plus" style={{ marginRight: 10 }}></i>
          <p style={{ marginTop: 1 }}>Create New Set</p>
        </Button>

        {userFlashCardSets.length > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <main className="main">
                {userFlashCardSets.map((set) => (
                  <section
                    className="section"
                    style={{
                      maxWidth: 400,
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
                ))}
              </main>
            </div>
          </>
        ) : (
          <None setModal={setModal} />
        )}
      </div>
    </>
  );
}
