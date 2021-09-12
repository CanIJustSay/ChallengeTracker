import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC0cU9HKsNiw2pAS-9DqtSqLoZNX4DVnMc",
  authDomain: "challenge-tracker-c4a29.firebaseapp.com",
  projectId: "challenge-tracker-c4a29",
  storageBucket: "challenge-tracker-c4a29.appspot.com",
  messagingSenderId: "862826237250",
  appId: "1:862826237250:web:1be3c8346e8bdfe8b14cdb",
  databaseURL: "https://challenge-tracker-c4a29.firebaseio.com",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
export default firebase.firestore();
