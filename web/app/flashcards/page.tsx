"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import { None } from "@/components/flashcards/none";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Tabs,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import ComponentTab from "@/components/general/Tabs";
import { classes } from "@/data/classes";
import { flashcardOptions } from "@/data/optionsFlashcards";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { getUnitsForClass } from "@/api/getUnitsForClass";

export default function Flashcards() {
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState("");
  const [chosenClass, setChosenClass] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [possibleUnits, setPossibleUnits] = useState<
    [{ name: string }] | null
  >();

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (chosenClass.length > 0) {
      // Call getUnits API
      getUnitsForClass(chosenClass, setPossibleUnits);
    }
  }, [chosenClass]);

  if (modal) {
    return (
      <>
        <i
          className="fa fa-window-close fa-2x"
          style={{
            color: "red",
            position: "absolute",
            top: 50,
            right: 100,
            cursor: "pointer",
          }}
          onClick={() => setModal(false)}
        ></i>
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          animate={{ y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 40,
          }}
        >
          <h1
            className="text-gradient-black"
            style={{ fontSize: "4vw", marginTop: 130 }}
          >
            Create Flashcards
          </h1>
          <TextField
            id="outlined-basic"
            label={"Enter Set Name"}
            variant="outlined"
            value={name}
            style={{ width: 400, marginTop: 80 }}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            color={name.length > 0 ? "primary" : "error"}
          />
          <FormControl style={{ width: 400, marginTop: 20, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">
              Class Related To
            </InputLabel>
            <Select
              color={chosenClass.length > 0 ? "primary" : "error"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenClass}
              label="Expected Graduation Year"
              onChange={(e) => setChosenClass(e.target?.value as string)}
            >
              {currentUser?.selectedClasses.map((c, idx) => (
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
                {flashcardOptions.map((obj, idx) => (
                  <ComponentTab t={obj} idx={idx} />
                ))}
              </Tabs>
            </Box>
          </Box>
          {tabValue == 0 ? (
            <>
              <FormControl
                style={{ width: 400, marginTop: 20, marginBottom: 20 }}
              >
                <InputLabel id="demo-simple-select-label">
                  Units (If Applicable)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUnits.length > 0 ? "" : "Units Listed Below"}
                  label="Expected Graduation Year"
                  onClick={() => {}}
                >
                  {possibleUnits?.map((u) => (
                    <>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <ListItemText
                          primary={u.name}
                          style={{ padding: 20 }}
                        />
                        <Checkbox
                          checked={selectedUnits.includes(u.name)}
                          onClick={() => {
                            if (selectedUnits.includes(u.name)) {
                              return selectedUnits.filter(
                                (unit) => unit !== u.name,
                              );
                            }
                            setSelectedUnits([...selectedUnits, u.name]);
                          }}
                        />
                      </div>
                    </>
                  ))}
                </Select>
              </FormControl>
              <p>Units Selected</p>
              <TextareaAutosize
                id="outlined-basic"
                placeholder="Specifying Details... (Optional)"
                value={name}
                style={{
                  width: 400,
                  marginTop: 80,
                  height: 100,
                  border: "2px solid #CBCBCB",
                  borderRadius: 5,
                  resize: "none",
                  padding: 20,
                }}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
                color={name.length > 0 ? "primary" : "error"}
              />
            </>
          ) : tabValue === 1 ? (
            <>
              {" "}
              <TextareaAutosize
                id="outlined-basic"
                placeholder="What do you need flashcards about?..."
                value={name}
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
                  setName(e.currentTarget.value);
                }}
                color={name.length > 0 ? "primary" : "error"}
              />
            </>
          ) : (
            <></>
          )}

          <button
            className={"primary-effect"}
            style={{
              width: 400,
              borderRadius: 200,
              marginTop: 50,
              cursor: "pointer",
            }}
            onClick={() => setModal(true)}
          >
            <span
              style={{
                cursor: "pointer",
              }}
            >
              Create New Set
            </span>
          </button>
        </motion.div>
      </>
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
        <None setModal={setModal} />
      </div>
    </>
  );
}
