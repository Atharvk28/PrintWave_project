/* =========================================================
   PRINTWAVE - ADMIN LOGIN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const ADMIN_EMAIL =
        "admin@printwave.in";

    const ADMIN_PASSWORD =
        "Admin@123";


    const ADMIN_STORAGE_KEY =
        "printwaveAdmin";


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById(
            "adminLoginForm"
        );

    const emailInput =
        document.getElementById(
            "adminEmail"
        );

    const passwordInput =
        document.getElementById(
            "adminPassword"
        );

    const passwordToggle =
        document.getElementById(
            "passwordToggle"
        );

    const loginButton =
        document.getElementById(
            "adminLoginBtn"
        );

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    const forgotPasswordBtn =
        document.getElementById(
            "forgotPasswordBtn"
        );

    const rememberAdmin =
        document.getElementById(
            "rememberAdmin"
        );

    const footerYear =
        document.getElementById(
            "loginFooterYear"
        );


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       CHECK EXISTING ADMIN SESSION
    ===================================================== */

    function getAdminSession() {

        try {

            const session =
                localStorage.getItem(
                    ADMIN_STORAGE_KEY
                );

            if (!session) {
                return null;
            }

            return JSON.parse(session);

        } catch (error) {

            console.error(
                "Could not read admin session.",
                error
            );

            return null;

        }

    }


    /*
     * If an admin is already logged in,
     * redirect to dashboard.
     */

    const existingAdmin =
        getAdminSession();


    if (
        existingAdmin &&
        existingAdmin.loggedIn === true
    ) {

        window.location.href =
            "admin-dashboard.html";

        return;

    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(
        message,
        type = "error"
    ) {

        if (!loginMessage) {
            return;
        }


        loginMessage.textContent =
            message;

        loginMessage.className =
            `login-message show ${type}`;

    }


    function hideMessage() {

        if (!loginMessage) {
            return;
        }


        loginMessage.textContent = "";

        loginMessage.className =
            "login-message";

    }


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    if (passwordToggle) {

        passwordToggle.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type ===
                    "password";


                if (isPassword) {

                    passwordInput.type =
                        "text";

                    passwordToggle.innerHTML =
                        '<i class="bi bi-eye-slash"></i>';

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type =
                        "password";

                    passwordToggle.innerHTML =
                        '<i class="bi bi-eye"></i>';

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                hideMessage();


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();

                const password =
                    passwordInput.value;


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!email) {

                    showMessage(
                        "Please enter your admin email."
                    );

                    emailInput.focus();

                    return;

                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showMessage(
                        "Please enter a valid email address."
                    );

                    emailInput.focus();

                    return;

                }


                if (!password) {

                    showMessage(
                        "Please enter your password."
                    );

                    passwordInput.focus();

                    return;

                }


                /* -----------------------------------------
                   LOADING STATE
                ----------------------------------------- */

                loginButton.disabled = true;

                loginButton.classList.add(
                    "loading"
                );


                /*
                 * Small delay makes the login feel
                 * like a real authentication request.
                 */

                setTimeout(() => {

                    /* -------------------------------------
                       CHECK CREDENTIALS
                    ------------------------------------- */

                    if (
                        email !== ADMIN_EMAIL ||
                        password !== ADMIN_PASSWORD
                    ) {

                        loginButton.disabled =
                            false;

                        loginButton.classList.remove(
                            "loading"
                        );

                        showMessage(
                            "Invalid admin email or password."
                        );

                        passwordInput.value = "";

                        passwordInput.focus();

                        return;

                    }


                    /* -------------------------------------
                       CREATE ADMIN SESSION
                    ------------------------------------- */

                    const adminSession = {

                        name:
                            "PrintWave Administrator",

                        email:
                            ADMIN_EMAIL,

                        role:
                            "admin",

                        loggedIn:
                            true,

                        loginTime:
                            new Date().toISOString()

                    };


                    /*
                     * Current prototype uses localStorage.
                     *
                     * In production this must be replaced
                     * by server-side authentication,
                     * password hashing and secure sessions.
                     */

                    localStorage.setItem(
                        ADMIN_STORAGE_KEY,
                        JSON.stringify(
                            adminSession
                        )
                    );


                    /* -------------------------------------
                       REMEMBER ME
                    ------------------------------------- */

                    if (
                        rememberAdmin &&
                        rememberAdmin.checked
                    ) {

                        localStorage.setItem(
                            "printwaveRememberAdmin",
                            "true"
                        );

                    } else {

                        localStorage.removeItem(
                            "printwaveRememberAdmin"
                        );

                    }


                    /* -------------------------------------
                       SUCCESS
                    ------------------------------------- */

                    showMessage(
                        "Login successful. Redirecting...",
                        "success"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "admin-dashboard.html";

                    }, 700);


                }, 500);

            }
        );

    }


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    if (forgotPasswordBtn) {

        forgotPasswordBtn.addEventListener(
            "click",
            () => {

                const email =
                    prompt(
                        "Enter your admin email address:"
                    );


                if (!email) {
                    return;
                }


                if (
                    email.trim().toLowerCase() !==
                    ADMIN_EMAIL
                ) {

                    showMessage(
                        "No admin account was found with that email."
                    );

                    return;

                }


                alert(
                    "Password reset is not connected yet. In the production version, a secure reset link will be sent to the admin email."
                );

            }
        );

    }


    /* =====================================================
       REMEMBERED EMAIL
    ===================================================== */

    const remembered =
        localStorage.getItem(
            "printwaveRememberAdmin"
        );


    if (
        remembered === "true" &&
        emailInput
    ) {

        emailInput.value =
            ADMIN_EMAIL;

        if (rememberAdmin) {
            rememberAdmin.checked = true;
        }

    }


    console.log(
        "PrintWave Admin Login loaded successfully."
    );

});