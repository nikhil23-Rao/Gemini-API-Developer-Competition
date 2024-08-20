"use client";
import { setUser } from "@/utils/getCurrentUser";
import auth from "@/utils/initAuth";
import { getToken, login } from "@/utils/signInWithGoogle";
import React, { useEffect, useState } from "react";
import { GoogleApiProvider, useGoogleApi } from "react-gapi";

export default function Grades() {
  const [currentUser, setCurrentUser] = useState();
  const [authoo, setAuthOo] = useState();
  const gapi = useGoogleApi({
    scopes: ["profile"],
  });
  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    console.log("POO", gapi);
  }, [gapi]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <>
      <h1 onClick={getToken}></h1>
    </>
  );
}
