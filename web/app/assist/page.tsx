"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { AppSidebar } from "@/components/general/Sidebar";
import {
  Button,
  CircularProgress,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import MathInput from "react-math-keyboard";

import { Splash } from "@/components/general/Splash";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  assistUserResponse,
  assistUserResponseImg,
} from "@/serversideapi/assistUserResponse";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import remarkMath from "remark-math";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import db from "@/utils/initDB";
import { getTheme } from "@/utils/getTheme";
import { getColor } from "@/utils/getColor";

export default function Assist() {
  const [imported, setImported] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showMath, setShowMath] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [selected, setSelected] = useState();
  const [messageList, setMessageList] = useState<any>([
    {
      user: "bot",
      message:
        "Hey there! Welcome to the study assist tab? Do you need help on a problem that you just took a screenshot of? Or maybe there was a problem in a problem set you found confusing? Feel free to ask for a step by step guide here!",
      id: 1,
      date: new Date(),
    },
  ]);

  const [latex, setLatex] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [userProblemSets, setUserProblemSets] = useState<any[]>([]);

  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

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
  useEffect(() => {
    console.log(messageList);
    if (typeof document !== "undefined") {
      var objDiv = document.getElementById("messageview");
      if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setName(event.target.files[0].name);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("res", reader.result);
        setImgPreview(reader.result as any);
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

  useEffect(() => {
    console.log(imported);
  }, [imported]);

  if (!theme) return <Splash></Splash>;
  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100%",
          backgroundColor: theme.backgroundColor,
        }}
        className={theme.className}
      >
        <AppSidebar
          modals={showMath}
          bg={theme.backgroundColor}
          color={theme.textColor}
        />
        {!currentUser ? (
          <>
            <Splash white={theme.backgroundColor !== "#fff"}></Splash>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginLeft: "10%",
                overflow: "hidden",
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
                  Study Assist
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
                  Welcome to the study assist chatbot! This feature allows you
                  to get help on any practice question that you see. No matter
                  the subject, you can ask our chatbot on a question for
                  anything related to problem-solving, and it will be done.
                </p>

                <div
                  style={{
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll",
                    maxWidth: "80%",
                  }}
                  id="messageview"
                >
                  {messageList.map((m) => {
                    return (
                      <div>
                        <div
                          style={{
                            padding: 20,
                            marginBottom: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <img
                              src={
                                m.user === "me"
                                  ? currentUser.pfp
                                  : "/geminilogo.png"
                              }
                              style={{
                                width: 60,
                                borderRadius: 100,
                                border: "2px solid #1F2E5D",
                              }}
                              alt=""
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 3,
                              }}
                            >
                              <p
                                style={{
                                  marginLeft: 10,
                                  color: theme.textColor,
                                }}
                              >
                                {m.user === "me"
                                  ? currentUser.username
                                  : "Vertex"}
                              </p>
                              <p
                                style={{
                                  marginLeft: 10,
                                  color: theme.textColor,
                                }}
                              >
                                {formatAMPM(m.date)}
                              </p>
                            </div>
                          </div>
                          {m.user === "me" ? (
                            <li
                              style={{
                                marginTop: 10,
                                paddingLeft: 10,
                                color: theme.textColor,
                              }}
                            >
                              {m.message}
                              {m.image && <img src={m.image}></img>}
                            </li>
                          ) : m.message.length === 0 ? (
                            <div style={{ marginTop: 20 }}>
                              <Skeleton count={5} style={{ width: "98%" }} />
                              <CircularProgress
                                size={"20px"}
                                style={{ marginTop: 10 }}
                              />{" "}
                              <p style={{ color: theme.textColor }}>
                                Response Generating...
                              </p>
                            </div>
                          ) : (
                            <>
                              <div style={{ marginTop: 20 }}>
                                <MarkdownPreview
                                  className="markdowneditorassist"
                                  source={m.message}
                                  style={{
                                    padding: 16,
                                    width: "100%",
                                    height: "100%",

                                    color: theme.textColor,
                                    backgroundColor: "transparent",
                                  }}
                                  rehypePlugins={[
                                    rehypeKatex,
                                    remarkMath,
                                    remarkGfm,
                                  ]}
                                  components={{
                                    code: ({
                                      children = [],
                                      className,
                                      ...props
                                    }) => {
                                      if (
                                        typeof children === "string" &&
                                        /^\$\$(.*)\$\$/.test(children)
                                      ) {
                                        const html = katex.renderToString(
                                          children.replace(
                                            /^\$\$(.*)\$\$/,
                                            "$1",
                                          ),
                                          {
                                            throwOnError: false,
                                          },
                                        );
                                        return (
                                          <code
                                            dangerouslySetInnerHTML={{
                                              __html: html,
                                            }}
                                            style={{
                                              background: "transparent",
                                            }}
                                          />
                                        );
                                      }
                                      const code =
                                        props.node && props.node.children
                                          ? getCodeString(props.node.children)
                                          : children;
                                      if (
                                        typeof code === "string" &&
                                        typeof className === "string" &&
                                        /^language-katex/.test(
                                          className.toLocaleLowerCase(),
                                        )
                                      ) {
                                        const html = katex.renderToString(
                                          code,
                                          {
                                            throwOnError: false,
                                          },
                                        );
                                        return (
                                          <code
                                            style={{ fontSize: "150%" }}
                                            dangerouslySetInnerHTML={{
                                              __html: html,
                                            }}
                                          />
                                        );
                                      }
                                      return (
                                        <code className={String(className)}>
                                          {children}
                                        </code>
                                      );
                                    },
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {showMath ? (
                    <>
                      <MathInput
                        label="Enter an expression..."
                        fullWidth={false}
                        style={{
                          width: "72vw",
                          borderRadius: 20,
                          resize: "none",
                          padding: 4,
                          paddingLeft: 10,
                          paddingTop: 7,
                          maxWidth: "72vw",
                          paddingBottom: 7,
                          paddingRight: 90,
                        }}
                        setValue={setLatex}
                      ></MathInput>
                      <h1
                        style={{
                          left: -70,
                          position: "relative",
                          top: 20,
                          textTransform: "uppercase",
                          color: "#1B1E60",
                          cursor: "pointer",
                        }}
                        onClick={async (e) => {
                          let oldMessages = [
                            ...messageList,
                            {
                              user: "me",
                              id: messageList.length + 1,
                              message: latex,
                              date: new Date(),
                            },
                            {
                              user: "bot",
                              id: messageList.length + 2,
                              message: "",
                              date: new Date(),
                            },
                          ];
                          setMessageList([
                            ...messageList,
                            {
                              user: "me",
                              id: messageList.length + 1,
                              message: latex,
                              date: new Date(),
                            },
                            {
                              user: "bot",
                              id: messageList.length + 2,
                              message: "",
                              date: new Date(),
                            },
                          ]);

                          setMessage("");
                          setImported("");
                          setLatex("");
                          setShowMath(false);
                          e.preventDefault();
                          const botMessage = await assistUserResponse(
                            [],
                            latex,
                          );
                          let objIndex = oldMessages.findIndex(
                            (obj) =>
                              obj.message == "" && obj.image.length === 0,
                          );
                          console.log(objIndex);
                          oldMessages[objIndex].message = botMessage;

                          setMessageList(oldMessages);
                        }}
                      >
                        Send
                      </h1>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "90%",
                        }}
                      >
                        {imported.length > 0 && (
                          <p style={{ color: theme.textColor }}>
                            File Attached: {name}
                            <i
                              className="fa fa-close ml-5"
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => {
                                setImported("");
                              }}
                            ></i>
                          </p>
                        )}
                        <TextareaAutosize
                          value={message}
                          onChange={(e) => setMessage(e.currentTarget.value)}
                          style={{
                            width: "90%",
                            borderRadius: 20,
                            resize: "none",
                            maxHeight: 70,
                            border: "2px solid #eee",
                            padding: 4,
                            paddingLeft: 10,
                            paddingTop: 7,
                            paddingBottom: 7,
                            overflowY: "scroll",
                            marginTop: 5,
                            cursor: loading ? "not-allowed" : "",
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              setLoading(true);
                              let oldMessages = [
                                ...messageList,
                                {
                                  user: "me",
                                  id: messageList.length + 1,
                                  message: message,
                                  image:
                                    imported.length > 0 ? imgPreview : null,
                                  date: new Date(),
                                },
                                {
                                  user: "bot",
                                  id: messageList.length + 2,
                                  message: "",
                                  date: new Date(),
                                },
                              ];
                              setMessageList([
                                ...messageList,
                                {
                                  user: "me",
                                  id: messageList.length + 1,
                                  message: message,
                                  image:
                                    imported.length > 0 ? imgPreview : null,
                                  date: new Date(),
                                },
                                {
                                  user: "bot",
                                  id: messageList.length + 2,
                                  message: "",
                                  date: new Date(),
                                },
                              ]);

                              setMessage("");
                              setImported("");
                              e.preventDefault();
                              let botMessage = "";
                              if (imported.length > 0) {
                                botMessage = await assistUserResponseImg(
                                  imported,
                                  message,
                                );
                              } else {
                                botMessage = await assistUserResponse(
                                  [],
                                  message,
                                );
                              }

                              if (botMessage.length > 0) {
                                let objIndex = oldMessages.findIndex(
                                  (obj) =>
                                    obj.message == "" && obj.user !== "me",
                                );
                                console.log(objIndex);
                                oldMessages[objIndex].message = botMessage;

                                setMessageList(oldMessages);
                              }
                              setLoading(false);
                            }
                          }}
                          placeholder={
                            loading
                              ? "Generating response..."
                              : "What do you need help with?"
                          }
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}
                  <div style={{ marginLeft: "-7%" }}>
                    <label htmlFor="group_image">
                      <i
                        className="fa fa-plus-circle fa-2x"
                        style={{
                          color: theme.textColor,
                          cursor: "pointer",
                          top: showMath ? 20 : 10,
                          position: "relative",
                          marginRight: 10,
                        }}
                      ></i>
                    </label>
                    <input
                      type="file"
                      onChange={onImageChange}
                      className="filetype custom-file-upload"
                      id="group_image"
                      accept="image/*"
                    />

                    {openDropdown && (
                      <div
                        style={{
                          position: "absolute",
                          height: 400,
                          width: 400,
                          border: "2px solid #eee",
                          bottom: 100,
                          right: 50,
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          zIndex: 20000,
                        }}
                      >
                        {!selected ? (
                          <>
                            <h1
                              className="text-gradient-black mt-5"
                              style={{ fontSize: "1.3vw" }}
                            >
                              My Problem Sets
                            </h1>
                            <TextField
                              className="mb-5 mt-5"
                              style={{
                                borderRadius: 400,
                                width: "70%",
                                marginTop: 10,
                                marginBottom: 10,
                              }}
                              placeholder="search through your sets..."
                            ></TextField>
                            <div
                              style={{
                                height: "60%",
                                overflowY: "scroll",
                                width: "80%",
                              }}
                            >
                              {userProblemSets.map((ps) => (
                                <li
                                  className="hover"
                                  onClick={() => {
                                    setSelected(ps);
                                  }}
                                >
                                  {ps.problemSetName}
                                </li>
                              ))}
                            </div>{" "}
                          </>
                        ) : (
                          <>
                            <i
                              className="fa fa-arrow-left fa-2x"
                              style={{
                                position: "absolute",
                                top: 20,
                                left: 20,
                                cursor: "pointer",
                              }}
                              onClick={() => setSelected(undefined)}
                            ></i>
                            <h1
                              className="text-gradient-black mt-5"
                              style={{
                                fontSize: "1.3vw",
                                position: "absolute",
                                top: 50,
                              }}
                            >
                              {(selected as any).problemSetName}
                            </h1>
                            <div
                              style={{
                                position: "absolute",
                                top: 100,
                                width: "80%",
                              }}
                            >
                              <p
                                style={{
                                  textTransform: "uppercase",
                                  letterSpacing: 1.3,
                                }}
                              >
                                Questions in set
                              </p>
                              {(
                                JSON.parse(
                                  JSON.stringify((selected as any).markdown),
                                ).response as string
                              )
                                .match(/# Question/g)
                                ?.map((q, idx) => (
                                  <li
                                    className="hover"
                                    onClick={async () => {
                                      setLoading(true);
                                      setSelected(undefined);
                                      setOpenDropdown(false);
                                      let oldMessages = [
                                        ...messageList,
                                        {
                                          user: "me",
                                          id: messageList.length + 1,
                                          message: `Help me on the ${
                                            (selected as any).problemSetName
                                          } problem set; Specifically question ${
                                            idx + 1
                                          }`,
                                          image:
                                            imported.length > 0
                                              ? imgPreview
                                              : null,
                                          date: new Date(),
                                        },
                                        {
                                          user: "bot",
                                          id: messageList.length + 2,
                                          message: "",
                                          date: new Date(),
                                        },
                                      ];
                                      setMessageList([
                                        ...messageList,
                                        {
                                          user: "me",
                                          id: messageList.length + 1,
                                          message: `Help me on the ${
                                            (selected as any).problemSetName
                                          } problem set; Specifically question ${
                                            idx + 1
                                          }`,
                                          image:
                                            imported.length > 0
                                              ? imgPreview
                                              : null,
                                          date: new Date(),
                                        },
                                        {
                                          user: "bot",
                                          id: messageList.length + 2,
                                          message: "",
                                          date: new Date(),
                                        },
                                      ]);

                                      setMessage("");
                                      setImported("");
                                      let botMessage = "";

                                      botMessage = await assistUserResponse(
                                        [],
                                        `HELP ME ON ONLY QUESTION ${
                                          idx + 1
                                        } OF THE FOLLOWING PROBLEM (WRITTEN IN MARKDOWN): ${
                                          JSON.parse(
                                            JSON.stringify(
                                              (selected as any).markdown,
                                            ),
                                          ).response
                                        }; IN YOUR RESPONSE PROVIDE THE QUESTION ASKED FOR BEFORE YOU EXPLAIN IT`,
                                      );

                                      if (botMessage.length > 0) {
                                        let objIndex = oldMessages.findIndex(
                                          (obj) =>
                                            obj.message == "" &&
                                            obj.user !== "me",
                                        );
                                        console.log(objIndex);
                                        oldMessages[objIndex].message =
                                          botMessage;

                                        setMessageList(oldMessages);
                                      }
                                      setLoading(false);
                                    }}
                                  >
                                    Help on - Question# {idx + 1}
                                  </li>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <i
                      className="fa fa-search fa-2x"
                      style={{
                        color: openDropdown ? "orange" : theme.textColor,
                        cursor: "pointer",
                        top: showMath ? 20 : 10,
                        position: "relative",
                        marginLeft: 10,
                        zIndex: 1,
                      }}
                      onClick={() => {
                        setOpenDropdown(!openDropdown);
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
