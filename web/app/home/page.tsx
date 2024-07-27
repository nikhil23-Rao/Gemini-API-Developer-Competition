"use client";

// data:image/jpeg;base64,
import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import { Resizable } from "react-resizable";

import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Splash } from "@/components/general/Splash";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { NewModal } from "@/components/general/newModal";
import { HexColorPicker } from "react-colorful";
import { motion } from "framer-motion";
import Draggable from "react-draggable";
import { Calculator } from "@/components/focus/Calculator";
import { Timer } from "@/components/focus/Timer";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import db from "@/utils/initDB";
import { getTheme } from "@/utils/getTheme";
import { quotes } from "@/serversideapi/quotes";
import ApiCalendar from "react-google-calendar-api";
import { getColor } from "@/utils/getColor";

export default function Dashboard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [chosenClass, setChosenClass] = useState("");
  const [target, setTarget] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [drawingModal, setDrawingModal] = useState(false);
  const [showDesmos, setShowDesmos] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [hexColor, setHexColor] = useState("#000000");
  const [img, setImg] = useState("");
  const [showFolders, setShowFolders] = useState(false);
  const [folderData, setFolderData] = useState<any[]>([]);
  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();
  const [time, setTime] = useState<Date>();
  const [imgPreview, setImgPreview] = useState("");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [matra, setMatra] = useState({ quote: "", author: "" });

  useEffect(() => {
    setMatra({
      author: quotes[Math.floor(Math.random() * quotes.length)].author,
      quote: quotes[Math.floor(Math.random() * quotes.length)].quote,
    });
  }, []);

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // google calendar stuff

  const onResize = (event, { node, size, handle }) => {
    this.setState({ width: size.width, height: size.height });
  };

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("res", reader.result);
        setImgPreview(reader.result as any);
        const base64String = (reader.result as string)
          .replace("data:", "")
          .replace(/^.+,/, "");
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  function ordinal_suffix_of(i) {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  const [currentUser, setCurrentUser] = useState<User | null>();
  const [quote, setQuote] = useState("");
  const nodeRef = useRef(null);

  const [todos, setTodos] = useState<
    Array<{ todo: string; checked: boolean; idx: number }>
  >([]);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (img.length === 0) {
      axios
        .get(
          "https://api.api-ninjas.com/v1/randomimage?category=city&x-api-key=" +
            process.env.NEXT_PUBLIC_API_KEY_IMG,
        )
        .then((res) => {
          setImg("data:image/png;base64," + res.data);
        });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log("Updating target...");
      setTarget(currentUser.target?.text as string);
      setChosenClass(currentUser.target?.chosenClass as string);
    }
  }, [typeof currentUser]);

  useEffect(() => {
    if (currentUser) {
      let flashcardFolder: any[] = [];
      let problemSetFolder: any[] = [];
      const q = query(
        collection(db, "flashcards"),
        where("savedToFolder", "array-contains", currentUser.docid),
      );
      const q1 = query(
        collection(db, "problemsets"),
        where("savedToFolder", "array-contains", currentUser.docid),
      );
      getDocs(q).then((res) => {
        if (!res) return;
        res.forEach((doc) => {
          flashcardFolder.push({
            type: "flashcard",
            name: doc.data().cardsetName,
            docid: doc.data().docid,
            class: doc.data().class,
          });
        });
        setFolderData([...folderData, ...flashcardFolder]);
      });

      getDocs(q1).then((res) => {
        if (!res) return;
        res.forEach((doc) => {
          problemSetFolder.push({
            type: "problemset",
            name: doc.data().problemSetName,
            docid: doc.data().docid,
            class: doc.data().chosenClass,
          });
        });
        setFolderData([...folderData, ...flashcardFolder, ...problemSetFolder]);
      });
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (apiCalendar)
  // }, [typeof apiCalendar]);

  function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;

    const timeString = `${hours}:${minutes}:${secondsRemaining}`;

    return timeString;
  }

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  if (focusMode) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          animate={{ scale: [0.95, 1] }}
          style={{
            backgroundColor: "#000",
            width: "100vw",
            height: "100vh",
            background: `url("${img}") no-repeat center center fixed`,
            backgroundSize: "cover",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: -1,
            backgroundPosition: "0px",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 40,
              zIndex: 40000000,
              position: "absolute",
              top: -20,
              left: 20,
            }}
          >
            <Button
              variant="contained"
              style={{ marginRight: 10 }}
              color={showCalculator ? "success" : "primary"}
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <i className="fa fa-calculator fa-2x"></i>
            </Button>

            <Button
              variant="contained"
              style={{ marginRight: 10 }}
              color={showDesmos ? "success" : "primary"}
              onClick={() => setShowDesmos(!showDesmos)}
            >
              <i className="fa fa-line-chart fa-2x"></i>
            </Button>

            <Button variant="contained" style={{ marginRight: 10 }}>
              <i className="fa fa-check-circle fa-2x"></i>
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                axios
                  .get(
                    "https://api.api-ninjas.com/v1/randomimage?category=city&x-api-key=" +
                      process.env.NEXT_PUBLIC_API_KEY_IMG,
                  )
                  .then((res) => {
                    setImg("data:image/png;base64," + res.data);
                  });
              }}
            >
              <i className="fa fa-image fa-2x"></i>
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)",
              height: "100%",
              width: "100%",
            }}
          >
            <div style={{ position: "absolute", top: 40 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <div className="glass" style={{ padding: 50 }}>
                  <h1
                    className="text-gradient-clock"
                    style={{ fontSize: "6vw", fontFamily: "" }}
                  >
                    {formatAMPM(time)}
                  </h1>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -650,
                  }}
                >
                  {showCalculator && <Calculator></Calculator>}
                  {showDesmos && (
                    <Draggable onStart={() => console.log("drag")}>
                      <div
                        style={{
                          width: 700,
                          height: 400,
                          padding: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "grab",
                          resize: "both",
                        }}
                      >
                        <iframe
                          src="https://www.desmos.com/calculator/"
                          style={{
                            width: "100%",
                            height: 350,
                            borderRadius: 20,
                          }}
                        ></iframe>
                      </div>
                    </Draggable>
                  )}
                </div>
                <Timer></Timer>
                <Button
                  variant="contained"
                  style={{ marginTop: 50 }}
                  color="error"
                  onClick={() => setFocusMode(false)}
                >
                  Exit Focus Mode
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  if (drawingModal)
    return (
      <>
        {" "}
        <NewModal
          modal={drawingModal}
          bg={theme.backgroundColor}
          setModal={setDrawingModal}
        >
          {showColorPicker && (
            <HexColorPicker
              onChange={setHexColor}
              style={{
                position: "absolute",
                top: 160,
                right: 850,
                zIndex: 100,
              }}
            />
          )}
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              marginTop: 100,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                style={{ marginRight: 10 }}
                disabled={!eraseMode}
                onClick={handlePenClick}
                variant="contained"
              >
                <i className="fa fa-paint-brush"></i>
              </Button>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                variant="contained"
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: hexColor,
                    cursor: "pointer",
                  }}
                ></div>
              </Button>
              <Button
                disabled={eraseMode}
                onClick={handleEraserClick}
                style={{ marginRight: 10 }}
                variant="contained"
              >
                <i className="fa fa-eraser"></i>
              </Button>
              <div className="vr" />
              <Button
                style={{ marginRight: 10 }}
                onClick={handleUndoClick}
                variant="contained"
              >
                <i className="fa fa-undo"></i>
              </Button>
              <Button
                style={{ marginRight: 10 }}
                onClick={handleRedoClick}
                variant="contained"
              >
                <i className="fa fa-rotate-right"></i>
              </Button>
              <Button
                style={{ marginRight: 10 }}
                onClick={handleClearClick}
                variant="contained"
              >
                <i className="fa fa-minus"></i>
              </Button>
              <Button style={{ marginRight: 10 }} variant="contained">
                <label htmlFor="group_image">
                  <i
                    className="fa fa-plus-circle"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                    }}
                  ></i>
                </label>
              </Button>
              <input
                type="file"
                onChange={onImageChange}
                className="filetype custom-file-upload"
                id="group_image"
                accept="image/*"
              />

              <a href="/logo.png" download></a>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  async function saveBase64Image(base64Url, filename) {
                    try {
                      // Fetch the image data
                      const response = await fetch(base64Url);
                      const blob = await response.blob();

                      // Create a URL for the Blob
                      const blobUrl = URL.createObjectURL(blob);

                      // Create an anchor element to download
                      const link = document.createElement("a");
                      link.href = blobUrl;
                      link.download = filename; // Set the desired filename

                      // Simulate a click to trigger the download
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (error) {
                      console.error("Error saving image:", error);
                      // Handle the error (e.g., show an error message to the user)
                    }
                  }

                  function saveFile() {
                    // Create a Blob object containing the data to be saved.

                    canvasRef.current?.exportImage("png").then((data) => {
                      saveBase64Image(data, "vertexwhiteboard.png");
                    });
                  }

                  saveFile();
                }}
                variant="contained"
              >
                <i className="fa fa-save"></i>
              </Button>
            </div>
            {imgPreview.length > 0 && (
              <Draggable>
                <img
                  src={imgPreview}
                  style={{
                    zoom: 0.9,
                    position: "absolute",
                    cursor: "pointer",
                  }}
                  onClick={() => {}}
                  draggable={false}
                />
              </Draggable>
            )}
            <ReactSketchCanvas
              id="hey"
              width="80vw"
              height="80vh"
              ref={canvasRef}
              strokeColor={hexColor}
            />
          </div>
        </NewModal>
      </>
    );
  if (!theme) return <Splash></Splash>;
  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.backgroundColor,
        }}
        className={theme.className}
      >
        <AppSidebar
          modals={showFolders || showTarget}
          bg={theme.backgroundColor}
          color={theme.textColor}
        />
        {!currentUser ? (
          <>
            <div
              style={{
                marginLeft: "10%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Splash white={theme.backgroundColor !== "#fff"}></Splash>
            </div>
          </>
        ) : (
          <>
            <Modal
              open={showTarget}
              styles={{
                modal: {
                  width: "50%",
                  height: "70%",
                },
              }}
              onClose={() => {
                setShowTarget(false);
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1
                  className="text-gradient-black"
                  style={{ fontSize: "2vw", marginTop: 15 }}
                >
                  Target
                </h1>
                <p
                  style={{ textAlign: "center", maxWidth: 600, marginTop: 20 }}
                >
                  Set a focus for yourself for the next education session. Enter
                  any types of problems u want to tackle, or any classes you
                  want to focus on.
                </p>
                <FormControl
                  style={{ width: 400, marginTop: 60, marginBottom: 20 }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Class Related To
                  </InputLabel>
                  <Select
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
                <TextareaAutosize
                  id="outlined-basic"
                  placeholder="What do you want to focus on?"
                  value={target}
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
                    setTarget(e.currentTarget.value);
                  }}
                />
                <Button
                  variant="contained"
                  style={{ marginTop: 50 }}
                  className="mt-5"
                  color="success"
                  onClick={() => {
                    updateDoc(doc(db, "users", currentUser.docid), {
                      target: {
                        text: target,
                        chosenClass,
                      },
                    });

                    setShowTarget(false);
                  }}
                >
                  Update Target
                </Button>
              </div>
            </Modal>
            <Modal
              open={showFolders}
              styles={{
                modal: {
                  width: "50%",
                  height: "80%",
                },
              }}
              onClose={() => {
                setShowFolders(false);
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1
                  className="text-gradient-black"
                  style={{ fontSize: "2vw", marginTop: 15 }}
                >
                  My Folders
                </h1>
                <p
                  style={{ textAlign: "center", maxWidth: 600, marginTop: 20 }}
                >
                  Access all your generated and saved content through your
                  folders. One for every single one of your selected classes.
                </p>
                <SimpleTreeView style={{ fontSize: 20 }}>
                  {currentUser.selectedClasses.map((c, idx) => (
                    <TreeItem
                      itemId={`c-${idx.toString()}`}
                      label={c}
                      style={{
                        width: "40vw",
                        marginTop: 20,
                        fontWeight: "bold",
                        color: "#172B69",
                        border: "1px solid #eee",
                        borderRadius: 10,
                        padding: 15,
                        outline: "none",
                      }}
                    >
                      {folderData.map((d) => (
                        <>
                          {d.class !== c ? (
                            <></>
                          ) : (
                            <TreeItem
                              itemId={`c-${idx.toString()}-${
                                Math.random() * 1000000000000
                              }`}
                              label={
                                <>
                                  <a
                                    href={
                                      d.type === "flashcard"
                                        ? `/fc/${d.docid}`
                                        : `/ps/${d.docid}`
                                    }
                                    target="_blank"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <i
                                      className={`${
                                        d.type === "flashcard"
                                          ? "fa fa-pencil-square"
                                          : "fa fa-question-circle"
                                      } mt-1`}
                                    ></i>
                                    <p style={{ marginLeft: 10 }}>{d.name}</p>
                                  </a>
                                </>
                              }
                              style={{ borderRadius: 0 }}
                            />
                          )}
                        </>
                      ))}
                    </TreeItem>
                  ))}
                </SimpleTreeView>
              </div>
            </Modal>
            <motion.div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
              initial={{ opacity: 0.9 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              animate={{ scale: [0.85, 1] }}
            >
              <div
                className={`large-banner ${
                  color !== "white" ? color : "default"
                }`}
                style={{
                  alignItems: "flex-start",
                  width: "75%",
                  marginLeft: "16%",
                }}
              >
                <p style={{ fontWeight: "bold", color: "#fff" }}>
                  <i className="fa fa-calendar mb-5 mr-2"></i>{" "}
                  {new Date().toLocaleString("default", { month: "long" }) +
                    "\n" +
                    ordinal_suffix_of(new Date().getDate().toLocaleString()) +
                    ", \n" +
                    new Date().getFullYear()}
                </p>
                <h2 style={{ fontWeight: "bold" }}>
                  Welcome back,{" "}
                  {currentUser.username.includes(" ")
                    ? currentUser?.username.split(" ").slice(0, -1).join(" ")
                    : currentUser.username}
                  .
                </h2>
                <img
                  src="/intro.png"
                  style={{
                    position: "absolute",
                    zIndex: -1,
                    width: 240,
                    top: 20,
                    right: 40,
                    opacity: 0.5,
                  }}
                  alt=""
                />
                <p
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontStyle: "italic",
                    fontWeight: "bold",
                  }}
                >
                  {matra.quote}
                </p>
                <p
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontStyle: "italic",
                    fontWeight: "bold",
                  }}
                >
                  ~ {matra.author}
                </p>
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <Button
                    style={{
                      color: "#fff",
                      backgroundColor: "#282a2b",
                      top: 20,
                      borderRadius: 200,
                    }}
                    variant="contained"
                    onClick={() => setFocusMode(true)}
                  >
                    Enter Focus Mode
                  </Button>
                </div>
              </div>
              <div
                className="main-dash"
                style={{ marginLeft: "16%", marginBottom: 0, width: "75%" }}
              >
                <ul className="infographic-cards" style={{ marginTop: 50 }}>
                  <li className="color-1" onClick={() => setDrawingModal(true)}>
                    <i className="fa fa-paint-brush"></i>
                    <h5>New Whiteboard</h5>
                    <h6>Need a quick drawing? Open up a canvas.</h6>
                    <i className="fa fa-plus-circle mt-4"></i>
                  </li>

                  <li
                    className="color-4"
                    style={{ borderRadius: 10, boxShadow: "none" }}
                    onClick={() => setShowTarget(true)}
                  >
                    <i className="fa fa-bullseye"></i>
                    <h5>New Target</h5>
                    <h6>What do you want to accomplish right now?</h6>
                    <i className="fa fa-pencil-square mt-4"></i>
                  </li>

                  <li className="color-2" onClick={() => setShowFolders(true)}>
                    <i className="fa fa-folder"></i>
                    <h5>My Folders</h5>
                    <h6>See saved generation for classes.</h6>
                    <i className="fa fa-arrow-circle-right mt-4"></i>
                  </li>
                </ul>
              </div>

              <div
                style={{
                  marginLeft: "16%",
                  marginTop: 40,
                }}
              >
                <div className="main-dash container">
                  <ul className="infographic-cards" style={{ width: "100%" }}>
                    <li
                      className="color-3 suzy"
                      style={{
                        width: "100%",
                        minWidth: 500,
                        overflowY: "scroll",
                        maxHeight: 400,
                      }}
                    >
                      <i className="fa fa-check-square"></i>
                      <h5>Today's Tasks</h5>
                      <h6>Keep track of upcoming tasks</h6>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 15,
                            alignItems: "center",
                          }}
                        >
                          {todos.length == 0 && (
                            <p>No todos yet. Add one below.</p>
                          )}

                          {todos.map((t, idx) => (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  border: "2px solid #fff",
                                  borderRadius: 105,
                                  paddingTop: 25,
                                  paddingLeft: 40,
                                  marginBottom: 45,
                                  paddingRight: 40,
                                  backgroundColor: "#fff",
                                  maxWidth: "100%",
                                }}
                              >
                                <ListItemText style={{ color: "#000" }}>
                                  <TextareaAutosize
                                    className="card-title"
                                    value={t.todo}
                                    style={{
                                      backgroundColor: "transparent",
                                      outline: "none",
                                      resize: "none",
                                      overflow: "hidden",
                                      textDecoration: t.checked
                                        ? "line-through"
                                        : "",
                                    }}
                                    maxRows={1}
                                    onChange={(e) => {
                                      let oldTodos = [...todos];
                                      const target: any = todos.find(
                                        (c) => c.idx === idx,
                                      );

                                      const newTodo = {
                                        todo: e.target.value,
                                        checked: t.checked,
                                        idx,
                                      };

                                      Object.assign(target, newTodo);

                                      setTodos([...todos]);
                                    }}
                                  ></TextareaAutosize>
                                </ListItemText>
                                <Checkbox
                                  checked={t.checked}
                                  color="success"
                                  onClick={() => {
                                    let oldTodos = [...todos];
                                    const target: any = todos.find(
                                      (c) => c.idx === idx,
                                    );

                                    const newTodo = {
                                      todo: t.todo,
                                      checked: !t.checked,
                                      idx,
                                    };

                                    Object.assign(target, newTodo);

                                    setTodos([...todos]);
                                  }}
                                  style={{
                                    color: "#000",
                                    marginTop: -20,
                                    borderRadius: 100,
                                  }}
                                />
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                      <i
                        className="fa fa-plus-circle mt-4"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          let oldTodos = [...todos];
                          oldTodos.push({
                            todo: "New todo",
                            checked: false,
                            idx: oldTodos.length,
                          });
                          setTodos(oldTodos);
                        }}
                      ></i>
                    </li>
                    <li
                      className="color-3 "
                      style={{
                        height: 400,
                        width: "100%",
                        overflowY: "scroll",
                        minWidth: 500,
                      }}
                    >
                      <i className="fa fa-bar-chart"></i>
                      <h5>My Courses</h5>
                      <h6>Courses you are enrolled in</h6>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 15,
                            alignItems: "center",
                          }}
                        >
                          {currentUser.selectedClasses.map((c, idx) => (
                            <>
                              <div
                                className="hover"
                                style={{
                                  backgroundColor: "#fff",
                                  padding: 20,
                                  width: 300,
                                  borderRadius: 10,
                                  marginTop: 10,
                                }}
                              >
                                <h1 style={{ color: "#000" }}>{c}</h1>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: theme.backgroundColor,
            position: "relative",
            top: 20,
            width: "100%",
          }}
          className={theme.className}
        >
          <p
            style={{
              fontSize: 24,
              marginTop: 22,
              marginRight: -125,
              color: "gray",
              fontWeight: "bold",
              letterSpacing: 1.9,
              textTransform: "uppercase",
              marginLeft: "45%",
            }}
          >
            Powered by
          </p>
          <img
            src="/geminitrans.png"
            style={{
              zoom: 0.4,
              left: 10,
              position: "relative",
              marginTop: -195,
            }}
            alt=""
          />
        </div>
      </div>
    </>
  );
}
