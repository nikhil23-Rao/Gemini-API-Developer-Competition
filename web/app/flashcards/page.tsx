"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import { None } from "@/components/flashcards/none";
import { useEffect, useState } from "react";
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
import { flashcardOptions } from "@/data/optionsFlashcards";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { getUnitsForClass } from "@/api/getUnitsForClass";
import { getFlashcardsByUnit } from "@/api/getFlashcardsByUnit";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import db from "@/utils/initDB";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../globals.css";
import { getFlashcardsThroughPrompt } from "@/api/getFlashcardsThroughPrompt";
import { getFlashcardsThroughImage } from "@/api/getFlashcardsThroughImport";
import { ProcessingRequest } from "@/components/general/ProcessingRequest";
import { EditFlashcards } from "@/components/flashcards/editFlashcards";
import { Flashcard } from "@/types/flashcard/Flashcard";
import { NewModal } from "@/components/general/newModal";
import { Flipper } from "@/components/flashcards/Flipper";
import { SetView } from "@/components/flashcards/SetView";
import { Splash } from "@/components/general/Splash";
import loader from "../../public/loader.json";
import Lottie from "lottie-react";
import { getTheme } from "@/utils/getTheme";
import { getColor } from "@/utils/getColor";

export default function Flashcards() {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [openSet, setOpenSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSetInView, setCurrentSetInView] = useState<Flashcard[]>([]);
  const [currentCardInView, setCurrentCardInView] = useState<Flashcard>();
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
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

  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();
  const [quizletModal, setQuizletModal] = useState(false);

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("res", reader.result);
        setImgPreview(reader.result as string);
        const base64String = (reader.result as string)
          .replace("data:", "")
          .replace(/^.+,/, "");

        // console.log(base64String);
        setImported(base64String);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    console.log(imported);
  }, [imported]);

  useEffect(() => {
    if (chosenClass.length > 0 && tabValue == 0) {
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
            createdSets.sort((a, b) => b.dateCreated - a.dateCreated);
            setUserFlashCardSets(createdSets);
            console.log(createdSets);
            duplicate = false;
          }
        });
      });
      setLoadingSets(false);
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(progressView);
  }, [progressView]);

  useEffect(() => {
    console.log(flashcards);
  }, [flashcards]);

  if (loading) return <ProcessingRequest />;
  if (editModal)
    return (
      <EditFlashcards
        currentUser={currentUser as User}
        flashcards={flashcards}
        name={name}
        setFlashcards={setFlashcards}
        chosenClass={chosenClass}
        setModal={setEditModal}
        selectedUnits={selectedUnits}
        editMode={true}
        setName={setName}
        setdocid={id}
        setClass={setChosenClass}
        setSelectedUnits={setSelectedUnits}
      />
    );
  if (flashcards.length > 0 && modal) {
    return (
      <EditFlashcards
        currentUser={currentUser as User}
        flashcards={flashcards}
        name={name}
        setFlashcards={setFlashcards}
        setName={setName}
        chosenClass={chosenClass}
        setModal={setModal}
        selectedUnits={selectedUnits}
        setClass={setChosenClass}
        setSelectedUnits={setSelectedUnits}
      />
    );
  }

  if (modal) {
    return (
      <NewModal modal={modal} setModal={setModal}>
        <h1
          className={getColor(color!)}
          style={{ fontSize: "4vw", marginTop: 130 }}
        >
          Create Flashcards
        </h1>
        <TextField
          id="outlined-basic"
          label={"Enter Set Name"}
          variant="outlined"
          value={name}
          style={{
            width: 400,
            marginTop: 80,
            backgroundColor: "#fff",
            border: "9px solid #fff",
            borderRadius: 10,
          }}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          color={name.length > 0 ? "primary" : "error"}
        />
        <FormControl
          style={{
            width: 400,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: "#fff",
            border: "9px solid #fff",
            borderRadius: 10,
          }}
        >
          <InputLabel id="demo-simple-select-label">
            Class Related To
          </InputLabel>
          <Select
            // color={chosenClass.length > 0 ? "primary" : "error"}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={chosenClass}
            onChange={(e) => {
              setPossibleUnits(null);
              setChosenClass(e.target?.value as string);
            }}
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
                label="Select Units"
                onClick={() => {}}
              >
                {!possibleUnits && (
                  <h1 style={{ padding: 20 }}>
                    {chosenClass.length > 0
                      ? "loading..."
                      : "please select a class..."}
                  </h1>
                )}
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
          <>
            {" "}
            <div style={{ marginTop: 40 }}>
              <label htmlFor="group_image">
                <h1
                  style={{
                    cursor: "pointer",
                    textTransform: "uppercase",
                    color: "#1B596F",
                    border: "1px solid #eee",
                    padding: 15,
                    borderRadius: 200,
                  }}
                >
                  Select A File
                </h1>
              </label>
              <input
                type="file"
                onChange={onImageChange}
                className="filetype custom-file-upload"
                id="group_image"
                accept="image/*"
              />
            </div>
            <p style={{ marginTop: 20 }}> Chosen File:</p>
            {imgPreview.length > 0 && (
              <img
                src={imgPreview}
                style={{
                  width: 440,
                  height: 440,
                  marginTop: 20,
                  border: "2px solid lightblue",
                  borderRadius: 15,
                }}
                alt=""
              />
            )}
          </>
        )}

        <button
          className={`primary-effect ${color}`}
          style={{
            width: 400,
            borderRadius: 200,
            marginTop: 50,
            marginBottom: 40,
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
            if (tabValue === 2) {
              setLoading(true);
              const generated = await getFlashcardsThroughImage(
                imported as string,
              );
              setFlashcards(generated);
              setLoading(false);
            }
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
      </NewModal>
    );
  }

  if (!theme) return <Splash></Splash>;

  return (
    <>
      <div
        style={{
          height: !loadingSets ? "100%" : "100vh",
          width: "100%",
          backgroundColor:
            theme.backgroundColor.length > 0
              ? theme.backgroundColor
              : "transparent",
        }}
        className={theme.className}
      >
        <AppSidebar
          modals={openSet || modal}
          bg={theme.backgroundColor}
          color={theme.textColor}
        />

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
            <Flipper
              cardFlipped={cardFlipped}
              quizletModal={quizletModal}
              setQuizletModal={setQuizletModal}
              currentCardInView={currentCardInView}
              currentSetInView={currentSetInView}
              progressView={progressView}
              setCardFlipped={setCardFlipped}
              setCurrentCardInView={setCurrentCardInView}
              setProgressView={setProgressView}
            />
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1
              className={getColor(color!)}
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
              flashcards with the button below. If you already have flashcard
              sets, you can view them by clicking on the containers below. Use
              AI to help create a boilerplate to help you study.
            </p>

            <Button
              variant="contained"
              style={{ marginTop: 20 }}
              onClick={() => setModal(true)}
            >
              <i className="fa fa-plus" style={{ marginRight: 10 }}></i>
              <p style={{ marginTop: 1 }}>Create New Set</p>
            </Button>

            <TextField
              style={{
                borderRadius: 400,
                width: "40%",
                marginTop: 40,
                backgroundColor:
                  theme.name !== "Light" ? theme.textColor : "#fff",
              }}
              placeholder="Search for a set by name or class..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              InputProps={{ sx: { borderRadius: 100, paddingLeft: 2 } }}
            ></TextField>
          </div>

          {userFlashCardSets.length > 0 ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: 40,
                  position: "relative",
                }}
              >
                <main
                  className="main"
                  style={{
                    height: "100%",
                  }}
                >
                  {userFlashCardSets
                    .filter(
                      (s) =>
                        s.cardsetName
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        s.class.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((set) => (
                      <>
                        <SetView
                          bg={theme.backgroundColor}
                          color={theme.textColor}
                          setName={setName}
                          setId={setId}
                          set={set}
                          setCurrentCardInView={setCurrentCardInView}
                          setCurrentSetInView={setCurrentSetInView}
                          setOpenSet={setOpenSet}
                          setProgressView={setProgressView}
                          setEditModal={setEditModal}
                          setFlashcards={setFlashcards}
                          key={JSON.stringify(set)}
                        />
                      </>
                    ))}
                </main>
              </div>
            </>
          ) : loadingSets ? (
            <>
              <Lottie
                animationData={loader}
                loop
                style={{ width: "16vw", marginTop: 30, height: "100%" }}
              />
              <p>Fetching data...</p>
            </>
          ) : (
            !loadingSets && <None color={color!} setModal={setModal} />
          )}
        </div>
      </div>
    </>
  );
}
