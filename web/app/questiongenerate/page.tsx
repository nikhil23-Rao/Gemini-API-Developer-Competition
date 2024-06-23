"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import { Button, TextField } from "@mui/material";
import animationdata from "../../public/questiongenerate.json";
import "../globals.css";
import Lottie from "lottie-react";
import { useState } from "react";
import { NewModal } from "@/components/general/newModal";

export default function QuestionGenerator() {
  const [questionGenerateModal, setQuestionGenerateModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);

  if (questionGenerateModal) {
    return (
      <NewModal
        modal={questionGenerateModal}
        setModal={setQuestionGenerateModal}
      >
        <h1>hey</h1>
      </NewModal>
    );
  }

  if (resourceModal) {
    return (
      <NewModal modal={resourceModal} setModal={setResourceModal}>
        <h1>hey</h1>
      </NewModal>
    );
  }

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
            Question Generator
          </h1>
          <p
            style={{
              marginTop: 40,
              maxWidth: "50%",
              textAlign: "center",
              color: "gray",
              fontSize: 14,
            }}
          >
            Welcome to your very own question/quiz generator. Need more practice
            questions for your upcoming test. Need AP-styled FRQ's? Need some
            additonal MCQs on a concept. Simply use AI to create them.
          </p>

          <Button
            variant="outlined"
            style={{ marginTop: 20 }}
            onClick={() => setQuestionGenerateModal(true)}
          >
            <i className="fa fa-plus" style={{ marginRight: 10 }}></i>
            <p style={{ marginTop: 1 }}>Generate Practice</p>
          </Button>

          <Button
            variant="outlined"
            style={{ marginTop: 20 }}
            color="success"
            onClick={() => setQuestionGenerateModal(true)}
          >
            <i className="fa fa-search" style={{ marginRight: 10 }}></i>
            <p style={{ marginTop: 1 }}>Resource Finder</p>
          </Button>

          <TextField
            style={{ borderRadius: 400, width: "40%", marginTop: 40 }}
            placeholder="Search for my problem sets..."
            InputProps={{ sx: { borderRadius: 100, paddingLeft: 2 } }}
          ></TextField>
          <Lottie
            animationData={animationdata}
            loop
            style={{ width: "16vw", marginTop: 30 }}
          />
          <p>Start practicing with the buttons above...</p>
        </div>
      </div>
    </>
  );
}
