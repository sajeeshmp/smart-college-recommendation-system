console.log("📊 Compare Page Loaded");

let compareIds =
JSON.parse(
localStorage.getItem("compare")
|| "[]"
);

window.onload = loadCompare;

async function loadCompare(){

    const box =
    document.getElementById(
        "compareContainer"
    );

    if(compareIds.length < 2){

        box.innerHTML = `

        <div class="card">
            <h2>Select 2 Programs First</h2>
        </div>

        `;

        return;
    }

    let programs = [];

    for(const item of compareIds){

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

        const programDoc =
        await collegesCollection
        .doc(collegeId)
        .collection("programs")
        .doc(programId)
        .get();

        if(
            collegeDoc.exists &&
            programDoc.exists
        ){

            programs.push({

                college:
                collegeDoc.data(),

                program:
                programDoc.data()

            });

        }
    }

    if(programs.length < 2){

        box.innerHTML = `

        <div class="card">
            Comparison Data Missing
        </div>

        `;

        return;
    }

    const p1 = programs[0];
    const p2 = programs[1];

    box.innerHTML = `

    <div class="card">

    <table class="compare-table">

        <tr>
            <th>Feature</th>
            <th>${p1.program.branch}</th>
            <th>${p2.program.branch}</th>
        </tr>

        <tr>
            <td>College</td>
            <td>${p1.college.collegeName}</td>
            <td>${p2.college.collegeName}</td>
        </tr>

        <tr>
            <td>City</td>
            <td>${p1.college.city}</td>
            <td>${p2.college.city}</td>
        </tr>

        <tr>
            <td>Course</td>
            <td>${p1.program.course}</td>
            <td>${p2.program.course}</td>
        </tr>

        <tr>
            <td>Branch</td>
            <td>${p1.program.branch}</td>
            <td>${p2.program.branch}</td>
        </tr>

        <tr>
            <td>Fees</td>
            <td>₹${p1.program.fees}</td>
            <td>₹${p2.program.fees}</td>
        </tr>

        <tr>
            <td>KCET Cutoff</td>
            <td>${p1.program.kcetCutoff}</td>
            <td>${p2.program.kcetCutoff}</td>
        </tr>

        <tr>
            <td>COMEDK Cutoff</td>
            <td>${p1.program.comedkCutoff}</td>
            <td>${p2.program.comedkCutoff}</td>
        </tr>

        <tr>
            <td>Management</td>
            <td>${p1.program.managementAvailable ? "Yes" : "No"}</td>
            <td>${p2.program.managementAvailable ? "Yes" : "No"}</td>
        </tr>

    </table>

    <br>

    <button onclick="clearCompare()">
        Clear Compare
    </button>

    </div>

    `;
}

function clearCompare(){

    localStorage.removeItem(
        "compare"
    );

    location.reload();
}
