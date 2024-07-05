"use client";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tabs,
  TextareaAutosize,
} from "@mui/material";
import "../../globals.css";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import db from "@/utils/initDB";
import { Splash } from "@/components/general/Splash";
import ProgressBar from "@ramonak/react-progress-bar";
import { NewModal } from "@/components/general/newModal";

import generatePDF from "react-to-pdf";
import { User } from "@/types/auth/User";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import remarkMath from "remark-math";

import MarkdownPreview from "@uiw/react-markdown-preview";

import { setUser } from "@/utils/getCurrentUser";
import React from "react";
import ComponentTab from "@/components/general/Tabs";

export default function ProblemSetViewer({
  params,
}: {
  params: { id: string };
}) {
  const targetRef = useRef();

  const [ps, setPs] = useState<any>();
  const [checkedQuestions, setCheckedQuestions] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [comments, setComments] = useState<any[]>([]);
  const [numQuestions, setNumQuestions] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [height, setHeight] = useState(false);
  const [showAnsKey, setShowAnsKey] = useState(false);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (showQuiz) {
      let arr: any = [];
      (JSON.parse(JSON.stringify(ps.markdown)).response as string)
        .match(/# Question/g)
        ?.forEach((v, idx) => {
          console.log(v);
          arr.push(`Question# ${idx + 1}`);
        });
      setNumQuestions(arr);
    }
  }, [ps, showQuiz]);

  useEffect(() => {
    if (params.id) {
      const q = query(
        collection(db, "discussions"),
        where("id", "==", params.id),
      );

      let duplicate = false;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let createdSets: any = [];
        snapshot.docs.forEach((doc) => {
          comments.map((set) => {
            if (set.seed === doc.data().seed) duplicate = true;
          });
          if (duplicate) return;
          // if (userFlashCardSets.includes(doc.data())) return;
          else {
            createdSets.push(doc.data());
            setComments(createdSets);
            console.log(createdSets);
            duplicate = false;
          }
        });
      });
    }
  }, [params.id]);

  function test(n) {
    if (n < 0) return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    let single_digit = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    let double_digit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    let below_hundred = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (n === 0) return "Zero";

    // Recursive function to translate the number into words
    function translate(n) {
      let word = "";
      if (n < 10) {
        word = single_digit[n] + " ";
      } else if (n < 20) {
        word = double_digit[n - 10] + " ";
      } else if (n < 100) {
        let rem = translate(n % 10);
        word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem;
      } else if (n < 1000) {
        word =
          single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100);
      } else if (n < 1000000) {
        word =
          translate(parseInt((n / 1000) as any)).trim() +
          " Thousand " +
          translate(n % 1000);
      } else if (n < 1000000000) {
        word =
          translate(parseInt((n / 1000000) as any)).trim() +
          " Million " +
          translate(n % 1000000);
      } else {
        word =
          translate(parseInt((n / 1000000000) as any)).trim() +
          " Billion " +
          translate(n % 1000000000);
      }
      return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim().toLowerCase();
  }

  useEffect(() => {
    const q = query(
      collection(db, "problemsets"),
      where("docid", "==", params.id),
    );
    if (params.id) {
      console.log("hey");
      getDocs(q).then((res) => setPs(res.docs[0].data()));
    }
    console.log(test(2));
  }, [params.id]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  if (showQuiz) {
    if (ps.type === "FRQ") {
      return (
        <>
          <NewModal modal={showQuiz} setModal={setShowQuiz}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <h1
                  className="text-gradient-black"
                  style={{ fontSize: "4vw", marginTop: "3%" }}
                >
                  {ps.problemSetName}
                </h1>
                <p style={{ marginTop: 40, maxWidth: "65%" }}>
                  {ps.problemSetDescription}
                </p>
                <Button
                  variant="outlined"
                  color="error"
                  style={{ marginTop: 20 }}
                  onClick={() => setShowQuiz(false)}
                >
                  Exit Quiz
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  style={{ marginTop: 20 }}
                  onClick={() => setShowQuiz(false)}
                >
                  Show Answer Key
                </Button>

                <Button
                  variant="outlined"
                  style={{ marginTop: 20 }}
                  onClick={() => generatePDF(targetRef, { filename: "ye.pdf" })}
                >
                  Print Out As Worksheet
                </Button>

                <Box mt={5}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={(e, value) => {
                        setTabValue(value);
                      }}
                      aria-label="basic tabs example"
                    >
                      {["Write Out", "Drawing Board"].map((obj, idx) => (
                        <ComponentTab t={obj} idx={idx} />
                      ))}
                    </Tabs>
                  </Box>
                </Box>
                {tabValue === 0 ? (
                  <>
                    <TextareaAutosize
                      style={{
                        width: "80%",
                        maxHeight: "900px",
                        minHeight: 400,
                        overflowY: "scroll",
                        border: "2px solid #eee",
                        resize: "none",
                        marginTop: 20,
                      }}
                    ></TextareaAutosize>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div
                style={{
                  width: 20,
                  borderRight: "2px solid #eee",
                }}
              ></div>

              <div ref={targetRef as any} style={{ width: "50%" }}>
                <h1
                  style={{
                    top: 20,
                    right: 70,
                    position: "absolute",
                    color: "#182264",
                    fontWeight: "bold",
                  }}
                >
                  Generated by Vertex
                </h1>
                <img
                  src="/logo.png"
                  style={{
                    position: "absolute",
                    width: 40,
                    top: 10,
                    right: 20,
                  }}
                  alt=""
                />
                <MarkdownPreview
                  className="markdowneditor"
                  source={`${JSON.parse(JSON.stringify(ps.markdown)).response}`}
                  style={{
                    padding: 16,
                    width: "100%",
                    height: "100%",
                    minHeight: "100vh",
                    backgroundColor: "#fff",
                    color: "#000",
                  }}
                  rehypePlugins={[rehypeKatex, remarkMath, remarkGfm]}
                  components={{
                    code: ({ children = [], className, ...props }) => {
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
                            dangerouslySetInnerHTML={{ __html: html }}
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
                        /^language-katex/.test(className.toLocaleLowerCase())
                      ) {
                        const html = katex.renderToString(code, {
                          throwOnError: false,
                        });
                        return (
                          <code
                            style={{ fontSize: "150%" }}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        );
                      }
                      return (
                        <code className={String(className)}>{children}</code>
                      );
                    },
                  }}
                />
              </div>
            </div>
          </NewModal>
        </>
      );
    } else
      return (
        <>
          <NewModal modal={showQuiz} setModal={setShowQuiz} overflow={"hidden"}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  maxHeight: "100vh",
                  overflowY: "scroll",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    marginTop: 45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <h1
                    className="text-gradient-black"
                    style={{ fontSize: "4vw" }}
                  >
                    {ps.problemSetName}
                  </h1>
                  <p style={{ marginTop: 40, maxWidth: "65%" }}>
                    {ps.problemSetDescription}
                  </p>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginTop: 20 }}
                    onClick={() => setShowQuiz(false)}
                  >
                    Exit Quiz
                  </Button>

                  <Button
                    variant="outlined"
                    color="success"
                    style={{ marginTop: 20 }}
                    onClick={() => setShowAnsKey(!showAnsKey)}
                  >
                    {showAnsKey ? "Hide Answer Key" : "Show Answer Key"}
                  </Button>

                  <Button
                    variant="outlined"
                    style={{ marginTop: 20 }}
                    onClick={async () => {
                      setHeight(true);
                      setTimeout(async () => {
                        generatePDF(targetRef, { filename: "ye.pdf" });
                        setHeight(false);
                      }, 500);
                    }}
                  >
                    Print Out As Worksheet
                  </Button>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: 45,
                  }}
                >
                  <p
                    className="text-gradient-black"
                    style={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Answer Sheet (NOT ALL MAY BE USED)
                  </p>
                  {numQuestions.map((q) => (
                    <FormControl style={{ marginTop: 20 }}>
                      <FormLabel
                        id="demo-radio-buttons-group-label"
                        style={{ fontWeight: "bold", fontSize: 22 }}
                      >
                        {q}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        style={{ marginTop: 20 }}
                      >
                        {[
                          "Option A",
                          "Option B",
                          "Option C",
                          "Option D",
                          "Option E",
                        ].map((o) => (
                          <FormControlLabel
                            value={o}
                            control={<Radio />}
                            label={o}
                            style={{
                              border: "2px solid #eee",
                              borderRadius: 100,
                              marginBottom: 20,
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  ))}
                  <Button
                    variant="contained"
                    color="success"
                    style={{
                      marginTop: 20,
                      marginBottom: 40,
                      borderRadius: 100,
                    }}
                    onClick={async () => {
                      setShowAnsKey(true);
                    }}
                  >
                    See Answers
                  </Button>
                </div>
              </div>
              <div
                style={{
                  width: 20,
                  borderRight: "2px solid #eee",
                }}
              ></div>

              <div
                ref={targetRef as any}
                style={{
                  width: "50%",
                  overflowY: "scroll",
                  height: "100%",
                  maxHeight: !height ? "100vh" : "",
                  minWidth: "50vw",
                  overflowX: "hidden",
                }}
              >
                <div>
                  <h1
                    style={{
                      top: 20,
                      right: 70,
                      position: "absolute",
                      color: "#182264",
                      fontWeight: "bold",
                    }}
                  >
                    Generated by Vertex
                  </h1>
                  <img
                    src="/logo.png"
                    style={{
                      position: "absolute",
                      width: 40,
                      top: 10,
                      right: 20,
                    }}
                    alt=""
                  />
                  <MarkdownPreview
                    className="markdowneditor"
                    source={`${
                      !showAnsKey
                        ? JSON.parse(
                            JSON.stringify(ps.markdown),
                          ).response.slice(
                            0,
                            JSON.parse(
                              JSON.stringify(ps.markdown),
                            ).response.indexOf("## Answer Explanations"),
                          )
                        : JSON.parse(JSON.stringify(ps.markdown)).response
                    }`}
                    style={{
                      padding: 16,
                      width: "100%",
                      height: "100%",
                      minHeight: "100vh",
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                    rehypePlugins={[rehypeKatex, remarkMath, remarkGfm]}
                    components={{
                      code: ({ children = [], className, ...props }) => {
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
                              dangerouslySetInnerHTML={{ __html: html }}
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
                          /^language-katex/.test(className.toLocaleLowerCase())
                        ) {
                          const html = katex.renderToString(code, {
                            throwOnError: false,
                          });
                          return (
                            <code
                              style={{ fontSize: "150%" }}
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          );
                        }
                        return (
                          <code className={String(className)}>{children}</code>
                        );
                      },
                    }}
                  />
                  <div
                    style={{
                      width: "70vw",
                      backgroundColor: "#fff",
                      height: 1,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </NewModal>
        </>
      );
  }

  if (!ps || !currentUser) return <Splash></Splash>;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="header">
          <a
            className="fa fa-home fa-2x"
            style={{
              color: "#fff",
              position: "absolute",
              top: 40,
              left: 40,
              zIndex: 1000000,
              fontSize: 22,
            }}
            href="/questiongenerate"
          >
            Back
          </a>
          <div
            className="inner-header myflex"
            style={{ flexDirection: "column" }}
          >
            <h1
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                top: -50,
                position: "relative",
              }}
            >
              {ps.chosenClass}
            </h1>
            <h1
              style={{
                fontSize: "4vw",
                fontWeight: "bold",
                maxWidth: "80%",
              }}
            >
              {ps.problemSetName}
            </h1>
            <p style={{ marginTop: 40, color: "lightgray", maxWidth: "40%" }}>
              {ps.problemSetDescription}
            </p>
            <Button
              style={{ backgroundColor: "#fff", color: "#000", marginTop: 40 }}
              onClick={() => {
                setShowQuiz(true);
              }}
            >
              Start Problem Set
            </Button>
          </div>
          <div>
            <svg
              className="waves"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shape-rendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="parallax">
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="0"
                  fill="rgba(255,255,255,0.7"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(255,255,255,0.5)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(255,255,255,0.3)"
                />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          marginBottom: 50,
        }}
      >
        <h1
          style={{
            marginTop: 40,
            fontWeight: "bold",
            fontSize: "2vw",
            color: "#000",
            textAlign: "center",
            zIndex: 1000,
          }}
          className="text-gradient-black"
        >
          Discussion Thread
        </h1>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <img
            src={currentUser.pfp}
            style={{
              borderRadius: 100,
              width: 40,
              border: "2px solid #48769D",
            }}
            alt=""
            className="mr-3"
          />
          <TextareaAutosize
            style={{
              width: "40%",
              border: "1px solid #eee",
              paddingLeft: 25,
              padding: 15,
              resize: "none",
              borderRadius: 10,
            }}
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            placeholder="Add to the discussion..."
          ></TextareaAutosize>
          <Button
            variant="contained"
            style={{ marginLeft: 20 }}
            onClick={async () => {
              if (commentText.replace(/\s/g, "").length > 0) {
                const docid = await addDoc(collection(db, "discussions"), {
                  createdById: currentUser?.id,
                  createdByDocId: currentUser?.docid,
                  userPfp: currentUser?.pfp,
                  username: currentUser?.username,
                  type: "ps",
                  id: params.id,
                  body: commentText,
                });
                await updateDoc(doc(db, "discussions", docid.id), {
                  docid: docid.id,
                });
                setCommentText("");
              }
            }}
          >
            Send
          </Button>
        </div>
        <div
          style={{
            marginTop: 40,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {comments.map((c) => (
            <>
              <div
                className="comment"
                style={{
                  border: "2px solid #eee",
                  width: "60%",
                  minWidth: 800,
                  padding: 20,
                  height: "70%",
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <div className="user-banner">
                  <div className="user">
                    <div
                      className="avatar"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <img
                        src={c.userPfp}
                        style={{
                          borderRadius: 100,
                          marginTop: 5,
                          border: "2px solid #4A769D",
                        }}
                      />
                      <div>
                        <h5
                          style={{
                            marginLeft: 10,
                            marginTop: 10,
                            fontWeight: "bold",
                            color: "#000",
                          }}
                        >
                          {c.username}
                        </h5>
                        <p
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            marginTop: -5,
                            textTransform: "uppercase",
                          }}
                        >
                          20 Minutes Ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="btn dropdown">
                    <i className="ri-more-line"></i>
                  </button>
                </div>
                <div
                  className="content"
                  style={{
                    marginTop: 20,
                    maxWidth: "100%",
                    height: "100%",
                    textAlign: "left",
                    paddingLeft: 5,
                  }}
                >
                  <p>{c.body}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
