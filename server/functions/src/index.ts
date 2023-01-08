import {Request, Response} from "express";

;

import {collection, addDoc, getDocs, getFirestore, query, where} from "firebase/firestore";
import {initializeApp} from "firebase/app";

const functions = require('firebase-functions');
const express = require('express');
const app = express();

const cors = require('cors')({origin: true});
app.use(cors);

//let admin = require('firebase-admin')
//let serviceAccount = require('../../auth/dcl-closet-firebase-adminsdk-qc1u5-bc375cfe74.json')
//
// const fbApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://dcl-closet.firebaseio.com',
// })

const firebaseConfig = {

};

const fbApp = initializeApp(firebaseConfig)

const db = getFirestore(fbApp);


app.get('/outfits', async (req: Request, res: Response) => {

    let response: any = []

    const querySnapshot = await getDocs(collection(db, "outfits"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        response.push(doc.data())
    });

    return res.status(200).send(response)
});

app.get('/outfits/:userId', async (req: Request, res: Response) => {

    let response: any = []

    const querySnapshot =
        await getDocs(query(
            collection(db, "outfits"),
            where("userId", "==", req.params.userId))
        );
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        response.push(doc.data())
    });

    return res.status(200).send(response)
});


app.post('/addOutfit', async (req: Request, res: Response) => {
    console.log("called " + JSON.stringify(req.body))

    try {
        const docRef = await addDoc(collection(db, "outfits"),
            req.body
        );
        console.log("Document written with ID: ", docRef.id);
        return res.status(200).send({message: `Document written with ID: ${docRef.id}`})
    } catch (e) {
        console.error("Error adding document: ", e);
        return res.status(500).send({message: `Error adding document: ${e}`})
    }
});

exports.api = functions.https.onRequest(app);



