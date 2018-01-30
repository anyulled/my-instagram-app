import firebase from "firebase";

const config = {
    apiKey:"AIzaSyAmEVco1bXR5DZ2ocOBh9gc46Uj19APfsI",
    authDomain: "instagram-liker.firebaseapp.com",
    projectId: "instagram-liker",
};
export const firebaseApp = firebase.initializeApp(config);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();