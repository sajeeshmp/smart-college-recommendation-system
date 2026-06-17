console.log("🔐 Login System Loaded");

/* -------------------------
   REGISTER
--------------------------*/

async function registerUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const status =
        document.getElementById("status");

    if (!email || !password) {

        status.innerHTML =
            "Please enter email and password.";

        return;
    }

    try {

        const userCredential =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );

        status.innerHTML =
            "✅ Account created successfully";

        console.log(
            "Registered:",
            userCredential.user.email
        );

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ " + error.message;
    }

}

/* -------------------------
   LOGIN
--------------------------*/

async function loginUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const status =
        document.getElementById("status");

    if (!email || !password) {

        status.innerHTML =
            "Please enter email and password.";

        return;
    }

    try {

        const userCredential =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );

        status.innerHTML =
            "✅ Login Successful";

        console.log(
            "Logged In:",
            userCredential.user.email
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ " + error.message;
    }

}

/* -------------------------
   LOGOUT
--------------------------*/

async function logoutUser() {

    const status =
        document.getElementById("status");

    try {

        await auth.signOut();

        status.innerHTML =
            "✅ Logged Out";

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ " + error.message;
    }

}

/* -------------------------
   SESSION CHECK
--------------------------*/

auth.onAuthStateChanged(user => {

    const status =
        document.getElementById("status");

    if (!status) return;

    if (user) {

        status.innerHTML =
            `👤 Logged in as: ${user.email}`;

    } else {

        status.innerHTML =
            "Not Logged In";
    }

});
