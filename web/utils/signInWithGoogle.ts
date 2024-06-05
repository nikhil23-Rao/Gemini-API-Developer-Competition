import {
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithPopup,
      } from "firebase/auth";
      import db from "./initDB";
      import auth from "./initAuth"
      import {
	addDoc,
	collection,
	doc,
	getDocs,
	updateDoc,
      } from "firebase/firestore";
      
      const googleProvider = new GoogleAuthProvider();
      const githubProvider = new GithubAuthProvider();
      
      export const googleLogin = () => {
	signInWithPopup(auth, googleProvider)
	  .then(async (result) => {
	    const credential = GoogleAuthProvider.credentialFromResult(result);
	    const token = credential?.accessToken;
      
	    const user: any = result.user;
      
	    const querySnapshot = await getDocs(collection(db, "users"));
	    let userExists = false;
	    querySnapshot.forEach((doc) => {
	      if (doc.data().id === user.uid) {
		userExists = true;
	      }
	    });
      
	    if (userExists) {
	      return (window.location.href = "/setup");
	    } else {
	      const writeUserData = async () => {
		const userRef = doc(collection(db, "users"));
		console.log(userRef.id);
		const docid = await addDoc(collection(db, "users"), {
		  username: user.displayName,
		  pfp: user.photoURL,
		  email: user.email,
		  id: user.uid,
		});
		return updateDoc(docid, {
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
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    const email = error.email;
	    const credential = GoogleAuthProvider.credentialFromError(error);
	    console.log({ errorCode, errorMessage, email, credential });
	  });
      };