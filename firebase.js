const firebaseConfig = {
  apiKey: "AIzaSyC_P_1FAzh0-tQCAZP1DjtEIoDrJyplLLE",
  authDomain: "smart-college-recommend-system.firebaseapp.com",
  projectId: "smart-college-recommend-system",
  storageBucket: "smart-college-recommend-system.firebasestorage.app",
  messagingSenderId: "1042913604563",
  appId: "1:1042913604563:web:d154381377cba2b822f526"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const collegesCollection = db.collection("colleges");
const favoritesCollection = db.collection("favorites");
