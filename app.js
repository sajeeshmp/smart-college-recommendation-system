console.log("🚀 Smart College");

let currentUser = null;
let colleges = [];

let compareList =
JSON.parse(
    localStorage.getItem("compare") || "[]"
);

/* -------------------------
   AUTH STATE
--------------------------*/

auth.onAuthStateChanged(user => {

    currentUser = user;

    console.log(
        "Current User:",
        user ? user.email : "None"
    );

    const userInfo =
        document.getElementById("userInfo");

    if (!userInfo) return;

    if (user) {

        userInfo.innerHTML =
            `👤 Logged in as: ${user.email}`;

    } else {

        userInfo.innerHTML =
            `Guest User`;

    }

});

/* -------------------------
   START
--------------------------*/

window.onload = loadColleges;

/* -------------------------
   LOAD COLLEGES
--------------------------*/

async function loadColleges() {

    try {

        colleges = [];

        const collegeSnap =
            await collegesCollection.get();

        for (const collegeDoc of collegeSnap.docs) {

            const collegeData =
                collegeDoc.data();

            const programSnap =
                await collegesCollection
                    .doc(collegeDoc.id)
                    .collection("programs")
                    .get();

            programSnap.forEach(programDoc => {

                const program =
                    programDoc.data();

                colleges.push({

                    id: collegeDoc.id,

                    programId:
                        programDoc.id,

                    collegeName:
                        collegeData.collegeName || "",

                    city:
                        collegeData.city || "",

                    state:
                        collegeData.state || "",

                    collegeType:
                        collegeData.collegeType || "",

                    website:
                        collegeData.website || "",

                    admissionModes:
                        collegeData.admissionModes || [],

                    branch:
                        program.branch || "",

                    course:
                        program.course || "",

                    fees:
                        Number(program.fees || 0),

                    kcetCutoff:
                        Number(
                            program.kcetCutoff || 0
                        ),

                    comedkCutoff:
                        Number(
                            program.comedkCutoff || 0
                        ),

                    managementAvailable:
                        program.managementAvailable || false

                });

            });

        }

        console.log(
            "Loaded Colleges:",
            colleges.length
        );

        populateBranches();

        render(colleges);

    } catch (err) {

        console.error(err);

        document.getElementById(
            "result"
        ).innerHTML = `

        <div class="card">
            <h3>Error Loading Colleges</h3>
        </div>

        `;
    }

}

/* -------------------------
   BRANCHES
--------------------------*/

function populateBranches() {

    const branchSelect =
        document.getElementById("branch");

    if (!branchSelect) return;

    const branches =
        [...new Set(
            colleges.map(c => c.branch)
        )];

    branchSelect.innerHTML =
        `<option value="">
            Select Branch
        </option>`;

    branches.sort().forEach(branch => {

        branchSelect.innerHTML +=

        `<option value="${branch}">
            ${branch}
        </option>`;

    });

}

/* -------------------------
   RECOMMEND
--------------------------*/

function recommend() {

    const exam =
        document.getElementById("exam").value;

    const rank =
        Number(
            document.getElementById("rank").value
        );

    const course =
        document.getElementById("course").value;

    const branch =
        document.getElementById("branch").value;

    const location =
        document.getElementById("location").value;

    const maxFees =
        Number(
            document.getElementById("feesFilter").value
        );

    let results = [];

    colleges.forEach(c => {

        let score = 0;

        if (
            course &&
            c.course === course
        ) {
            score += 25;
        }

        if (
            branch &&
            c.branch === branch
        ) {
            score += 30;
        }

        if (
            location &&
            c.city === location
        ) {
            score += 15;
        }

        if (
            maxFees > 0 &&
            c.fees <= maxFees
        ) {
            score += 15;
        }

        if (exam === "KCET") {

            if (
                c.admissionModes.includes(
                    "KCET"
                )
            ) {
                score += 20;
            }

            if (
                rank > 0 &&
                c.kcetCutoff > 0 &&
                rank <= c.kcetCutoff
            ) {
                score += 30;
            }

        }

        if (exam === "COMEDK") {

            if (
                c.admissionModes.includes(
                    "COMEDK"
                )
            ) {
                score += 20;
            }

            if (
                rank > 0 &&
                c.comedkCutoff > 0 &&
                rank <= c.comedkCutoff
            ) {
                score += 30;
            }

        }

        if (
            exam === "Management" &&
            c.managementAvailable
        ) {
            score += 40;
        }

        if (score > 0) {

            results.push({
                ...c,
                score
            });

        }

    });

    results.sort(
        (a, b) => b.score - a.score
    );

    render(results);

}

