console.log("📊 Compare Loaded");

let compareData =
JSON.parse(
localStorage.getItem("compare")
|| "[]"
);

window.onload =
loadCompare;

async function loadCompare(){

const box =
document.getElementById(
"compareContainer"
);

if(compareData.length < 2){

box.innerHTML = `

<div class="card">

<h2>
Select 2 Programs
</h2>

</div>

`;

return;

}

const items = [];

for(const item of compareData){

const parts =
item.split("_");

const collegeId =
parts[0];

const programId =
parts.slice(1).join("_");

const collegeDoc =
await collegesCollection
.doc(collegeId)
.get();

if(!collegeDoc.exists)
continue;

const programDoc =
await collegesCollection
.doc(collegeId)
.collection("programs")
.doc(programId)
.get();

if(!programDoc.exists)
continue;

items.push({

college:
collegeDoc.data(),

program:
programDoc.data()

});

}

if(items.length < 2){

box.innerHTML = `

<div class="card">

<h2>
Not Enough Data
</h2>

</div>

`;

return;

}

const c1 = items[0];
const c2 = items[1];

box.innerHTML = `

<table class="compare-table">

<tr>
<th>Feature</th>
<th>${c1.collegeName}</th>
<th>${c2.collegeName}</th>
</tr>

<tr>
<td>City</td>
<td>${c1.college.city}</td>
<td>${c2.college.city}</td>
</tr>

<tr>
<td>Type</td>
<td>${c1.college.collegeType}</td>
<td>${c2.college.collegeType}</td>
</tr>

<tr>
<td>Branch</td>
<td>${c1.program.branch}</td>
<td>${c2.program.branch}</td>
</tr>

<tr>
<td>Course</td>
<td>${c1.program.course}</td>
<td>${c2.program.course}</td>
</tr>

<tr>
<td>Fees</td>
<td>₹${Number(c1.program.fees).toLocaleString()}</td>
<td>₹${Number(c2.program.fees).toLocaleString()}</td>
</tr>

<tr>
<td>KCET Cutoff</td>
<td>${c1.program.kcetCutoff}</td>
<td>${c2.program.kcetCutoff}</td>
</tr>

<tr>
<td>COMEDK Cutoff</td>
<td>${c1.program.comedkCutoff}</td>
<td>${c2.program.comedkCutoff}</td>
</tr>

</table>

`;
}
