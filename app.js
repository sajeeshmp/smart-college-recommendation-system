console.log("🚀 Smart College");

let currentUser = null;
let colleges = [];

let compareList =
JSON.parse(
localStorage.getItem("compare")
|| "[]"
);

/* =========================
   AUTH STATE
========================= */

auth.onAuthStateChanged(user=>{

currentUser = user;

const userInfo =
document.getElementById(
"userInfo"
);

if(!userInfo) return;

if(user){

userInfo.innerHTML =
`👤 ${user.email}`;

}else{

userInfo.innerHTML =
"Guest User";

}

});

/* =========================
   LOGOUT
========================= */

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

const locationSelect =
document.getElementById("location");

const examSelect =
document.getElementById("exam");

if(locationSelect && examSelect){

    locationSelect.addEventListener(
    "change",
    function(){

        if(
            this.value === "Chennai" ||
            this.value === "Thiruvananthapuram"
        ){

            examSelect.innerHTML = `
                <option value="">
                    Select Exam
                </option>

                <option value="Management">
                    Management
                </option>
            `;

        }else{

            examSelect.innerHTML = `
                <option value="">
                    Select Exam
                </option>

                <option value="KCET">
                    KCET
                </option>

                <option value="COMEDK">
                    COMEDK
                </option>

                <option value="Management">
                    Management
                </option>
            `;
        }

    });

}
/* =========================
   START
========================= */

window.onload = ()=>{

loadColleges();

};

/* =========================
   LOAD COLLEGES
========================= */

async function loadColleges(){

try{

colleges = [];

const snapshot =
await collegesCollection.get();

for(const collegeDoc of snapshot.docs){

const collegeData =
collegeDoc.data();

const programSnap =
await collegesCollection
.doc(collegeDoc.id)
.collection("programs")
.get();

programSnap.forEach(programDoc=>{

const program =
programDoc.data();

colleges.push({

id:
collegeDoc.id,

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
Number(
program.fees || 0
),

kcetCutoff:
Number(
program.kcetCutoff || 0
),

comedkCutoff:
Number(
program.comedkCutoff || 0
),

managementAvailable:
program.managementAvailable
|| false

});

});

}

console.log(
"Loaded Colleges:",
colleges.length
);

populateBranches();

render(colleges);

}catch(err){

console.error(err);

document.getElementById(
"result"
).innerHTML = `

<div class="card">

<h2>
Failed To Load Colleges
</h2>

</div>

`;

}

}

/* =========================
   COURSE -> BRANCH
========================= */

function updateBranches(){

const course =
document.getElementById(
"course"
).value;

const branch =
document.getElementById(
"branch"
);

let options = [];

if(course === "B.Tech"){

options = [

"CSE",
"AI&ML",
"AI&DS",
"ISE",
"ECE",
"IOT",

];

}

else if(course === "BBA"){

options = [

"Finance",
"Marketing",
"HR"

];

}

else if(course === "BCA"){

options = [

"General",
"Data Analytics"

];

}

else if(course === "B.Com"){

options = [

"General",
"Accounts"

];

}

else if(course === "B.Sc"){

options = [

"Physics",
"Chemistry",
"Mathematics",
"Computer Science"

];

}

branch.innerHTML =

`<option value="">
Select Branch
</option>`;

options.forEach(item=>{

branch.innerHTML +=

`<option value="${item}">
${item}
</option>`;

});

}

/* =========================
   POPULATE BRANCHES
========================= */

function populateBranches(){

const branch =
document.getElementById(
"branch"
);

if(!branch) return;

branch.innerHTML =

`<option value="">
Select Branch
</option>`;

}

/* =========================
   RECOMMEND
========================= */

