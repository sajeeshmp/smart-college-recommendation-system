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
// DOM ELEMENTS
// =====================

const result =
  document.getElementById("result");

const popup =
  document.getElementById("popup");

const pName =
  document.getElementById("pName");

const pLocation =
  document.getElementById("pLocation");

const pRating =
  document.getElementById("pRating");

// =====================
// COLLEGE DATA
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
    name: "East Point College",
    exam: "KCET",
    course: "B.Tech",
    branch: "AI & DS",
    location: "Bangalore",
    cutoff: 15000,
    rating: 4.6
  },

  {
    name: "New Horizon College",
    exam: "COMEDK",
    course: "B.Tech",
    branch: "CSE",
    location: "Bangalore",
    cutoff: 5000,
    rating: 4.5
  }

];

// =====================
// UPDATE BRANCHES
// =====================

function updateBranches() {

  let course =
    document.getElementById("course").value;

  let branch =
    document.getElementById("branch");

  const data = {

    "B.Tech": [
      "CSE",
      "ECE",
      "MECH",
      "AI & DS"
    ],

    "B.Com": [
      "Finance",
      "Accounting"
    ],

    "BBA": [
      "Marketing",
      "HR"
    ],

    "B.Sc": [
      "Physics",
      "CS"
    ]
  };

  branch.innerHTML =
    `<option>Select Branch</option>`;

  (data[course] || []).forEach(b => {

    branch.innerHTML += `
      <option>${b}</option>
    `;

  });
}

// =====================
// LOADER
// =====================

function showLoader() {

  result.innerHTML = "";

  for (let i = 0; i < 3; i++) {

    result.innerHTML += `
      <div class="loader-card"></div>
    `;
  }
}

// =====================
// RECOMMEND SYSTEM
// =====================

function recommend() {

  let exam =
    document.getElementById("exam").value;

  let rank =
    parseInt(
      document.getElementById("rank").value
    );

  let course =
    document.getElementById("course").value;

  let branch =
    document.getElementById("branch").value;

  let location =
    document.getElementById("location").value;

  showLoader();

  setTimeout(() => {

    result.innerHTML = "";

    let scored = colleges.map(c => {

      let score = 0;

      if (c.exam === exam) {
        score += 30;
      }

      if (c.course === course) {
        score += 20;
      }

      if (c.branch === branch) {
        score += 20;
      }

      if (c.location === location) {
        score += 10;
      }

      if (rank <= c.cutoff) {
        score += 20;
      }

      if (score < 0) {
        score = 0;
      }

      if (score > 100) {
        score = 100;
      }

      return {
        ...c,
        score
      };

    });

    scored.sort(
      (a, b) => b.score - a.score
    );

    scored.forEach(c => {

      const reason =
        "Good rating ✔ Popular campus ✔ Strong academics ✔";

      result.innerHTML += `

        <div
          class="card"
          onclick="
            openCollege(
              '${c.name}',
              '${c.location}',
              '${c.rating}',
              '${c.score}'
            )
          "
        >

          <h3>${c.name}</h3>

          <p>📍 ${c.location}</p>

          <p>
            🎓 ${c.course}
            - ${c.branch}
          </p>

          <p>
            ⭐ Rating:
            ${c.rating}
          </p>

          <p style="color:#38bdf8;">
            📊 Match Score:
            ${c.score}/100
          </p>

          <div class="score-bar">

            <div
              class="score-fill"
              style="width:${c.score}%"
            ></div>

          </div>

          <div class="ai-text">
            🧠 ${reason}
          </div>

          <button
            onclick="
              event.stopPropagation();
              addFavorite('${c.name}')
            "
          >
            ❤️ Save
          </button>

        </div>

      `;
    });

  }, 700);
}

// =====================
// LIVE SEARCH
// =====================

function liveSearch() {

  let input =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  result.innerHTML = "";

  let filtered = colleges.filter(c =>

    c.name
    .toLowerCase()
    .includes(input)

    ||

    c.location
    .toLowerCase()
    .includes(input)

    ||

    c.course
    .toLowerCase()
    .includes(input)

    ||

    c.branch
    .toLowerCase()
    .includes(input)

  );

  if (filtered.length === 0) {

    result.innerHTML = `
      <div class="no-results">
        No colleges found 😢
      </div>
    `;

    return;
  }

  filtered.forEach(c => {

    result.innerHTML += `

      <div
        class="card"
        onclick="
          openCollege(
            '${c.name}',
            '${c.location}',
            '${c.rating}',
            '85'
          )
        "
      >

        <h3>${c.name}</h3>

        <p>📍 ${c.location}</p>

        <p>
          🎓 ${c.course}
          - ${c.branch}
        </p>

        <p>
          ⭐ ${c.rating}
        </p>

        <p style="color:#38bdf8;">
          ⭐ Trending College
        </p>

        <div class="score-bar">

          <div
            class="score-fill"
            style="width:85%"
          ></div>

        </div>

      </div>

    `;
  });
}

// =====================
// FAVORITES
// =====================

function addFavorite(name) {

  db.collection("favorites").add({

    college: name,
    time: new Date()

  });

  alert("❤️ Saved Successfully");
}

// =====================
// POPUP
// =====================

function openCollege(
  name,
  location,
  rating,
  score
) {

  popup.classList.remove("hidden");

  pName.innerText =
    name;

  pLocation.innerText =
    "📍 " + location;

  pRating.innerText =
    "⭐ " + rating +
    " | 📊 Match Score: " +
    score + "/100";
}

function closePopup() {

  popup.classList.add("hidden");
}
