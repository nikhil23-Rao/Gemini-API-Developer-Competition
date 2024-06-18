"use client";

import { AppSidebar } from "@/components/general/Sidebar";
import "../globals.css";
import {
  Button,
  Checkbox,
  ListItemText,
  TextareaAutosize,
} from "@mui/material";
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
  const [todos, setTodos] = useState<
    Array<{ todo: string; checked: boolean; idx: number }>
  >([]);

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
          flexDirection: "column",
        }}
      >
        <div
          className="large-banner"
          style={{ alignItems: "flex-start", width: "75%", marginLeft: "16%" }}
        >
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
        <div
          className="main-dash"
          style={{ marginLeft: "16%", marginBottom: 0, width: "75%" }}
        >
          <ul className="infographic-cards" style={{ marginTop: 50 }}>
            <li className="color-1">
              <i className="fa fa-paint-brush"></i>
              <h5>New Whiteboard</h5>
              <h6>Need a quick drawing? Open up a canvas.</h6>
              <i className="fa fa-plus-circle mt-4"></i>
            </li>

            <li className="color-4" style={{ borderRadius: 10 }}>
              <i className="fa fa-bullseye"></i>
              <h5>New Target</h5>
              <h6>What do you want to accomplish right now?</h6>
              <i className="fa fa-pencil-square mt-4"></i>
            </li>

            <li className="color-2">
              <i className="fa fa-user"></i>
              <h5>View Profile</h5>
              <h6>Need a quick drawing? Open up a canvas.</h6>
              <i className="fa fa-arrow-circle-right mt-4"></i>
            </li>
          </ul>
        </div>

        <div
          style={{
            marginLeft: "16%",
            marginTop: 40,
          }}
        >
          <div className="main-dash container">
            <ul className="infographic-cards" style={{ width: "100%" }}>
              <li className="color-3" style={{ width: "100%" }}>
                <i className="fa fa-check-square"></i>
                <h5>My Tasks</h5>
                <h6>Keep track of upcoming tasks</h6>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 15,
                      alignItems: "center",
                    }}
                  >
                    {todos.length == 0 && <p>No todos yet. Add one below.</p>}
                    {todos.map((t, idx) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 15,
                            alignItems: "center",
                          }}
                        >
                          <ListItemText>
                            <TextareaAutosize
                              className="card-title"
                              value={t.todo}
                              style={{
                                backgroundColor: "transparent",
                                outline: "none",
                                resize: "none",
                                overflow: "hidden",
                                textDecoration: t.checked ? "line-through" : "",
                              }}
                              maxRows={1}
                              onChange={(e) => {
                                let oldTodos = [...todos];
                                const target: any = todos.find(
                                  (c) => c.idx === idx,
                                );

                                const newTodo = {
                                  todo: e.target.value,
                                  checked: t.checked,
                                  idx,
                                };

                                Object.assign(target, newTodo);

                                setTodos([...todos]);
                              }}
                            ></TextareaAutosize>
                          </ListItemText>
                          <Checkbox
                            checked={t.checked}
                            color="success"
                            onClick={() => {
                              let oldTodos = [...todos];
                              const target: any = todos.find(
                                (c) => c.idx === idx,
                              );

                              const newTodo = {
                                todo: t.todo,
                                checked: !t.checked,
                                idx,
                              };

                              Object.assign(target, newTodo);

                              setTodos([...todos]);
                            }}
                            style={{ color: "#fff", marginTop: -20 }}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <i
                  className="fa fa-plus-circle mt-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let oldTodos = [...todos];
                    oldTodos.push({
                      todo: "New todo",
                      checked: false,
                      idx: oldTodos.length,
                    });
                    setTodos(oldTodos);
                  }}
                ></i>
              </li>

              <li className="color-3" style={{ width: "100%" }}>
                <i className="fa fa-check-square"></i>
                <h5>My Tasks</h5>
                <h6>Keep track of upcoming tasks</h6>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 15,
                      alignItems: "center",
                    }}
                  >
                    {todos.length == 0 && <p>No todos yet. Add one below.</p>}
                    {todos.map((t, idx) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 15,
                            alignItems: "center",
                          }}
                        >
                          <ListItemText>
                            <TextareaAutosize
                              className="card-title"
                              value={t.todo}
                              style={{
                                backgroundColor: "transparent",
                                outline: "none",
                                resize: "none",
                                overflow: "hidden",
                                textDecoration: t.checked ? "line-through" : "",
                              }}
                              maxRows={1}
                              onChange={(e) => {
                                let oldTodos = [...todos];
                                const target: any = todos.find(
                                  (c) => c.idx === idx,
                                );

                                const newTodo = {
                                  todo: e.target.value,
                                  checked: t.checked,
                                  idx,
                                };

                                Object.assign(target, newTodo);

                                setTodos([...todos]);
                              }}
                            ></TextareaAutosize>
                          </ListItemText>
                          <Checkbox
                            checked={t.checked}
                            color="success"
                            onClick={() => {
                              let oldTodos = [...todos];
                              const target: any = todos.find(
                                (c) => c.idx === idx,
                              );

                              const newTodo = {
                                todo: t.todo,
                                checked: !t.checked,
                                idx,
                              };

                              Object.assign(target, newTodo);

                              setTodos([...todos]);
                            }}
                            style={{ color: "#fff", marginTop: -20 }}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <i
                  className="fa fa-plus-circle mt-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let oldTodos = [...todos];
                    oldTodos.push({
                      todo: "New todo",
                      checked: false,
                      idx: oldTodos.length,
                    });
                    setTodos(oldTodos);
                  }}
                ></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
