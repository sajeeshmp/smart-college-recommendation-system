
// =====================
// FIREBASE INIT
// =====================
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase Ready");

// =====================
// DOM ELEMENTS (SAFE)
// =====================
const result = document.getElementById("result") || { innerHTML: "" };
const reviewsContainer = document.getElementById("reviewsContainer") || { innerHTML: "" };
const favoritesContainer = document.getElementById("favoritesContainer") || { innerHTML: "" };

const recommendSection = document.getElementById("recommendSection");
const reviewsSection = document.getElementById("reviewsSection");
const favoritesSection = document.getElementById("favoritesSection");

// popup elements (SAFE)
const popup = document.getElementById("popup");
const pName = document.getElementById("pName");
const pLocation = document.getElementById("pLocation");
const pRating = document.getElementById("pRating");

// =====================
// DATA
// =====================
const colleges = [
  {
    name: "RV College",
    exam: "KCET",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 1200,
    rating: 4.8
  },
  {
    name: "BMS College",
    exam: "KCET",
    course: "B.Tech",
    branch: "ECE",
    location: "Bangalore",
    cutoff: 3000,
    rating: 4.5
  },
  {
    name: "MSRIT",
    exam: "COMEDK",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 5000,
    rating: 4.6
  }
];

// =====================
// BRANCH UPDATE
// =====================
function updateBranches() {

  let course = document.getElementById("course")?.value;
  let branch = document.getElementById("branch");

  if (!branch) return;

  const data = {
    "B.Tech": ["CSE", "ECE", "MECH"],
    "B.Com": ["Finance", "Accounting"],
    "BBA": ["Marketing", "HR"],
    "B.Sc": ["Physics", "CS"]
  };

  branch.innerHTML = "";

  (data[course] || []).forEach(b => {
    branch.innerHTML += `<option>${b}</option>`;
  });
}

// =====================
// LOADER
// =====================
function showLoader() {

  result.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    result.innerHTML += `<div class="loader-card"></div>`;
  }
}

// =====================
// RECOMMEND SYSTEM
// =====================
function recommend() {

  let exam = document.getElementById("exam").value;
  let rank = parseInt(document.getElementById("rank").value);

  showLoader();

  setTimeout(() => {

    result.innerHTML = "";

    let scored = colleges.map(c => {

      let score = 0;

      if (c.exam === exam) score += 30;
      if (c.course === document.getElementById("course").value) score += 20;
      if (c.branch === document.getElementById("branch").value) score += 20;
      if (c.location === document.getElementById("location").value) score += 10;
      if (rank <= c.cutoff) score += 20;
      if (score < 0) {
    score = 0;
  }

  if (score > 100) {
    score = 100;
  }
   return { ...c, score };
    });

    scored.sort((a, b) => b.score - a.score);

    scored.forEach(c => {

      result.innerHTML += `
        <div class="card" onclick="openCollege('${c.name}', '${c.location}', '${c.rating}', ${c.score})">

          <h3>${c.name}</h3>

          <p>📍 ${c.location}</p>
          <p>🎓 ${c.course} - ${c.branch}</p>
          <p>⭐ Rating: ${c.rating}</p>

          <p style="color:#38bdf8;">
            📊 Match Score: ${c.score}/100
          </p>

          <button onclick="event.stopPropagation(); addFavorite('${c.name}')">
            ❤️ Save
          </button>

        </div>
      `;
    });

  }, 700);
}

// =====================
// REVIEWS
// =====================
function submitReview() {

  const college = document.getElementById("reviewCollege")?.value;
  const rating = document.getElementById("rating")?.value;
  const review = document.getElementById("reviewText")?.value;

  db.collection("reviews").add({
    college,
    rating,
    review,
    time: new Date()
  });

  alert("💬 Review Saved");
}

// =====================
// LOAD REVIEWS
// =====================
db.collection("reviews")
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {

    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      reviewsContainer.innerHTML += `
        <div class="card">
          <h3>${data.college}</h3>
          <p>⭐ ${data.rating}/5</p>
          <p>${data.review}</p>
        </div>
      `;
    });
  });

// =====================
// LOAD FAVORITES
// =====================
db.collection("favorites")
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {

    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      favoritesContainer.innerHTML += `
        <div class="card">
          <h3>❤️ ${data.college}</h3>
        </div>
      `;
    });
  });

// =====================
// TABS
// =====================
function showTab(tab) {

  if (recommendSection) recommendSection.style.display = "none";
  if (reviewsSection) reviewsSection.style.display = "none";
  if (favoritesSection) favoritesSection.style.display = "none";

  if (tab === "recommend") recommendSection.style.display = "block";
  if (tab === "reviews") reviewsSection.style.display = "block";
  if (tab === "favorites") favoritesSection.style.display = "block";
}

// =====================
// POPUP (FIXED - NO DUPLICATE)
// =====================
function openCollege(name, location, rating, score) {

  document.getElementById("popup").classList.remove("hidden");

  document.getElementById("pName").innerText = name;
  document.getElementById("pLocation").innerText = "📍 " + location;
  document.getElementById("pRating").innerText =
    "⭐ " + rating + " | 📊 Match Score: " + score + "/100";
}

function closePopup() {
  if (popup) popup.classList.add("hidden");
}
function liveSearch() {

  let input = document.getElementById("searchInput").value.toLowerCase();

  result.innerHTML = "";

  let filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(input) ||
    c.location.toLowerCase().includes(input) ||
    c.course.toLowerCase().includes(input) ||
    c.branch.toLowerCase().includes(input)
  );

  if (filtered.length === 0) {
    result.innerHTML = `<p style="text-align:center;">No colleges found 😢</p>`;
    return;
  }

  filtered.forEach(c => {
   const reason =
  (c.exam === exam ? "Exam match ✔ " : "") +
  (c.course === document.getElementById("course").value ? "Course match ✔ " : "") +
  (c.branch === document.getElementById("branch").value ? "Branch match ✔ " : "") +
  (rank <= c.cutoff ? "Good cutoff ✔ " : "");

result.innerHTML += `
  <div class="card" onclick="openCollege('${c.name}', '${c.location}', '${c.rating}', ${c.score})">

    <h3>${c.name}</h3>

    <p>📍 ${c.location}</p>
    <p>🎓 ${c.course} - ${c.branch}</p>
    <p>⭐ Rating: ${c.rating}</p>

    <p style="color:#38bdf8;">📊 Match Score: ${c.score}/100</p>

    <div class="score-bar">
      <div class="score-fill" style="width:${c.score}%"></div>
    </div>

    <div class="ai-text">
      🧠 Why this college: ${reason || "General match based on profile"}
    </div>

    <button onclick="event.stopPropagation(); addFavorite('${c.name}')">
      ❤️ Save
    </button>

  </div>
`;
  });
}
