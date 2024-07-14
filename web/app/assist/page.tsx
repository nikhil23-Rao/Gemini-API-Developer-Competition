"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { AppSidebar } from "@/components/general/Sidebar";
import { TextareaAutosize } from "@mui/material";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Splash } from "@/components/general/Splash";

export default function Assist() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  return (
    <>
      <AppSidebar modals={false} />
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
              >
                <div
                  style={{
                    width: "80vw",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <img
                      src={currentUser.pfp}
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
                      <p style={{ marginLeft: 10 }}>{currentUser.username}</p>
                      <p style={{ marginLeft: 10 }}>11:23 AM</p>
                    </div>
                  </div>
                  <h1 style={{ marginTop: 10 }}>
                    heyloprem lorem Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Neque officia omnis, atque ea, repudiandae
                    laboriosam consequuntur facilis laborum maiores maxime
                    molestiae delectus iure optio provident. Neque laudantium
                    eveniet quae eos.
                  </h1>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                }}
              >
                <TextareaAutosize
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
                  }}
                  placeholder="What do you need help with?"
                />
                <i
                  className="fa fa-plus-circle fa-2x"
                  style={{
                    color: "#201C57",
                    cursor: "pointer",
                    marginLeft: 10,
                    top: -10,
                    position: "relative",
                  }}
                ></i>
                <i
                  className="fa fa-search fa-2x"
                  style={{
                    color: "#201C57",
                    cursor: "pointer",
                    marginLeft: 10,
                    top: -10,
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