function recommend(){

const exam =
document.getElementById(
"exam"
).value;

const rank =
Number(
document.getElementById(
"rank"
).value
);

const course =
document.getElementById(
"course"
).value;

const branch =
document.getElementById(
"branch"
).value;

const location =
document.getElementById(
"location"
).value;

const maxFees =
Number(
document.getElementById(
"feesFilter"
).value
);

let results = [];

colleges.forEach(c=>{

let score = 0;

if(
course &&
c.course === course
){
score += 25;
}

if(
branch &&
c.branch === branch
){
score += 30;
}

if(
location &&
c.city === location
){
score += 15;
}

if(
maxFees > 0 &&
c.fees <= maxFees
){
score += 15;
}

if(exam === "KCET"){

if(
c.admissionModes.includes(
"KCET"
)
){
score += 20;
}

if(
rank > 0 &&
c.kcetCutoff > 0 &&
rank <= c.kcetCutoff
){
score += 30;
}

}

if(exam === "COMEDK"){

if(
c.admissionModes.includes(
"COMEDK"
)
){
score += 20;
}

if(
rank > 0 &&
c.comedkCutoff > 0 &&
rank <= c.comedkCutoff
){
score += 30;
}

}

if(
exam === "Management" &&
c.managementAvailable
){
score += 40;
}

if(score > 0){

results.push({

...c,
score

});

}

});

results.sort(
(a,b)=>b.score-a.score
);

render(results);

}
/* =========================
   RENDER
========================= */

function render(list){

const box =
document.getElementById(
"result"
);

if(!box) return;

box.innerHTML = "";

if(list.length === 0){

box.innerHTML = `

<div class="card">

<h2>
No Colleges Found
</h2>

</div>

`;

return;

}

list.forEach((c,index)=>{

const match =
Math.min(
100,
c.score || 50
);

const badge =
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

if(c.course)
reasons.push("Course Match");

if(c.branch)
reasons.push("Branch Match");

if(c.fees)
reasons.push("Budget Check");

box.innerHTML += `

<div class="card">

${badge}

<h3>
<h3>${c.collegeName}</h3>
</h3>

<p>
📍 ${c.city}
</p>

<p>
🎓 ${c.branch}
</p>

<p>
📚 ${c.course}
</p>

<p>
💰 ₹${Number(
c.fees
).toLocaleString()}
</p>

<p>
📊 Match Score:
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

<button
onclick="showDetails(
'${c.id}',
'${c.programId}'
)">

View Details

</button>

<button
onclick="addCompare(
'${c.id}_${c.programId}'
)">

Compare

</button>

<button
onclick="addFav(
'${c.id}'
)">

Favorite

</button>

</div>

`;

});

}

/* =========================
   COMPARE
========================= */

function addCompare(id){

if(compareList.includes(id)){

alert(
"Already Added"
);

return;

}

if(compareList.length >= 2){

alert(
"Maximum 2 Programs"
);

return;

}

compareList.push(id);

localStorage.setItem(

"compare",

JSON.stringify(
compareList
)

);

alert(
"Added To Compare"
);

}

/* =========================
   POPUP
========================= */

function showDetails(id, programId){

    const c =
    colleges.find(
    x =>
    x.id === id &&
    x.programId === programId
    );

if(!c) return;

    document
    .getElementById("popup")
    .classList
    .remove("hidden");

    document
    .getElementById("pName")
    .innerHTML =
    `🏛️ ${c.collegeName}`;

    document
    .getElementById("pLocation")
    .innerText =
    `📍 ${c.city}, ${c.state}`;

    document
    .getElementById("pBranch")
    .innerText =
    `🎓 Branch: ${c.branch}`;

    document
    .getElementById("pCourse")
    .innerText =
    `📚 Course: ${c.course}`;

    document
    .getElementById("pFees")
    .innerText =
    `💰 Fees: ₹${Number(
        c.fees || 0
    ).toLocaleString()}`;

    document
    .getElementById("pType")
    .innerText =
    `🏫 Type: ${
        c.collegeType || "N/A"
    }`;

    document
    .getElementById("pWebsite")
    .innerHTML =

    `🌐 Website:
    <a href="${c.website}"
       target="_blank"
       style="
       color:#60a5fa;
       text-decoration:none;
       font-weight:600;">
       Visit Website
    </a>`;

    document
    .getElementById("pCutoff")
    .innerText =

    `📊 
    KCET Cutoff: ${
    c.kcetCutoff || "N/A"
    }
   COMEDK Cutoff: ${
    c.comedkCutoff || "N/A"
    }`;
}

function closePopup(){

const popup =
document.getElementById(
"popup"
);

if(!popup) return;

popup.classList.add(
"hidden"
);

}

/* =========================
   FAVORITES
========================= */

async function addFav(id){

if(!currentUser){

alert(
"Please Login First"
);

window.location.href =
"login.html";

return;

}

try{

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

if(!existing.empty){

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

}catch(err){

console.error(err);

alert(
"Failed To Save Favorite"
);

}

}

