import React from "react";
import { AppSidebar } from "../../components/general/Sidebar";
import { Button, TextField } from "@mui/material";
import "../globals.css";

export default function Marketplace() {
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
            Explore
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
            Welcome to the marketplace! Looking for a previously existing
            flashcard set, or maybe you are trying to find some more questions
            for your upcoming exam. Use the AI-Powered search to find what you
            need.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                style={{
                  borderRadius: 400,
                  width: "90%",
                  marginTop: 40,
                }}
                placeholder="Search by title, concept, class, etc..."
                InputProps={{ sx: { borderRadius: 100, paddingLeft: 2 } }}
              ></TextField>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "18%",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "38%",
                  border: "2px solid #eee",
                  borderRadius: 15,
                  padding: 25,
                  overflowY: "scroll",
                  maxHeight: 250,
                }}
              >
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
                <li
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <i className="fa fa-pencil-square mr-3"></i> option 1
                </li>
              </div>
            </div>
            <Button
              variant="outlined"
              startIcon={<i className="fa fa-sort"></i>}
              style={{
                marginTop: 40,
                borderRadius: 100,
                left: -25,
                position: "relative",
              }}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
