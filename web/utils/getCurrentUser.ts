import { onAuthStateChanged } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import db from "./initDB";
import auth from "./initAuth";

export const setUser = (setCurrentUser: (input: any) => void) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(await user.getIdToken());
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().id === user.uid) {
          setCurrentUser({ ...doc.data(), docid: doc.id });
        }
      });
    } else {
      return;
    }
  });
};
