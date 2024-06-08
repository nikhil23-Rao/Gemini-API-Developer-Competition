"use client";
import { Metadata } from "next";
import "../globals.css";
import { useEffect, useState } from "react";
import { setUser } from "@/utils/getCurrentUser";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { User } from "@/types/auth/User";

export default function Setup() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser) setUsername(currentUser.username);
    console.log(currentUser);
  }, [currentUser]);

  if (!currentUser) return <h1>loading</h1>;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        animate={{ y: -100 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
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
            className="text-gradient"
            style={{ fontSize: "7vw", marginBottom: 0 }}
          >
            Welcome, {username.substring(0, username.indexOf(" "))}
          </h1>
          <p style={{ maxWidth: 800, textAlign: "center" }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus,
            consequuntur alias perspiciatis ducimus beatae dicta iusto nemo
            repudiandae tempora perferendis velit quis consequatur, numquam
            debitis dolorum minus nulla quo corporis.
          </p>
        </div>
        <div style={{ top: 50, position: "relative" }}>
          <img
            src={currentUser.pfp}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              border: "4px solid #000",
            }}
            alt=""
          />
        </div>
      </motion.div>
    </>
  );
}
