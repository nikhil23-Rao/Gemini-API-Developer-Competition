import { getAuth } from "firebase/auth";
import firebaseApp from './firebaseConfig';

const auth = getAuth(firebaseApp);

export default auth;