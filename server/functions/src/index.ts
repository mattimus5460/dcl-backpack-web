import * as express from "express";
import {Request, Response} from "express";

import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {initializeApp} from "firebase/app";

import * as functions from "firebase-functions";
import * as cors from "cors";
import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";
import {
  serviceAccount,
} from "../../auth/dcl-closet-firebase-adminsdk-qc1u5-bc375cfe74";

const app = express();

app.use(cors({origin: true}));

import DocumentData = firestore.DocumentData;
//
// const fbApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://dcl-closet.firebaseio.com',
// })

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyAihsRNrenYC2Sizv-tPDYinEuxlDXMjY0",
  authDomain: "dcl-closet.firebaseapp.com",
  projectId: "dcl-closet",
  storageBucket: "dcl-closet.appspot.com",
  messagingSenderId: "88389040353",
  appId: "1:88389040353:web:ab5e881fb428265dd49fa0",
  measurementId: "G-BQ8G1JVXF0",
};

const fbApp = initializeApp(firebaseConfig);

const db = getFirestore(fbApp);


app.get("/outfits", async (req: Request, res: Response) => {
  const response: DocumentData[] = [];

  const querySnapshot = await getDocs(collection(db, "outfits"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    response.push(doc.data());
  });

  return res.status(200).send(response);
});

app.get("/outfits/:userId", async (req: Request, res: Response) => {
  const response: DocumentData[] = [];

  const querySnapshot =
    await getDocs(query(
        collection(db, "outfits"),
        where("userId", "==", req.params.userId)),
    );
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    response.push(doc.data());
  });

  return res.status(200).send(response);
});


app.post("/addOutfit", async (req: Request, res: Response) => {
  console.log("called " + JSON.stringify(req.body));

  try {
    const docRef = await addDoc(collection(db, "outfits"),
        req.body,
    );
    console.log("Document written with ID: ", docRef.id);
    return res.status(200).send(
        {message: `Document written with ID: ${docRef.id}`});
  } catch (e) {
    console.error("Error adding document: ", e);
    return res.status(500).send({message: `Error adding document: ${e}`});
  }
});

exports.api = functions.https.onRequest(app);


