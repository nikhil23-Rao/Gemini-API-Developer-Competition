"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { AppSidebar } from "@/components/general/Sidebar";
export default function Preferences() {
  const [theme, setTheme] = useState("");

  const colors = [
    {
      color: "default",
    },

    {
      color: "instagram",
    },
    {
      color: "gemini",
    },
    {
      color: "steel",
    },
    {
      color: "lakers",
    },
  ];

  const themes = [
    {
      name: "Light",
      backgroundColor: "#fff",
      textColor: "#000",
      className: "",
    },
    {
      name: "Slate Black",
      backgroundColor: "#202020",
      textColor: "#fff",
      className: "",
    },

    {
      name: "Night",
      backgroundColor: "#1C2836",
      textColor: "#fff",
      className: "",
    },

    {
      name: "Lights Out",
      backgroundColor: "#000",
      textColor: "#fff",
      className: "",
    },

    {
      name: "Silver Coin",
      backgroundColor: "",
      textColor: "#fff",
      className: "silvercointheme",
    },

    {
      name: "Ash",
      backgroundColor: "",
      textColor: "#fff",
      className: "ashtheme",
    },

    {
      name: "Vibrant",
      backgroundColor: "",
      textColor: "#fff",
      className: "vibranttheme",
    },
    {
      name: "Lightning",
      backgroundColor: "",
      textColor: "#fff",
      className: "lightningtheme",
    },

    {
      name: "Frost",
      backgroundColor: "",
      textColor: "#fff",
      className: "frosttheme",
    },
  ];

  return (
    <>
      <AppSidebar modals={false} />
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
            App Settings
          </h1>
          <p
            style={{
              marginTop: 40,
              maxWidth: "90%",
              textAlign: "center",
              color: "gray",
              fontSize: 14,
            }}
          >
            Adjust your appearence, edit your classes, and edit your default
            configuration set when you entered the app.
          </p>
        </div>
      </div>
      <div style={{ marginLeft: "20%", marginTop: 45 }}>
        <h1
          className="text-gradient-black"
          style={{
            textTransform: "uppercase",
            letterSpacing: 1.5,
            fontSize: "1.2vw",
          }}
        >
          Appearence
        </h1>
        <p className="mt-5">Background Theme</p>
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
                    border: "2px solid #eee",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    cursor: "pointer",
                    color: t.textColor,
                    backgroundColor: t.backgroundColor,
                  }}
                  className={t.className}
                >
                  <p>{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <p>Color Style</p>

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
                  }}
                  className={c.color}
                ></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
