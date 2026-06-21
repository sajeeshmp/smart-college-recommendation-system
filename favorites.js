console.log("❤️ Favorites Page Loaded");

let currentUser = null;

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        document.getElementById(
            "favoritesContainer"
        ).innerHTML = `

        <div class="card">
            <h2>Login Required</h2>
            <p>
                Please login to view
                your favorite colleges.
            </p>
        </div>

        `;

        return;
    }

    currentUser = user;

    loadFavorites();

});

/* -------------------------
   LOAD FAVORITES
--------------------------*/

async function loadFavorites() {

    const container =
        document.getElementById(
            "favoritesContainer"
        );

    container.innerHTML = "";

    try {

        const favSnap =
            await favoritesCollection
                .where(
                    "userId",
                    "==",
                    currentUser.uid
                )
                .get();

        if (favSnap.empty) {

            container.innerHTML = `

            <div class="card">
                <h2>No Favorites Yet</h2>
                <p>
                    Save colleges from the
                    recommendation page.
                </p>
            </div>

            `;

            return;
        }

        for (const favDoc of favSnap.docs) {

            const fav = favDoc.data();

            const collegeDoc =
                await collegesCollection
                    .doc(fav.collegeId)
                    .get();

            if (!collegeDoc.exists)
                continue;

            const college =
                collegeDoc.data();

            const programSnap =
                await collegesCollection
                    .doc(fav.collegeId)
                    .collection("programs")
                    .get();

            let programInfo = "";

            programSnap.forEach(program => {

                const p = program.data();

                programInfo += `

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
                        ₹${Number(
                            p.fees || 0
                        ).toLocaleString()}
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

            container.innerHTML += `

            <div class="card">

                <h2>
                    ${college.collegeName || "College"}
                </h2>

                <p>
                    📍 ${college.city}
                </p>

                <p>
                    🏛️ ${college.collegeType || ""}
                </p>

                <p>
                    🌐
                    <a
                        href="${college.website || '#'}"
                        target="_blank"
                        style="color:#60a5fa;">
                        Visit Website
                    </a>
                </p>

                ${programInfo}

                <button
                    onclick="removeFavorite(
                        '${favDoc.id}'
                    )">

                    Remove Favorite

                </button>

            </div>

            `;

        }

    } catch (err) {

        console.error(err);

        container.innerHTML = `

        <div class="card">
            <h2>Error</h2>
            <p>
                Failed to load favorites.
            </p>
        </div>

        `;
    }

}

/* -------------------------
   REMOVE FAVORITE
--------------------------*/

async function removeFavorite(id) {

    try {

        await favoritesCollection
            .doc(id)
            .delete();

        loadFavorites();

    } catch (err) {

        console.error(err);

        alert(
            "Failed to remove favorite"
        );

    }

}
