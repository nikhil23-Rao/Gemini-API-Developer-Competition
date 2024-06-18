"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Splash } from "@/components/general/Splash";
import { getHomeScreenQuote } from "@/api/getHomeScreenQuote";

export default function Dashboard() {
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

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    // getHomeScreenQuote().then((res) => {
    //   setQuote(res);
    // });
  }, []);

  if (!currentUser) return <Splash />;
  return (
    <>
      <AppSidebar />
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "45%",
          }}
        >
          <div className="large-banner" style={{ alignItems: "flex-start" }}>
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
        </div>
      </div>
    </>
  );
}
