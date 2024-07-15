"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { AppSidebar } from "@/components/general/Sidebar";
import { Button, CircularProgress, TextareaAutosize } from "@mui/material";
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
import { assistUserResponse } from "@/api/assistUserResponse";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import remarkMath from "remark-math";

export default function Assist() {
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showMath, setShowMath] = useState(false);
  const [messageList, setMessageList] = useState([
    {
      user: "bot",
      message:
        "Hey there! Welcome to the study assist tab? Do you need help on a problem that you just took a screenshot of? Or maybe there was a problem in a problem set you found confusing? Feel free to ask for a step by step guide here!",
      id: 1,
    },
  ]);

  const [latex, setLatex] = useState("");

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    console.log(messageList);
    if (typeof document !== "undefined") {
      var objDiv = document.getElementById("messageview");
      if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [messageList]);

  return (
    <>
      <AppSidebar modals={showMath} />
      {!currentUser ? (
        <>
          <Splash></Splash>
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
                Welcome to the study assist chatbot! This feature allows you to
                get help on any practice question that you see. No matter the
                subject, you can ask our chatbot on a question for anything
                related to problem-solving, and it will be done.
              </p>

              <div
                style={{
                  height: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                }}
                id="messageview"
              >
                {messageList.map((m) => {
                  return (
                    <li>
                      <div
                        style={{
                          width: "80vw",
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
                            <p style={{ marginLeft: 10 }}>
                              {m.user === "me"
                                ? currentUser.username
                                : "Vertex"}
                            </p>
                            <p style={{ marginLeft: 10 }}>11:23 AM</p>
                          </div>
                        </div>
                        {m.user === "me" ? (
                          <li style={{ marginTop: 10, paddingLeft: 10 }}>
                            {m.message}
                          </li>
                        ) : m.message.length === 0 ? (
                          <div style={{ marginTop: 20 }}>
                            <Skeleton count={5} style={{ width: "98%" }} />
                            <CircularProgress
                              size={"20px"}
                              style={{ marginTop: 10 }}
                            />{" "}
                            <p>Response Generating...</p>
                          </div>
                        ) : (
                          <>
                            <li style={{ marginTop: 20 }}>
                              <MarkdownPreview
                                className="markdowneditorassist"
                                source={m.message}
                                style={{
                                  padding: 16,
                                  width: "100%",
                                  height: "100%",
                                  color: "#000",
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
                                        children.replace(/^\$\$(.*)\$\$/, "$1"),
                                        {
                                          throwOnError: false,
                                        },
                                      );
                                      return (
                                        <code
                                          dangerouslySetInnerHTML={{
                                            __html: html,
                                          }}
                                          style={{ background: "transparent" }}
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
                                      const html = katex.renderToString(code, {
                                        throwOnError: false,
                                      });
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
                            </li>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </div>
              <div
                style={{
                  width: "100%",
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
                    >
                      Send
                    </h1>
                  </>
                ) : (
                  <TextareaAutosize
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    style={{
                      width: "90%",
                      borderRadius: 20,
                      resize: "none",
                      maxHeight: 200,
                      border: "2px solid #eee",
                      padding: 4,
                      paddingLeft: 10,
                      paddingTop: 7,
                      paddingBottom: 7,
                      overflowY: "scroll",
                      marginTop: 5,
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        let oldMessages = [
                          ...messageList,
                          {
                            user: "me",
                            id: messageList.length + 1,
                            message: message,
                          },
                          {
                            user: "bot",
                            id: messageList.length + 2,
                            message: "",
                          },
                        ];
                        setMessageList([
                          ...messageList,
                          {
                            user: "me",
                            id: messageList.length + 1,
                            message: message,
                          },
                          {
                            user: "bot",
                            id: messageList.length + 2,
                            message: "",
                          },
                        ]);

                        setMessage("");
                        e.preventDefault();
                        const botMessage = await assistUserResponse(
                          [],
                          message,
                        );
                        let objIndex = oldMessages.findIndex(
                          (obj) => obj.message == "",
                        );
                        console.log(objIndex);
                        oldMessages[objIndex].message = botMessage;

                        setMessageList(oldMessages);
                      }
                    }}
                    placeholder="What do you need help with?"
                  />
                )}

                <i
                  className="fa fa-plus-circle fa-2x"
                  style={{
                    color: "#201C57",
                    cursor: "pointer",
                    marginLeft: 10,
                    top: showMath ? 20 : 10,
                    position: "relative",
                  }}
                ></i>
                <i
                  className="fa fa-calculator fa-2x"
                  style={{
                    color: showMath ? "orange" : "#201C57",
                    cursor: "pointer",
                    marginLeft: 10,
                    top: showMath ? 20 : 10,
                    position: "relative",
                  }}
                  onClick={() => setShowMath(!showMath)}
                ></i>
                <i
                  className="fa fa-search fa-2x"
                  style={{
                    color: "#201C57",
                    cursor: "pointer",
                    marginLeft: 10,
                    top: showMath ? 20 : 10,
                    position: "relative",
                  }}
                ></i>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
