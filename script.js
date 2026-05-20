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


// ================= ADD COLLEGE =================
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

  await db.collection("colleges").add(college);

  alert("College Added ✅");

  // removed loadColleges() because it doesn't exist
}


// ================= DATA =================
const colleges = [
  {
    name: "RV College of Engineering",
    exam: "KCET",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 1200,
    rating: 4.8,
    fees: 250000,
    placement: 95,
    sports: "Excellent (Cricket, Football, Basketball)",
    cultural: "Milana Fest",
    clubs: "Robotics, Coding, Startup Cell"
  },
  {
    name: "PES University",
    exam: "KCET",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 800,
    rating: 4.7,
    fees: 320000,
    placement: 97,
    sports: "Excellent infrastructure",
    cultural: "Strong tech fests",
    clubs: "AI, Robotics, Startup"
  },
  {
    name: "MS Ramaiah Institute of Technology",
    exam: "KCET",
    course: "B.Tech",
    branch: "ECE",
    location: "Bangalore",
    cutoff: 2500,
    rating: 4.5,
    fees: 220000,
    placement: 90,
    sports: "Good sports culture",
    cultural: "Active campus events",
    clubs: "IEEE, Innovation"
  },
  {
    name: "BMS College of Engineering",
    exam: "KCET",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 1800,
    rating: 4.6,
    fees: 200000,
    placement: 92,
    sports: "Very good",
    cultural: "Utsav Fest",
    clubs: "Coding, Robotics"
  },
  {
    name: "East Point College of Engineering",
    exam: "KCET",
    course: "B.Tech",
    branch: "AI & DS",
    location: "Bangalore",
    cutoff: 15000,
    rating: 3.7,
    fees: 120000,
    placement: 70,
    sports: "Moderate",
    cultural: "Good",
    clubs: "Basic tech clubs"
  },
  {
    name: "New Horizon College of Engineering",
    exam: "COMEDK",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 5000,
    rating: 4.0,
    fees: 180000,
    placement: 80,
    sports: "Good",
    cultural: "Sargam Fest",
    clubs: "Coding, Dance"
  }
];


// ================= BRANCH =================
const branchData = {
  "B.Tech": ["CSE","AI & DS","AI & ML","ECE","EEE","Civil","Mechanical"],
  "B.Com": ["Finance","Accounting"],
  "BBA": ["Marketing","HR"],
  "B.Sc": ["CS","Physics"]
};


// FIX: wait until page loads
window.onload = () => {

  const courseEl = document.getElementById("course");

  if (courseEl) {
    courseEl.onchange = () => {
      const c = document.getElementById("course").value;
      const b = document.getElementById("branch");

      b.innerHTML = `<option value="">Select Branch</option>`;

      (branchData[c] || []).forEach(x => {
        b.innerHTML += `<option>${x}</option>`;
      });
    };
  }
};


// ================= RECOMMEND =================
function recommend() {

  const exam = document.getElementById("exam").value;
  const rank = Number(document.getElementById("rank").value || 0);
  const course = document.getElementById("course").value;
  const branch = document.getElementById("branch").value;
  const location = document.getElementById("location").value;

  const fees = Number(document.getElementById("feesFilter").value || 999999);
  const placement = Number(document.getElementById("placementFilter").value || 0);

  let filtered = colleges.filter(c =>
    c.fees <= fees &&
    c.placement >= placement
  );

  let scored = filtered.map(c => {

    let score = 0;

    if (c.exam === exam) score += 30;
    if (c.course === course) score += 20;
    if (c.branch === branch) score += 20;
    if (c.location === location) score += 10;
    if (rank && rank <= c.cutoff) score += 20;

    return { ...c, score };
  });

  scored.sort((a,b) => b.score - a.score);

  render(scored);
}


// ================= AI =================
function aiReason(c) {
  let r = [];

  if (c.placement >= 90) r.push("High placement opportunities");
  if (c.rating >= 4.5) r.push("Top rated college");
  if (c.fees < 200000) r.push("Affordable fees");
  if (c.cultural) r.push("Active cultural life");
  if (c.sports) r.push("Good sports facilities");

  return r.join(", ") || "Balanced college profile";
}


// ================= RENDER =================
function render(list) {

  const result = document.getElementById("result");
  result.innerHTML = "";

  if(list.length === 0){
    result.innerHTML = `<div class="no-results">😢 No colleges found</div>`;
    return;
  }

  list.forEach(c => {

    result.innerHTML += `
      <div class="card">
        <h3 onclick="openCollege('${c.name}')">${c.name}</h3>

        <p>📍 ${c.location}</p>
        <p>🎓 ${c.course} - ${c.branch}</p>
        <p>⭐ ${c.rating}</p>
        <p>🏆 Placement ${c.placement}%</p>

        <button onclick="openCollege('${c.name}')">View Details</button>
        <button onclick="saveFav('${c.name}')">❤️ Save</button>

        <p style="font-size:12px;color:#94a3b8">
          🧠 ${aiReason(c)}
        </p>
      </div>
    `;
  });
}


// ================= POPUP =================
function openCollege(name) {

  const c = colleges.find(x => x.name === name);
  if (!c) return;

  document.getElementById("popup").classList.remove("hidden");

  document.getElementById("pName").innerText = c.name;
  document.getElementById("pLocation").innerText = "📍 " + c.location;
  document.getElementById("pRating").innerText = "⭐ " + c.rating;

  document.getElementById("pBranch").innerText = "🎓 " + c.course + " - " + c.branch;
  document.getElementById("pExam").innerText = "📝 " + c.exam;
  document.getElementById("pCutoff").innerText = "📊 Cutoff: " + c.cutoff;
  document.getElementById("pFees").innerText = "💰 Fees: ₹" + c.fees;

  document.getElementById("pSports").innerText = "⚽ " + c.sports;
  document.getElementById("pPlacement").innerText = "🏆 " + c.placement + "%";
  document.getElementById("pCultural").innerText = "🎭 " + c.cultural;
  document.getElementById("pClubs").innerText = "💻 " + c.clubs;

  document.getElementById("pAI").innerText = "🧠 " + aiReason(c);
}


// ================= CLOSE =================
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}


// ================= SAVE =================
async function saveFav(name) {
  await db.collection("favorites").add({
    college: name,
    time: new Date().toISOString()
  });

  alert("Saved to Firebase ❤️");
}


// ================= SEARCH =================
function liveSearch() {

  const input = document.getElementById("searchInput").value.toLowerCase();

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(input)
  );

  render(filtered);
}
