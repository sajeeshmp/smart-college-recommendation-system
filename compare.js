console.log("📊 Compare Page Loaded");

let compareIds =
JSON.parse(localStorage.getItem("compare") || "[]");

window.onload = loadCompare;

async function loadCompare(){

    const box =
    document.getElementById("compareContainer");

    box.innerHTML = "";

    if(compareIds.length < 2){

        box.innerHTML = `
        <div class="card">
            <h2>Select 2 programs to compare</h2>
        </div>
        `;
        return;
    }

    try{

        let compareData = [];

        for(const item of compareIds){

            if(!item.includes("_")){
                continue;
            }

            const parts = item.split("_");

            const collegeId = parts[0];
            const programId = parts.slice(1).join("_");

            if(!collegeId || !programId){
                continue;
            }

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

                compareData.push({

                    college:
                    collegeDoc.data(),

                    program:
                    programDoc.data()

                });

            }
        }

        if(compareData.length < 2){

            box.innerHTML = `
            <div class="card">
                <h2>Compare data invalid</h2>
                <p>
                    Clear compare list and add
                    two programs again.
                </p>
            </div>
            `;
            return;
        }

        const c1 = compareData[0];
        const c2 = compareData[1];

        box.innerHTML = `

        <table class="compare-table">

            <tr>
                <th>Feature</th>
                <th>${c1.college.collegeName}</th>
                <th>${c2.college.collegeName}</th>
            </tr>

            <tr>
                <td>City</td>
                <td>${c1.college.city}</td>
                <td>${c2.college.city}</td>
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
                <td>₹${c1.program.fees}</td>
                <td>₹${c2.program.fees}</td>
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

        <br>

        <button onclick="clearCompare()">
            Clear Compare
        </button>

        `;

    }catch(err){

        console.error(err);

        box.innerHTML = `
        <div class="card">
            <h2>Error Loading Compare</h2>
            <p>${err.message}</p>
        </div>
        `;
    }
}

function clearCompare(){

    localStorage.removeItem("compare");

    location.reload();
}
