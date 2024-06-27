"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tabs,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import animationdata from "../../public/questiongenerate.json";
import "../globals.css";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { NewModal } from "@/components/general/newModal";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { ResourceContent } from "@/types/questiongenerate/ResourceContent";
import ComponentTab from "@/components/general/Tabs";
import { Searching } from "@/components/general/Searching";
import { getPercentMatch } from "@/api/getPercentMatch";
import { getResourcesAPI } from "@/api/getResourcesAPI";
import { NumberInput } from "@/components/general/NumberInput";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ProcessingRequest } from "@/components/general/ProcessingRequest";
import { getMCQ } from "@/api/getMCQ";
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

export default function QuestionGenerator() {
  const [questionGenerateModal, setQuestionGenerateModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);
  const [chosenClass, setChosenClass] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [resourceContent] = useState(ResourceContent);
  const [quizTypes] = useState(["MCQ", "FRQ"]);
  const [content, setContent] = useState("");
  const [resourceOptions] = useState(["User Input", "Import"]);
  const [tabValue, setTabValue] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [searching, setSearching] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [resourcesListModal, setResourcesListModal] = useState(false);
  const [quizModal, setQuizModal] = useState(false);
  const [searchedResources, setSearchedResources] = useState<any>([]);
  const [imported, setImported] = useState("");
  const [length, setLength] = useState<number | null>(1);
  const [processing, setProcessing] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState();
  const [style, setStyle] = useState<
    "Easy" | "Moderate" | "Difficult" | "AP Styled"
  >("Easy");
  const [problemSetName, setProblemSetName] = useState("New Problem Set");
  const [problemSetDescription, setProblemSetDescription] = useState("");
  const [status, setStatus] = useState<"public" | "private">();

  const [userProblemSets, setUserProblemSets] = useState<any>([]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("res", reader.result);
        setImgPreview(reader.result as string);
        const base64String = (reader.result as string)
          .replace("data:", "")
          .replace(/^.+,/, "");
        setImported(base64String);

        // console.log(base64String);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "problemsets"),
        where("createdById", "==", currentUser?.id),
      );

      let duplicate = false;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let createdSets: any = [];
        snapshot.docs.forEach((doc) => {
          userProblemSets.map((set) => {
            if (set.seed === doc.data().seed) duplicate = true;
          });
          if (duplicate) return;
          // if (userFlashCardSets.includes(doc.data())) return;
          else {
            createdSets.push(doc.data());
            setUserProblemSets(createdSets);
            console.log(createdSets);
            duplicate = false;
          }
        });
      });
    }
  }, [currentUser]);

  if (quizModal) {
    return (
      <NewModal modal={quizModal} setModal={setQuizModal}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 120 }}
          >
            {problemSetName}
          </h1>
          <p style={{ marginTop: 100 }}>{problemSetDescription}</p>
          <TextField
            style={{ width: "40%", marginTop: 80 }}
            placeholder="Problem Set Name..."
            InputProps={{ sx: { paddingLeft: 2 } }}
            value={problemSetName}
            onChange={(e) => setProblemSetName(e.target.value)}
          ></TextField>
          <TextareaAutosize
            id="outlined-basic"
            placeholder="Description... (optional)"
            value={problemSetDescription}
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
              setProblemSetDescription(e.currentTarget.value);
            }}
            color={prompt.length > 0 ? "primary" : "error"}
          />
          <Accordion style={{ width: "80%", marginTop: 40 }}>
            <AccordionSummary
              id="panel-header"
              aria-controls="panel-content"
              expandIcon={<i className="fa fa-angle-down fa-2x"></i>}
            >
              View Generated Questions
            </AccordionSummary>
            <AccordionDetails>
              {(generatedQuestions as any).map((q) => (
                <>
                  <div style={{ marginBottom: 40 }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        fontSize: 30,
                        marginTop: 20,
                      }}
                    >
                      Question #{q.questionNumber}
                    </h1>
                    <h1 className="mt-5" style={{ fontWeight: "bold" }}>
                      {q.question}
                    </h1>
                    <ul>
                      {q.optionsWithoutLetter.map((o, idx) => {
                        return (
                          <>
                            <li>
                              {o}
                              <i
                                className={`fa fa-${
                                  q.correctAnswerOption === o
                                    ? "check"
                                    : "close"
                                } ml-2`}
                                style={{
                                  color:
                                    q.correctAnswerOption === o
                                      ? "green"
                                      : "red",
                                }}
                              ></i>
                            </li>
                            <p style={{ color: "gray" }}>
                              {
                                Object.values(q.answerChoiceExplanations)[
                                  idx
                                ] as any
                              }
                            </p>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ))}
            </AccordionDetails>
          </Accordion>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "row",
              marginLeft: 20,
              marginBottom: 140,
            }}
          >
            <div
              style={{
                padding: 20,
                border:
                  status === "public" ? "5px solid #1F1F58" : "1px solid #eee",
                transition: "0.1s ease-in",
                borderRadius: 20,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setStatus("public")}
            >
              <img src="/marketplace.png" alt="" />
              <h1 style={{ fontSize: "1.3vw", fontWeight: "bold" }}>
                Add to Marketplace
              </h1>
              <p style={{ marginTop: 20 }}>
                Publish these questions to all users to access.
              </p>
            </div>
            <div
              style={{
                padding: 20,
                border:
                  status === "private" ? "5px solid #1F1F58" : "1px solid #eee",
                transition: "0.1s ease-in",
                borderRadius: 20,
                textAlign: "center",
                cursor: "pointer",
                marginLeft: 40,
              }}
              onClick={() => setStatus("private")}
            >
              <img src="/lock.png" alt="" />
              <h1 style={{ fontSize: "1.3vw", fontWeight: "bold" }}>
                Private Problem Set
              </h1>
              <p style={{ marginTop: 20 }}>
                Only you will be able to see the questions generated.
              </p>
            </div>
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
              // firebase save
              const docid = await addDoc(collection(db, "problemsets"), {
                createdById: currentUser?.id,
                createdByDocId: currentUser?.docid,
                questionSet: generatedQuestions,
                chosenClass,
                problemSetName,
                seed: `https://api.dicebear.com/8.x/identicon/svg?seed=${Math.floor(
                  Math.random() * 1000000,
                ).toString()}`,
                problemSetDescription,
                public: status === "public" ? true : false,
              });
              await updateDoc(doc(db, "problemsets", docid.id), {
                docid: docid.id,
              });

              setQuizModal(false);
              setResourceModal(false);
              setResourcesListModal(false);
              setQuestionGenerateModal(false);
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
        </div>
      </NewModal>
    );
  }
  if (resourcesListModal) {
    return (
      <NewModal modal={resourcesListModal} setModal={setResourcesListModal}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 120 }}
          >
            {chosenClass}: {content}
          </h1>

          <div
            style={{
              marginTop: 80,
            }}
          >
            {searchedResources.map((r) => (
              <>
                <div
                  className="card"
                  style={{
                    width: 400,
                    height: "100%",
                    marginBottom: 40,
                    fontWeight: "bold",
                    padding: 20,
                    minHeight: 140,
                  }}
                >
                  {r.title}{" "}
                  <i
                    className="fa fa-folder"
                    style={{
                      position: "absolute",
                      marginTop: 70,
                      zoom: 1.4,
                      cursor: "pointer",
                    }}
                  ></i>{" "}
                  <div>
                    <a href={r.link} target="_blank">
                      <i
                        className="fa fa-arrow-circle-right"
                        style={{
                          cursor: "pointer",
                          zoom: 1.4,
                        }}
                      ></i>
                    </a>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </NewModal>
    );
  }

  if (processing) {
    return <ProcessingRequest></ProcessingRequest>;
  }

  if (searching) {
    return <Searching></Searching>;
  }

  if (questionGenerateModal) {
    return (
      <NewModal
        modal={questionGenerateModal}
        setModal={setQuestionGenerateModal}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 120 }}
          >
            Question Generator
          </h1>
          <FormControl style={{ width: 400, marginTop: 60, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Class Related To
            </InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenClass}
              onChange={(e) => {
                setChosenClass(e.target.value);
              }}
            >
              {currentUser?.selectedClasses.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: 400, marginTop: 10, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">Content</InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            >
              {quizTypes.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: 400, marginTop: 10, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Question Style
            </InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={style}
              onChange={(e) => {
                setStyle(e.target.value as any);
              }}
            >
              {[
                "Easy",
                "Moderate",
                "Difficult",
                chosenClass.includes("AP ") ? "AP Styled" : undefined,
              ].map((c, idx) => {
                if (c)
                  return (
                    <MenuItem value={c} key={idx}>
                      {c}
                    </MenuItem>
                  );
              })}
            </Select>
          </FormControl>

          <NumberInput
            value={length as number}
            placeholder="How many questions do you want..."
            setValue={setLength}
          />
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, value) => {
                  setTabValue(value);
                }}
                aria-label="basic tabs example"
              >
                {["Manual", "Import"].map((obj, idx) => (
                  <ComponentTab t={obj} idx={idx} />
                ))}
              </Tabs>
            </Box>
          </Box>
          {tabValue === 0 ? (
            <TextareaAutosize
              id="outlined-basic"
              placeholder="Topic... (Enter a unit name, a quesion type, etc)"
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
          ) : (
            <>
              {" "}
              <div style={{ marginTop: 20, textAlign: "center" }}>
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
              </div>
            </>
          )}

          <Snackbar
            open={snackBar}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            autoHideDuration={10000}
            onClose={() => setSnackBar(false)}
            message="Unrelated Search Detected. Please try again with a proper search..."
          />
          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              marginTop: 50,
            }}
            onClick={async () => {
              setProcessing(true);
              const res = await getPercentMatch(prompt, chosenClass);
              if (parseInt(res.percentMatch) > 50) {
                const mcq = await getMCQ(
                  length as number,
                  prompt,
                  style,
                  chosenClass,
                );
                setGeneratedQuestions(mcq);
                setQuestionGenerateModal(false);
                setQuizModal(true);
              } else {
                setSnackBar(true);
              }
              setProcessing(false);
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Generate
            </span>
          </button>
        </div>
      </NewModal>
    );
  }

  if (resourceModal) {
    return (
      <NewModal modal={resourceModal} setModal={setResourceModal}>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 120 }}
          >
            Resource Finder
          </h1>
          <FormControl style={{ width: 400, marginTop: 60, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Class Related To
            </InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenClass}
              onChange={(e) => {
                setChosenClass(e.target.value);
              }}
            >
              {currentUser?.selectedClasses.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: 400, marginTop: 10, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">Content</InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            >
              {resourceContent.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextareaAutosize
            id="outlined-basic"
            placeholder="Enter a unit name, a quesion type, etc..."
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

          <Snackbar
            open={snackBar}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            autoHideDuration={10000}
            onClose={() => setSnackBar(false)}
            message="Unrelated Search Detected. Please try again with a proper search..."
          />
          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              marginTop: 50,
            }}
            onClick={async () => {
              setSearching(true);
              const res = await getPercentMatch(prompt, chosenClass);
              if (parseInt(res.percentMatch) > 50) {
                const state = await getResourcesAPI(
                  `${chosenClass}: ${content} on "${prompt}"`,
                );
                setSearchedResources(state);
                setSearching(false);
                setResourcesListModal(true);
                setResourceModal(false);
                console.log("Will call API further");
              } else {
                console.log("Cmon cuh");
                setSnackBar(true);
              }
              setSearching(false);
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Search for Resources
            </span>
          </button>
        </div>
      </NewModal>
    );
  }

  return (
    <>
      <AppSidebar />
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
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 50 }}
          >
            Question Generator
          </h1>
          <p
            style={{
              marginTop: 40,
              maxWidth: "55%",
              textAlign: "center",
              color: "gray",
              fontSize: 14,
            }}
          >
            Welcome to your very own question/quiz generator. Need more practice
            questions for your upcoming test. Need AP-styled FRQ's? Need some
            additonal MCQs on a concept. Simply use AI to create them.
          </p>

          <Button
            variant="outlined"
            style={{ marginTop: 20 }}
            onClick={() => setQuestionGenerateModal(true)}
          >
            <i className="fa fa-plus" style={{ marginRight: 10 }}></i>
            <p style={{ marginTop: 1 }}>Generate Practice</p>
          </Button>

          <Button
            variant="outlined"
            style={{ marginTop: 20 }}
            color="success"
            onClick={() => setResourceModal(true)}
          >
            <i className="fa fa-search" style={{ marginRight: 10 }}></i>
            <p style={{ marginTop: 1 }}>Resource Finder</p>
          </Button>

          <TextField
            style={{
              borderRadius: 400,
              width: "40%",
              marginTop: 40,
            }}
            placeholder="Search for my problem sets..."
            InputProps={{ sx: { borderRadius: 100, paddingLeft: 2 } }}
          ></TextField>
        </div>
        <div className="relative font-inter antialiased">
          <main
            className="relative flex min-h-screen flex-col justify-center overflow-hidden"
            style={{ height: 20 }}
          >
            <div className="mx-auto w-full max-w-5xl px-4 py-24 md:px-6">
              <div className="mx-auto grid max-w-xs items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {userProblemSets.map((pset) => {
                  return (
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow shadow-slate-950/5">
                      <img
                        className="h-48 w-full object-cover"
                        src={pset.seed}
                        width="304"
                        height="192"
                        alt="Course 01"
                      />
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex-1">
                          <header className="mb-2">
                            <h2 className="text-xl font-extrabold leading-snug">
                              <a
                                className="text-slate-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                                href="#0"
                              >
                                {pset.problemSetName}
                              </a>
                            </h2>
                          </header>
                          <p className="mb-4">
                            {pset.public ? "💬 Public" : "🔒   Private"}
                          </p>
                          <div className="mb-8 text-sm text-slate-600">
                            <p>{pset.problemSetDescription}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <a
                            className="inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-500 transition-colors hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                            href="#0"
                          >
                            {pset.public
                              ? "Make Private"
                              : "Add to Marketplace"}
                          </a>
                          <a
                            className="inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                            href="#0"
                          >
                            Edit
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
        {userProblemSets.length <= 0 && (
          <>
            {" "}
            <Lottie
              animationData={animationdata}
              loop
              style={{ width: "16vw", marginTop: 30 }}
            />
            <p>Start practicing with the buttons above...</p>
          </>
        )}
      </div>
    </>
  );
}
