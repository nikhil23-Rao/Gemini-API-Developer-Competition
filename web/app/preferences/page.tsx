"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { AppSidebar } from "@/components/general/Sidebar";
import { Splash } from "@/components/general/Splash";
import { colors, getTheme, themes } from "@/utils/getTheme";
import { getColor } from "@/utils/getColor";
export default function Preferences() {
  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

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
      </div>
    </>
  );
}
