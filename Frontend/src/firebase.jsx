import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzwgFigvqSnCHmgOuiowIMbm5Xhi1C-S4",
  authDomain: "conduyt-72fa6.firebaseapp.com",
  projectId: "conduyt-72fa6",
  storageBucket: "conduyt-72fa6.firebasestorage.app",
  messagingSenderId: "129036735199",
  appId: "1:129036735199:web:5bd46002b718aa4eef8f6a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);