console.log("📊 Compare Page Loaded");

let compareIds =
JSON.parse(
localStorage.getItem("compare") || "[]"
);

window.onload = loadCompare;

async function loadCompare() {

    const box =
        document.getElementById("compareBox");

    box.innerHTML = "";

    if (compareIds.length === 0) {

        box.innerHTML = `
        <div class="card">
            <h2>No Colleges Selected</h2>
            <p>Add colleges from Home Page.</p>
        </div>
        `;

        return;
    }

    try {

        for (const id of compareIds) {

            const collegeDoc =
                await collegesCollection
                    .doc(id)
                    .get();

            if (!collegeDoc.exists)
                continue;

            const college =
                collegeDoc.data();

            const programSnap =
                await collegesCollection
                    .doc(id)
                    .collection("programs")
                    .get();

            let programHTML = "";

            programSnap.forEach(program => {

                const p = program.data();

                programHTML += `

                <div style="
                    margin-top:10px;
                    padding:10px;
                    background:rgba(255,255,255,.05);
                    border-radius:12px;
                ">

                    <h4>${p.branch}</h4>

                    <p>
                    Course:
                    ${p.course}
                    </p>

                    <p>
                    Fees:
                    ₹${Number(p.fees)
                        .toLocaleString()}
                    </p>

                    <p>
                    KCET:
                    ${p.kcetCutoff || "N/A"}
                    </p>

                    <p>
                    COMEDK:
                    ${p.comedkCutoff || "N/A"}
                    </p>

                </div>

                `;

            });

            box.innerHTML += `

            <div class="card">

                <h2>
                ${college.collegeName}
                </h2>

                <p>
                📍 ${college.city}
                </p>

                <p>
                🏛️ ${college.collegeType || ""}
                </p>

                <p>
                🎯 Admission:
                ${(college.admissionModes || [])
                    .join(", ")}
                </p>

                ${programHTML}

                <button
                onclick="removeCollege('${id}')">
                Remove
                </button>

            </div>

            `;

        }

    } catch (err) {

        console.error(err);

        box.innerHTML =
        `<div class="card">
            Error Loading Compare Page
        </div>`;
    }

}

function removeCollege(id) {

    compareIds =
    compareIds.filter(x => x !== id);

    localStorage.setItem(
        "compare",
        JSON.stringify(compareIds)
    );

    loadCompare();
}
