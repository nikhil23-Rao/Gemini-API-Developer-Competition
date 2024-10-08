import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import db from "./initDB";
import auth from "./initAuth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { NextRouter } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const logout = () => {
  signOut(auth).then(() => {
    window.location.href = "/";
  });
};

export const getToken = () => {
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.courses.readonly`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.announcements.readonly`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.courseworkmaterials`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.push-notifications`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.rosters.readonly`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.student-submissions.me.readonly`,
  );
  googleProvider.addScope(
    `https://www.googleapis.com/auth/classroom.topics.readonly`,
  );

  signInWithPopup(auth, googleProvider).then(async (result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    console.log("TOKEN", token);
  });
};

export const login = () => {
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      console.log("TOKEN");
      const user = result.user;
      console.log(user);

      // Check if user exists before we readd them to db
      const querySnapshot = await getDocs(collection(db, "users"));
      let userExists = false;
      querySnapshot.forEach((doc) => {
        if (doc.data().id === user.uid) {
          userExists = true; // don't recreate account
        }
      });

      if (userExists) return (window.location.href = "/home");
      else {
        const writeUserData = async () => {
          const userRef = doc(collection(db, "users")); // know which db to call

          await addDoc(collection(db, "users"), {
            username: user.displayName,
            pfp: user.photoURL,
            email: user.email,
            id: user.uid,
          });
        };
        writeUserData().then(() => {
          window.location.href = "/setup";
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
