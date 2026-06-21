console.log("🛠️ Admin Dashboard Loaded");

/* -------------------------
   PAGE LOAD
--------------------------*/

window.onload = () => {

    loadColleges();

};

/* -------------------------
   ADD COLLEGE
--------------------------*/

async function addCollege() {

    try {

        const collegeCode =
            document.getElementById("collegeCode")
            .value
            .trim();

        const collegeName =
            document.getElementById("collegeName")
            .value
            .trim();

        const city =
            document.getElementById("city")
            .value
            .trim();

        const state =
            document.getElementById("state")
            .value
            .trim();

        const collegeType =
            document.getElementById("collegeType")
            .value
            .trim();

        const website =
            document.getElementById("website")
            .value
            .trim();

        const admissionModes =
            document.getElementById("admissionModes")
            .value
            .split(",")
            .map(item => item.trim());

        if (
            !collegeCode ||
            !collegeName
        ) {

            alert(
                "College Code and Name are required"
            );

            return;
        }

        await collegesCollection
            .doc(collegeCode)
            .set({

                collegeCode,
                collegeName,
                city,
                state,
                collegeType,
                website,
                admissionModes

            });

        alert("✅ College Added");

        clearCollegeForm();

        loadColleges();

    } catch (err) {

        console.error(err);

        alert(
            "Failed to add college"
        );

    }

}

/* -------------------------
   ADD PROGRAM
--------------------------*/

async function addProgram() {

    try {

        const collegeCode =
            document.getElementById(
                "programCollegeCode"
            ).value.trim();

        const programId =
            document.getElementById(
                "programId"
            ).value.trim();

        const branch =
            document.getElementById(
                "branch"
            ).value.trim();

        const course =
            document.getElementById(
                "course"
            ).value.trim();

        const fees =
            Number(
                document.getElementById(
                    "fees"
                ).value
            );

        const kcetCutoff =
            Number(
                document.getElementById(
                    "kcetCutoff"
                ).value
            );

        const comedkCutoff =
            Number(
                document.getElementById(
                    "comedkCutoff"
                ).value
            );

        const managementAvailable =
            document.getElementById(
                "managementAvailable"
            ).value === "true";

        if (
            !collegeCode ||
            !programId
        ) {

            alert(
                "College Code and Program ID required"
            );

            return;
        }

        await collegesCollection
            .doc(collegeCode)
            .collection("programs")
            .doc(programId)
            .set({

                branch,
                course,
                fees,
                kcetCutoff,
                comedkCutoff,
                managementAvailable

            });

        alert("✅ Program Added");

        clearProgramForm();

        loadColleges();

    } catch (err) {

        console.error(err);

        alert(
            "Failed to add program"
        );

    }

}

/* -------------------------
   LOAD COLLEGES
--------------------------*/

async function loadColleges() {

    const container =
        document.getElementById(
            "collegeList"
        );

    container.innerHTML = "";

    try {

        const snapshot =
            await collegesCollection.get();

        for (const doc of snapshot.docs) {

            const college =
                doc.data();

            const programsSnapshot =
                await collegesCollection
                    .doc(doc.id)
                    .collection("programs")
                    .get();

            let programHTML = "";

            programsSnapshot.forEach(
                programDoc => {

                const p =
                    programDoc.data();

                programHTML += `

                <div style="
                    margin-top:10px;
                    padding:10px;
                    border-radius:12px;
                    background:
                    rgba(255,255,255,.05);
                ">

                    <b>${programDoc.id}</b>

                    <p>
                        ${p.branch}
                    </p>

                    <p>
                        ₹${Number(
                            p.fees || 0
                        ).toLocaleString()}
                    </p>

                </div>

                `;

            });

            container.innerHTML += `

            <div class="card">

                <h3>
                    ${college.collegeName || "College"}
                </h3>

                <p>
                    Code:
                    ${college.collegeCode}
                </p>

                <p>
                    📍 ${college.city}
                </p>

                <p>
                    ${college.collegeType}
                </p>

                ${programHTML}

                <button
                    onclick="deleteCollege(
                        '${doc.id}'
                    )">

                    Delete College

                </button>

            </div>

            `;

        }

    } catch (err) {

        console.error(err);

        container.innerHTML = `

        <div class="card">
            Failed to load colleges.
        </div>

        `;

    }

}

/* -------------------------
   DELETE COLLEGE
--------------------------*/

async function deleteCollege(id) {

    const confirmDelete =
        confirm(
            "Delete this college?"
        );

    if (!confirmDelete)
        return;

    try {

        const programs =
            await collegesCollection
                .doc(id)
                .collection("programs")
                .get();

        const batch =
            db.batch();

        programs.forEach(doc => {

            batch.delete(
                doc.ref
            );

        });

        await batch.commit();

        await collegesCollection
            .doc(id)
            .delete();

        alert(
            "College Deleted"
        );

        loadColleges();

    } catch (err) {

        console.error(err);

        alert(
            "Failed to delete college"
        );

    }

}

/* -------------------------
   CLEAR FORMS
--------------------------*/

function clearCollegeForm() {

    document.getElementById(
        "collegeCode"
    ).value = "";

    document.getElementById(
        "collegeName"
    ).value = "";

    document.getElementById(
        "city"
    ).value = "";

    document.getElementById(
        "state"
    ).value = "";

    document.getElementById(
        "collegeType"
    ).value = "";

    document.getElementById(
        "website"
    ).value = "";

    document.getElementById(
        "admissionModes"
    ).value = "";

}

function clearProgramForm() {

    document.getElementById(
        "programCollegeCode"
    ).value = "";

    document.getElementById(
        "programId"
    ).value = "";

    document.getElementById(
        "branch"
    ).value = "";

    document.getElementById(
        "course"
    ).value = "";

    document.getElementById(
        "fees"
    ).value = "";

    document.getElementById(
        "kcetCutoff"
    ).value = "";

    document.getElementById(
        "comedkCutoff"
    ).value = "";

}
