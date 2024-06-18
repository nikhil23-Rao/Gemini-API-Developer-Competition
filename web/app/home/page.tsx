"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import {
  Button,
  Checkbox,
  ListItemText,
  TextareaAutosize,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Splash } from "@/components/general/Splash";
import { getHomeScreenQuote } from "@/api/getHomeScreenQuote";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { NewModal } from "@/components/general/newModal";

export default function Dashboard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [drawingModal, setDrawingModal] = useState(false);

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
    // getHomeScreenQuote().then((res) => {
    //   setQuote(res);
    // });
  }, []);

  if (drawingModal)
    return (
      <>
        {" "}
        <NewModal modal={drawingModal} setModal={setDrawingModal}>
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
                disabled={!eraseMode}
                onClick={handlePenClick}
                variant="outlined"
              >
                <i className="fa fa-paint-brush"></i>
              </Button>
              <Button
                disabled={eraseMode}
                onClick={handleEraserClick}
                variant="outlined"
              >
                <i className="fa fa-eraser"></i>
              </Button>
              <div className="vr" />
              <Button onClick={handleUndoClick} variant="outlined">
                <i className="fa fa-undo"></i>
              </Button>
              <Button onClick={handleRedoClick} variant="outlined">
                <i className="fa fa-rotate-right"></i>
              </Button>
              <Button onClick={handleClearClick} variant="outlined">
                <i className="fa fa-minus"></i>
              </Button>
              <a href="/logo.png" download></a>
              <Button
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
                variant="outlined"
              >
                <i className="fa fa-save"></i>
              </Button>
            </div>
            <ReactSketchCanvas width="80vw" height="80vh" ref={canvasRef} />
          </div>
        </NewModal>
      </>
    );
  if (!currentUser) return <Splash />;
  return (
    <>
      <AppSidebar />
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="large-banner"
          style={{ alignItems: "flex-start", width: "75%", marginLeft: "16%" }}
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
            {currentUser?.username.split(" ").slice(0, -1).join(" ")}.
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
            "Education is the most powerful weapon which you can use to change
            the world."
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: 12,
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            ~ Nelson Mandela
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
                backgroundColor: "#2B5061",
                top: 20,
                borderRadius: 200,
              }}
              variant="contained"
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

            <li className="color-4" style={{ borderRadius: 10 }}>
              <i className="fa fa-bullseye"></i>
              <h5>New Target</h5>
              <h6>What do you want to accomplish right now?</h6>
              <i className="fa fa-pencil-square mt-4"></i>
            </li>

            <li className="color-2">
              <i className="fa fa-user"></i>
              <h5>View Profile</h5>
              <h6>Need a quick drawing? Open up a canvas.</h6>
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
              <li className="color-3" style={{ width: "100%" }}>
                <i className="fa fa-check-square"></i>
                <h5>My Tasks</h5>
                <h6>Keep track of upcoming tasks</h6>
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
                    {todos.length == 0 && <p>No todos yet. Add one below.</p>}
                    {todos.map((t, idx) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 15,
                            alignItems: "center",
                          }}
                        >
                          <ListItemText>
                            <TextareaAutosize
                              className="card-title"
                              value={t.todo}
                              style={{
                                backgroundColor: "transparent",
                                outline: "none",
                                resize: "none",
                                overflow: "hidden",
                                textDecoration: t.checked ? "line-through" : "",
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
                            style={{ color: "#fff", marginTop: -20 }}
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

              <li className="color-3" style={{ width: "100%" }}>
                <i className="fa fa-calendar mb-5"></i>
                <h5>My Calendar</h5>
                <h6>Keep track of upcoming tasks</h6>
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
                    <h1>hey</h1>
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
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
