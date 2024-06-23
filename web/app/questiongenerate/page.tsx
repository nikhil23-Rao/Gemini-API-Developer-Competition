"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tabs,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import animationdata from "../../public/questiongenerate.json";
import "../globals.css";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { NewModal } from "@/components/general/newModal";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { ResourceContent } from "@/types/questiongenerate/ResourceContent";
import ComponentTab from "@/components/general/Tabs";

export default function QuestionGenerator() {
  const [questionGenerateModal, setQuestionGenerateModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);
  const [chosenClass, setChosenClass] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [resourceContent] = useState(ResourceContent);
  const [content, setContent] = useState("");
  const [resourceOptions] = useState(["User Input", "Import"]);
  const [tabValue, setTabValue] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("res", reader.result);
        setImgPreview(reader.result as string);
        const base64String = (reader.result as string)
          .replace("data:", "")
          .replace(/^.+,/, "");

        // console.log(base64String);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

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
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 120 }}
          >
            Resource Finder
          </h1>
          <FormControl style={{ width: 400, marginTop: 60, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Class Related To
            </InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenClass}
              onChange={(e) => {
                setChosenClass(e.target.value);
              }}
            >
              {currentUser?.selectedClasses.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: 400, marginTop: 10, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">Content</InputLabel>
            <Select
              // color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            >
              {resourceContent.map((c, idx) => (
                <MenuItem value={c} key={idx}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, value) => {
                  setTabValue(value);
                }}
                aria-label="basic tabs example"
              >
                {resourceOptions.map((obj, idx) => (
                  <ComponentTab t={obj} idx={idx} />
                ))}
              </Tabs>
            </Box>
          </Box>
          {tabValue === 0 ? (
            <>
              <TextareaAutosize
                id="outlined-basic"
                placeholder="Enter a unit name, a quesion type, etc..."
                value={prompt}
                style={{
                  width: 400,
                  marginTop: 20,
                  height: 100,
                  border: "2px solid #CBCBCB",
                  borderRadius: 5,
                  resize: "none",
                  padding: 20,
                }}
                onChange={(e) => {
                  setPrompt(e.currentTarget.value);
                }}
                color={prompt.length > 0 ? "primary" : "error"}
              />
            </>
          ) : (
            <>
              {" "}
              <div style={{ marginTop: 40 }}>
                <label htmlFor="group_image">
                  <h1
                    style={{
                      cursor: "pointer",
                      textTransform: "uppercase",
                      color: "#1B596F",
                      border: "1px solid #eee",
                      padding: 15,
                      borderRadius: 200,
                    }}
                  >
                    Select A File
                  </h1>
                </label>
                <input
                  type="file"
                  onChange={onImageChange}
                  className="filetype custom-file-upload"
                  id="group_image"
                  accept="image/*"
                />
              </div>
              <p style={{ marginTop: 20 }}> Chosen File:</p>
              {imgPreview.length > 0 && (
                <img
                  src={imgPreview}
                  style={{
                    width: 440,
                    height: 440,
                    marginTop: 20,
                    border: "2px solid lightblue",
                    borderRadius: 15,
                  }}
                  alt=""
                />
              )}
            </>
          )}
          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              marginTop: 50,
            }}
            onClick={async () => {}}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Search for Resources
            </span>
          </button>
        </div>
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
              maxWidth: "55%",
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
            onClick={() => setResourceModal(true)}
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
