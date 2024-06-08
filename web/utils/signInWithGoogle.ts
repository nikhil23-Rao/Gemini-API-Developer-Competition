import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
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

export const login = () => {
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      const user = result.user;

      // Check if user exists before we readd them to db
      const querySnapshot = await getDocs(collection(db, "users"));
      let userExists = false;
      querySnapshot.forEach((doc) => {
        if (doc.data().id === user.uid) {
          userExists = true; // don't recreate account
        }
      });

      if (userExists) window.location.href = "/home";
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

// export const googleLogin = async () => {
//   await signInWithRedirect(auth, googleProvider);
// };

// export const checkIfUserExists = (router: AppRouterInstance) => {
//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       router.push("/setup");
//     } else {
//       getRedirectResult(auth)
//         .then(async (result: any) => {
//           const credential = GoogleAuthProvider.credentialFromResult(result);
//           const token = credential?.accessToken;

//           const user: any = result.user;

//           const querySnapshot = await getDocs(collection(db, "users"));
//           let userExists = false;
//           querySnapshot.forEach((doc) => {
//             if (doc.data().id === user.uid) {
//               userExists = true;
//             }
//           });

//           const writeUserData = async () => {
//             const userRef = doc(collection(db, "users"));
//             console.log(userRef.id);
//             const docid = await addDoc(collection(db, "users"), {
//               username: user.displayName,
//               pfp: user.photoURL,
//               email: user.email,
//               id: user.uid,
//             });
//             return updateDoc(docid, {
//               username: user.displayName,
//               pfp: user.photoURL,
//               email: user.email,
//               id: user.uid,
//             });

//             writeUserData().then(() => {
//               window.location.href = "/setup";
//             });
//           };
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           const email = error.email;
//           const credential = GoogleAuthProvider.credentialFromError(error);
//           console.log({ errorCode, errorMessage, email, credential });
//         });
//     }
//   });
// };

// // getRedirectResult(auth)
// // .then(async (result: any) => {
// //   const credential = GoogleAuthProvider.credentialFromResult(result);
// //   const token = credential?.accessToken;

// //   const user: any = result.user;

// //   const querySnapshot = await getDocs(collection(db, "users"));
// //   let userExists = false;
// //   querySnapshot.forEach((doc) => {
// //     if (doc.data().id === user.uid) {
// //       userExists = true;
// //     }
// //   });

// //   if (userExists) {
// //     return (window.location.href = "/setup");
// //   } else {
// //     const writeUserData = async () => {
// //       const userRef = doc(collection(db, "users"));
// //       console.log(userRef.id);
// //       const docid = await addDoc(collection(db, "users"), {
// // 	username: user.displayName,
// // 	pfp: user.photoURL,
// // 	email: user.email,
// // 	id: user.uid,
// //       });
// //       return updateDoc(docid, {
// // 	username: user.displayName,
// // 	pfp: user.photoURL,
// // 	email: user.email,
// // 	id: user.uid,
// //       });
// //     };

// //     writeUserData().then(() => {
// //       window.location.href = "/setup";
// //     });
// //   }
// // })
// // .catch((error) => {
// //   const errorCode = error.code;
// //   const errorMessage = error.message;
// //   const email = error.email;
// //   const credential = GoogleAuthProvider.credentialFromError(error);
// //   console.log({ errorCode, errorMessage, email, credential });
// // });
