import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUMgdeRPRXp1VKhL02nwKmiV60xySQ6g0",
  authDomain: "tarefasplus-d2bd2.firebaseapp.com",
  projectId: "tarefasplus-d2bd2",
  storageBucket: "tarefasplus-d2bd2.appspot.com",
  messagingSenderId: "1009486215346",
  appId: "1:1009486215346:web:4817d987bc1a48eb6871ab",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
