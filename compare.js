console.log("📊 Compare Page Loaded");

let compareIds =
JSON.parse(
localStorage.getItem("compare") || "[]"
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
            <h2>Select 2 Colleges First</h2>
            <p>Add colleges from Home Page.</p>
        </div>

        `;

        return;
    }

    let colleges = [];

    for(const id of compareIds){

        const collegeDoc =
        await collegesCollection
        .doc(id)
        .get();

        const programs =
        await collegesCollection
        .doc(id)
        .collection("programs")
        .get();

        let branchList = [];
        let feeList = [];
        let kcetList = [];
        let comedkList = [];

        programs.forEach(p=>{

            const data = p.data();

            branchList.push(data.branch);

            feeList.push(data.fees);

            kcetList.push(data.kcetCutoff);

            comedkList.push(data.comedkCutoff);

        });

        colleges.push({

            ...collegeDoc.data(),

            branches:
            branchList.join(", "),

            fees:
            feeList.join(", "),

            kcet:
            kcetList.join(", "),

            comedk:
            comedkList.join(", ")

        });

    }

    const c1 = colleges[0];
    const c2 = colleges[1];

    box.innerHTML = `

    <div class="card">

    <table class="compare-table">

        <tr>
            <th>Feature</th>
            <th>${c1.collegeName}</th>
            <th>${c2.collegeName}</th>
        </tr>

        <tr>
            <td>City</td>
            <td>${c1.city}</td>
            <td>${c2.city}</td>
        </tr>

        <tr>
            <td>State</td>
            <td>${c1.state}</td>
            <td>${c2.state}</td>
        </tr>

        <tr>
            <td>Type</td>
            <td>${c1.collegeType}</td>
            <td>${c2.collegeType}</td>
        </tr>

        <tr>
            <td>Branches</td>
            <td>${c1.branches}</td>
            <td>${c2.branches}</td>
        </tr>

        <tr>
            <td>Fees</td>
            <td>${c1.fees}</td>
            <td>${c2.fees}</td>
        </tr>

        <tr>
            <td>KCET Cutoff</td>
            <td>${c1.kcet}</td>
            <td>${c2.kcet}</td>
        </tr>

        <tr>
            <td>COMEDK Cutoff</td>
            <td>${c1.comedk}</td>
            <td>${c2.comedk}</td>
        </tr>

        <tr>
            <td>Admission Modes</td>
            <td>${c1.admissionModes.join(", ")}</td>
            <td>${c2.admissionModes.join(", ")}</td>
        </tr>

        <tr>
            <td>Website</td>

            <td>
                <a href="${c1.website}"
                target="_blank">
                Visit
                </a>
            </td>

            <td>
                <a href="${c2.website}"
                target="_blank">
                Visit
                </a>
            </td>

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