/* -------------------------
   RENDER
--------------------------*/
function render(list){

    const box =
    document.getElementById("result");

    box.innerHTML = "";

    if(list.length === 0){

        box.innerHTML = `
        <div class="card">
            <h2>No Colleges Found</h2>
        </div>
        `;

        return;
    }

    list.forEach((c,index)=>{

        let match =
        Math.min(
            100,
            c.score || 50
        );

        let badge =
        index === 0
        ?
        `<div class="score">
            🏆 TOP MATCH
         </div>`
        :
        `<div class="score">
            ⭐ ${match}% Match
         </div>`;

        let reasons = [];

        if(c.score >= 20)
            reasons.push("Course Match");

        if(c.score >= 40)
            reasons.push("Branch Match");

        if(c.score >= 60)
            reasons.push("Budget Friendly");

        if(c.score >= 80)
            reasons.push("Exam Eligible");

        box.innerHTML += `

        <div class="card">

            ${badge}

            <h3>
                ${c.collegeName}
            </h3>

            <p>
                📍 ${c.city}
            </p>

            <p>
                🎓 ${c.branch}
            </p>

            <p>
                💰 ₹${c.fees}
            </p>

            <p>
                📊 AI Score:
                ${c.score || 0}
            </p>

            <hr>

            <p>
                💡 Why Recommended?
            </p>

            <ul>

                ${reasons.map(
                    r=>`<li>${r}</li>`
                ).join("")}

            </ul>

            <br>

            <button onclick="showDetails('${c.id}')">
                View Details
            </button>

            <button onclick="addCompare('${c.id}')">
                Compare
            </button>

            <button onclick="addFav('${c.id}')">
                Favorite
            </button>

        </div>

        `;
    });
}

/* -------------------------
   COMPARE
--------------------------*/
function addCompare(id){

    if(compareList.includes(id)){

        alert(
            "Already Added"
        );

        return;
    }

    if(compareList.length >= 2){

        alert(
            "Maximum 2 Colleges"
        );

        return;
    }

    compareList.push(id);

    localStorage.setItem(
        "compare",
        JSON.stringify(compareList)
    );

    alert(
        "Added To Compare"
    );
}

function showDetails(id){

    const c =
    colleges.find(
        x => x.id === id
    );

    if(!c) return;

    document
    .getElementById("popup")
    .classList
    .remove("hidden");

    document
    .getElementById("pName")
    .innerText =
    c.collegeName;

    document
    .getElementById("pLocation")
    .innerText =
    "📍 " + c.city;

    document
    .getElementById("pBranch")
    .innerText =
    "🎓 " + c.branch;

    document
    .getElementById("pFees")
    .innerText =
    "💰 ₹" + c.fees;

    document
    .getElementById("pExam")
    .innerText =
    "📝 " +
    (c.admissionModes || [])
    .join(", ");

    document
    .getElementById("pCutoff")
    .innerText =
    "KCET: " +
    c.kcetCutoff +
    " | COMEDK: " +
    c.comedkCutoff;
}

function closePopup(){

    document
    .getElementById("popup")
    .classList
    .add("hidden");
}

/* -------------------------
   FAVORITES
--------------------------*/

async function addFav(id) {

    if (!currentUser) {

        alert(
            "Please Login First"
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const existing =
            await favoritesCollection
                .where(
                    "userId",
                    "==",
                    currentUser.uid
                )
                .where(
                    "collegeId",
                    "==",
                    id
                )
                .get();

        if (!existing.empty) {

            alert(
                "Already In Favorites"
            );

            return;
        }

        await favoritesCollection.add({

            userId:
                currentUser.uid,

            collegeId:
                id,

            createdAt:
                new Date()

        });

        alert(
            "Added To Favorites ❤️"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Failed To Save Favorite"
        );

    }

}
async function logout(){

    try{

        await auth.signOut();

        alert("Logged Out");

        window.location.href =
        "login.html";

    }catch(err){

        console.error(err);

    }
}
