"use client";
import { Metadata } from "next";
import "../globals.css";
import "font-awesome/css/font-awesome.css";
import { useEffect, useState } from "react";
import { setUser } from "@/utils/getCurrentUser";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { User } from "@/types/auth/User";
import { Splash } from "@/components/general/Splash";
import {
  Box,
  Button,
  Chip,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { classes } from "@/data/classes";
import ComponentTab, { CustomTabPanel } from "@/components/general/Tabs";
import { arrayOfClassesTabs } from "@/data/arrayOfClassesTabs";

export default function Setup() {
  const [displayName, setDisplayName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<Array<string>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [buttonCount, setButtonCount] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username.toLowerCase());
      setDisplayName(currentUser.username);
    }
    console.log(currentUser);
  }, [currentUser]);

  if (!currentUser) return <Splash />;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            position: "relative",
            height: "18vh",
            marginBottom: 140,
          }}
        >
          <img
            src="/logo.png"
            style={{ position: "absolute", top: 20, left: 40, width: 100 }}
            alt=""
          />
          <i
            className="fa fa-sign-out fa-3x"
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              width: 100,
              cursor: "pointer",
              zIndex: 200,
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          animate={{ y: -100 }}
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
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1
              className="text-gradient"
              style={{ fontSize: "7vw", marginBottom: 0 }}
            >
              Welcome, {displayName.substring(0, displayName.indexOf(" "))}
            </h1>
            <p style={{ maxWidth: 800, textAlign: "center" }}>
              Let's personalize your experience. To get started, choose the
              classes you'll be using this platform for, tell us a little about
              yourself in your profile, and let us know when you're planning to
              graduate. This will help us tailor resources, recommendations, and
              notifications to your specific academic journey.
            </p>
          </div>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            style={{ marginTop: 40, cursor: "pointer" }}
          >
            <Step
              key={"Step 1"}
              onClick={() => {
                setActiveStep(0);
              }}
            >
              <StepLabel>Profile</StepLabel>
            </Step>
            <Step
              key={"Step 2"}
              onClick={() => {
                if (buttonCount > 0) {
                  setActiveStep(1);
                }
              }}
            >
              <StepLabel>Classes</StepLabel>
            </Step>
            <Step
              key={"Step 3"}
              onClick={() => {
                if (buttonCount > 1) {
                  setActiveStep(2);
                }
              }}
            >
              <StepLabel>School</StepLabel>
            </Step>
          </Stepper>
          {activeStep == 0 ? (
            <>
              {" "}
              <div
                style={{
                  top: 50,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "relative" }}>
                  <img
                    src={currentUser.pfp}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 100,
                      border: "4px solid #000",
                      display: "block",
                    }}
                    alt=""
                  />
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#fff",
                      borderRadius: 100,
                      border: "2px solid #000",
                      position: "absolute",
                      top: 0,
                      right: 10,
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="fa fa-pencil"
                      style={{
                        right: -5,
                        top: 5,
                        zoom: 1.5,
                        position: "relative",
                      }}
                    />
                  </div>
                </div>
              </div>
              <TextField
                id="outlined-basic"
                label={username.length > 0 ? "Username" : "Enter Username"}
                variant="outlined"
                value={username.replace(/\s/g, "")}
                style={{ width: 400, marginTop: 80 }}
                onChange={(e) => {
                  setUsername(e.currentTarget.value.replace(/\s/g, ""));
                }}
                color={username.length > 0 ? "primary" : "error"}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  marginTop: 40,

                  borderRadius: 200,
                }}
                onClick={() => {
                  setActiveStep(activeStep + 1);
                  setButtonCount(1);
                }}
              >
                <button
                  className={
                    username.length > 0 ? "btn-effect" : "btn-effect-disabled"
                  }
                  style={{
                    width: 400,
                    borderRadius: 200,

                    cursor: username.length > 0 ? "pointer" : "not-allowed",
                  }}
                  disabled={username.length > 0 ? false : true}
                >
                  <span
                    style={{
                      cursor: username.length > 0 ? "pointer" : "not-allowed",
                    }}
                  >
                    Next
                  </span>
                </button>
              </div>
            </>
          ) : activeStep == 1 ? (
            <>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
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
                        <ComponentTab t={obj.Subject} idx={idx} />
                      ))}
                    </Tabs>
                  </Box>
                </Box>
                <div
                  style={{
                    position: "relative",
                    width: "45vw",
                    marginTop: 30,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
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
                        style={{
                          padding: 15,
                          fontSize: "29px",
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
                                    : "",
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
                        style={{
                          padding: 15,
                          fontSize: "29px",
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
                                    : "",
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
                        style={{
                          padding: 15,
                          fontSize: "29px",
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
                                    : "",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      marginTop: 380,
                    }}
                  >
                    <button
                      className={
                        selectedClasses.length > 0
                          ? "btn-effect"
                          : "btn-effect-disabled"
                      }
                      style={{
                        width: 400,
                        borderRadius: 200,

                        cursor:
                          selectedClasses.length > 0
                            ? "pointer"
                            : "not-allowed",
                      }}
                      disabled={selectedClasses.length > 0 ? false : true}
                    >
                      <span
                        style={{
                          cursor:
                            selectedClasses.length > 0
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </motion.div>
      </div>
    </>
  );
}
