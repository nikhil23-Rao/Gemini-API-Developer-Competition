"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { AppSidebar } from "@/components/general/Sidebar";
import { Splash } from "@/components/general/Splash";
import { colors, getTheme, themes } from "@/utils/getTheme";
import { getColor } from "@/utils/getColor";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Box, Chip, Tabs } from "@mui/material";
import { classes } from "@/data/classes";
import ComponentTab from "@/components/general/Tabs";
import { doc, updateDoc } from "@firebase/firestore";
import db from "@/utils/initDB";
export default function Preferences() {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  useEffect(() => {
    setUser(setCurrentUser);
    console.log("hey");
  }, []);

  useEffect(() => {
    console.log(selectedClasses);
  }, [selectedClasses]);

  useEffect(() => {
    if (currentUser) {
      setSelectedClasses(currentUser.selectedClasses);
    }
  }, [typeof currentUser]);

  useEffect(() => {
    if (
      selectedClasses.length > 0 &&
      selectedClasses !== currentUser?.selectedClasses &&
      currentUser
    ) {
      updateDoc(doc(db, "users", currentUser.docid), {
        selectedClasses,
      });
    }
  }, [selectedClasses, typeof currentUser]);

  if (!theme) {
    return <Splash></Splash>;
  }

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
          modals={false}
          bg={theme.backgroundColor}
          color={theme.textColor}
        />
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
              className={`textgradient ${color}`}
              style={{ fontSize: "4vw", marginTop: 50 }}
            >
              App Settings
            </h1>
            <p
              style={{
                marginTop: 40,
                maxWidth: "90%",
                textAlign: "center",
                fontSize: 14,
                color: theme.textColor,
              }}
            >
              Adjust your appearence, edit your classes, and edit your default
              configuration set when you entered the app.
            </p>
          </div>
        </div>
        <div style={{ marginLeft: "20%", marginTop: 45 }}>
          <h1
            className={getColor(color!)}
            style={{
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: "1.2vw",
            }}
          >
            Appearence
          </h1>
          <p
            className="mt-5"
            style={{
              color: theme.textColor,
            }}
          >
            Background Theme
          </p>
          <main
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
              marginTop: -20,
            }}
          >
            <div className="w-full max-w-5xl px-4 py-14 md:px-6">
              <div className="grid max-w-xs items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {themes.map((t) => (
                  <div
                    style={{
                      width: 200,
                      height: 50,
                      border:
                        (theme as any).name === t.name
                          ? "7px solid lightgreen"
                          : "2px solid #eee",
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      cursor: "pointer",
                      color: t.textColor,
                      backgroundColor: t.backgroundColor,
                    }}
                    onClick={() => {
                      setTheme(t as any);
                      localStorage.setItem("vertextheme", JSON.stringify(t));
                    }}
                    className={t.className}
                  >
                    <p>{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
          <p
            style={{
              color: theme.textColor,
            }}
          >
            Color Style
          </p>

          <main
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
              marginTop: -20,
            }}
          >
            <div className="w-full max-w-5xl px-4 py-14 md:px-6">
              <div className="grid max-w-xs items-start gap-6 lg:max-w-none lg:grid-cols-5">
                {colors.map((c) => (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 100,
                      cursor: "pointer",
                      border:
                        (c as any).color === color
                          ? "7px solid lightgreen"
                          : "2px solid #eee",
                    }}
                    onClick={() => {
                      setColor(c.color);
                      localStorage.setItem("vertexcolor", c.color);
                    }}
                    className={c.color}
                  ></div>
                ))}
              </div>
            </div>
          </main>
        </div>
        <div style={{ marginLeft: "20%", marginTop: 45 }}>
          <h1
            className={getColor(color!)}
            style={{
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: "1.2vw",
            }}
          >
            Account Settings
          </h1>
          <p
            className="mt-5"
            style={{
              color: theme.textColor,
            }}
          >
            Enrolled Classes
          </p>
          {currentUser && (
            <>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  backgroundColor: theme.backgroundColor,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={(e, value) => {
                        setTabValue(value);
                      }}
                      aria-label="basic tabs example"
                    >
                      {classes.map((obj, idx) => (
                        <ComponentTab
                          color={theme.textColor}
                          t={obj.Subject}
                          idx={idx}
                        />
                      ))}
                    </Tabs>
                  </Box>
                </Box>
                <div
                  style={{
                    position: "relative",
                    width: "45vw",
                    marginTop: 30,
                    alignSelf: "flex-start",
                  }}
                >
                  <div
                    style={{
                      // position: "absolute",
                      height: "40vh",
                      overflowY: "scroll",
                      marginBottom: 200,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        marginBottom: 30,
                      }}
                    >
                      <h1
                        className={getColor(color!)}
                        style={{
                          padding: 15,
                          fontSize: "29px",

                          alignSelf: "flex-start",
                          marginBottom: 30,
                        }}
                      >
                        Regular Classes
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          maxWidth: "100vw",
                          maxHeight: "100vh",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <div
                          className="mycontainer"
                          style={{ width: "44.5vw" }}
                        >
                          <div>
                            {classes[tabValue].Regular.map((a) => (
                              <Chip
                                onClick={() => {
                                  if (selectedClasses.includes(a)) {
                                    setSelectedClasses(
                                      selectedClasses.filter((el) => el != a),
                                    );
                                  } else {
                                    setSelectedClasses([...selectedClasses, a]);
                                  }
                                }}
                                label={a}
                                style={{
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  marginRight: 20,
                                  marginBottom: 10,
                                  backgroundColor: selectedClasses.includes(a)
                                    ? "lightblue"
                                    : "#fff",
                                  border: "2px solid #eee",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        marginBottom: 30,
                      }}
                    >
                      <h1
                        className={getColor(color!)}
                        style={{
                          padding: 15,
                          fontSize: "29px",

                          alignSelf: "flex-start",
                          marginBottom: 30,
                        }}
                      >
                        Honors Classes
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div className="mycontainer" style={{ width: "43vw" }}>
                          <div>
                            {classes[tabValue].Honors.map((a) => (
                              <Chip
                                onClick={() => {
                                  if (selectedClasses.includes(a)) {
                                    setSelectedClasses(
                                      selectedClasses.filter((el) => el != a),
                                    );
                                  } else {
                                    setSelectedClasses([...selectedClasses, a]);
                                  }
                                }}
                                label={a}
                                style={{
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  marginRight: 20,
                                  marginBottom: 10,
                                  backgroundColor: selectedClasses.includes(a)
                                    ? "lightblue"
                                    : "#fff",
                                  border: "2px solid #eee",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
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
                        style={{
                          padding: 15,
                          fontSize: "29px",

                          alignSelf: "flex-start",
                          marginBottom: 30,
                        }}
                      >
                        AP Classes
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          maxWidth: "100vw",
                          maxHeight: "100vh",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <div
                          className="mycontainer"
                          style={{ width: "43vw", marginBottom: 200 }}
                        >
                          <div>
                            {classes[tabValue].AP.map((a) => (
                              <Chip
                                onClick={() => {
                                  if (selectedClasses.includes(a)) {
                                    setSelectedClasses(
                                      selectedClasses.filter((el) => el != a),
                                    );
                                  } else {
                                    setSelectedClasses([...selectedClasses, a]);
                                  }
                                }}
                                label={a}
                                style={{
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  marginRight: 20,
                                  marginBottom: 10,
                                  backgroundColor: selectedClasses.includes(a)
                                    ? "lightblue"
                                    : "#fff",
                                  border: "2px solid #eee",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
