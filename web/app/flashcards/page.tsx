"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import createData from "../../public/createData.json";
import Lottie from "lottie-react";

export default function Dashboard() {
  return (
    <>
      <AppSidebar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "10%",
        }}
      >
        <h1
          className="text-gradient-black"
          style={{ fontSize: "4vw", marginTop: 50 }}
        >
          My Flashcards
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
          Welcome to your flashcards. To get started, create a new set of
          flashcards with the button below. If you already have flashcard sets,
          you can view them by clicking on the containers below. Use AI to help
          create a boilerplate to help you study.
        </p>

        <Lottie
          animationData={createData}
          loop
          style={{ width: "33vw", marginTop: 30 }}
        />
        <button
          className={"primary-effect"}
          style={{
            width: 400,
            borderRadius: 200,
            marginTop: 50,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              cursor: "pointer",
            }}
          >
            Create New Set
          </span>
        </button>
      </div>
    </>
  );
}
