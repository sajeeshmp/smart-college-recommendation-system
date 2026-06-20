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

            <h2>
                Select at least
                2 colleges
            </h2>

        </div>

        `;

        return;
    }

    let colleges = [];

    for(const id of compareIds){

        const doc =
        await collegesCollection
        .doc(id)
        .get();

        if(doc.exists){

            colleges.push(
                doc.data()
            );
        }
    }

    if(colleges.length < 2){

        box.innerHTML =
        "<div class='card'>Not enough colleges selected</div>";

        return;
    }

    const c1 = colleges[0];
    const c2 = colleges[1];

    box.innerHTML = `

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
            <td>${c1.state || "-"}</td>
            <td>${c2.state || "-"}</td>
        </tr>

        <tr>
            <td>Type</td>
            <td>${c1.collegeType || "-"}</td>
            <td>${c2.collegeType || "-"}</td>
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

    `;
}
