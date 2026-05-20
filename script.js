// ================= FIREBASE =================

const firebaseConfig = {
  apiKey: "AIzaSyC_P_1FAzh0-tQCAZP1DjtEIoDrJyplLLE",
  authDomain: "smart-college-recommend-system.firebaseapp.com",
  projectId: "smart-college-recommend-system",
  storageBucket: "smart-college-recommend-system.firebasestorage.app",
  messagingSenderId: "1042913604563",
  appId: "1:1042913604563:web:843989dc60ab175622f526"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase Connected");

// FIXED FIRESTORE SAVE
async function addCollege() {

  const college = {
    name: document.getElementById("a_name").value,
    exam: document.getElementById("a_exam").value,
    course: document.getElementById("a_course").value,
    branch: document.getElementById("a_branch").value,
    location: document.getElementById("a_location").value,
    cutoff: Number(document.getElementById("a_cutoff").value),
    rating: Number(document.getElementById("a_rating").value),
    fees: Number(document.getElementById("a_fees").value),
    placement: Number(document.getElementById("a_placement").value),
    sports: document.getElementById("a_sports").value,
    cultural: document.getElementById("a_cultural").value,
    clubs: document.getElementById("a_clubs").value
  };

  // ✅ FIXED (compat version)
  db.collection("colleges").add(college);

  alert("College Added ✅");
}
