/* =========================================================
   PRINTWAVE ACCOUNT
   Frontend prototype authentication
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       FOOTER YEAR
    ===================================================== */

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* =====================================================
       PANELS
    ===================================================== */

  const loginPanel = document.getElementById("loginPanel");

  const registerPanel = document.getElementById("registerPanel");

  const forgotPanel = document.getElementById("forgotPanel");

  function showPanel(panel) {
    loginPanel.style.display = "none";
    registerPanel.style.display = "none";
    forgotPanel.style.display = "none";

    panel.style.display = "block";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
       PANEL SWITCHING
    ===================================================== */

  document.getElementById("showRegister")?.addEventListener("click", () => {
    showPanel(registerPanel);
  });

  document.getElementById("showLogin")?.addEventListener("click", () => {
    showPanel(loginPanel);
  });

  document
    .getElementById("forgotPasswordButton")
    ?.addEventListener("click", () => {
      showPanel(forgotPanel);
    });

  document.getElementById("backToLogin")?.addEventListener("click", () => {
    showPanel(loginPanel);
  });

  /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;

      const input = document.getElementById(targetId);

      if (!input) {
        return;
      }

      const icon = button.querySelector("i");

      if (input.type === "password") {
        input.type = "text";

        icon.className = "bi bi-eye-slash";
      } else {
        input.type = "password";

        icon.className = "bi bi-eye";
      }
    });
  });

  /* =====================================================
       HELPERS
    ===================================================== */

  function getUsers() {
    return JSON.parse(localStorage.getItem("printwaveUsers")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("printwaveUsers", JSON.stringify(users));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
  }

  function showMessage(element, message, type) {
    element.textContent = message;

    element.className = `account-message ${type}`;
  }

  /* =====================================================
       REGISTER
    ===================================================== */

  const registerForm = document.getElementById("registerForm");

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("registerFirstName");

    const lastName = document.getElementById("registerLastName");

    const email = document.getElementById("registerEmail");

    const phone = document.getElementById("registerPhone");

    const password = document.getElementById("registerPassword");

    const confirmPassword = document.getElementById("registerConfirmPassword");

    const terms = document.getElementById("registerTerms");

    /* Error elements */

    const firstNameError = document.getElementById("registerFirstNameError");

    const lastNameError = document.getElementById("registerLastNameError");

    const emailError = document.getElementById("registerEmailError");

    const phoneError = document.getElementById("registerPhoneError");

    const passwordError = document.getElementById("registerPasswordError");

    const confirmPasswordError = document.getElementById(
      "registerConfirmPasswordError",
    );

    const termsError = document.getElementById("registerTermsError");

    const message = document.getElementById("registerMessage");

    /* Clear */

    [
      firstNameError,
      lastNameError,
      emailError,
      phoneError,
      passwordError,
      confirmPasswordError,
      termsError,
    ].forEach((element) => {
      element.textContent = "";
    });

    let valid = true;

    /* First name */

    if (firstName.value.trim().length < 2) {
      firstNameError.textContent = "Please enter your first name.";

      valid = false;
    }

    /* Last name */

    if (lastName.value.trim().length < 2) {
      lastNameError.textContent = "Please enter your last name.";

      valid = false;
    }

    /* Email */

    if (!isValidEmail(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";

      valid = false;
    }

    /* Phone */

    if (!isValidPhone(phone.value.trim())) {
      phoneError.textContent = "Enter a valid 10-digit Indian mobile number.";

      valid = false;
    }

    /* Password */

    if (password.value.length < 6) {
      passwordError.textContent =
        "Password must contain at least 6 characters.";

      valid = false;
    }

    /* Confirm */

    if (password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match.";

      valid = false;
    }

    /* Terms */

    if (!terms.checked) {
      termsError.textContent = "Please accept the terms and conditions.";

      valid = false;
    }

    if (!valid) {
      showMessage(message, "Please correct the highlighted fields.", "error");

      return;
    }

    /* Existing users */

    const users = getUsers();

    const normalizedEmail = email.value.trim().toLowerCase();

    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      showMessage(
        message,
        "An account with this email already exists.",
        "error",
      );

      return;
    }

    /* Create user */

    const newUser = {
      id: `USR-${Date.now()}`,

      firstName: firstName.value.trim(),

      lastName: lastName.value.trim(),

      email: normalizedEmail,

      phone: phone.value.trim(),

      /*
                 IMPORTANT:
                 This is only a frontend demo.

                 Never store real passwords like this
                 in a production application.
                */

      password: password.value,

      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    saveUsers(users);

    /* Login user */

    localStorage.setItem(
      "printwaveCurrentUser",
      JSON.stringify({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
      }),
    );

    showMessage(
      message,
      "Account created successfully! Redirecting...",
      "success",
    );

    setTimeout(() => {
      window.location.href = "account-dashboard.html";
    }, 1000);
  });

  /* =====================================================
       LOGIN
    ===================================================== */

  const loginForm = document.getElementById("loginForm");

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail");

    const password = document.getElementById("loginPassword");

    const emailError = document.getElementById("loginEmailError");

    const passwordError = document.getElementById("loginPasswordError");

    const message = document.getElementById("loginMessage");

    emailError.textContent = "";
    passwordError.textContent = "";

    let valid = true;

    if (!isValidEmail(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";

      valid = false;
    }

    if (!password.value) {
      passwordError.textContent = "Please enter your password.";

      valid = false;
    }

    if (!valid) {
      showMessage(message, "Please enter your login details.", "error");

      return;
    }

    const users = getUsers();

    const normalizedEmail = email.value.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email === normalizedEmail && item.password === password.value,
    );

    if (!user) {
      showMessage(message, "Incorrect email or password.", "error");

      return;
    }

    localStorage.setItem(
      "printwaveCurrentUser",
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }),
    );

    showMessage(message, "Login successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "account-dashboard.html";
    }, 700);
  });

  /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

  const forgotForm = document.getElementById("forgotForm");

  forgotForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("forgotEmail");

    const error = document.getElementById("forgotEmailError");

    const message = document.getElementById("forgotMessage");

    error.textContent = "";

    const normalizedEmail = email.value.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      error.textContent = "Please enter a valid email.";

      return;
    }

    const users = getUsers();

    const user = users.find((item) => item.email === normalizedEmail);

    /*
             Don't reveal whether an email
             actually exists.

             This is the safer production-style
             behaviour.
            */

    if (user) {
      showMessage(
        message,
        "If an account exists for this email, password recovery instructions would be sent.",
        "success",
      );
    } else {
      showMessage(
        message,
        "If an account exists for this email, password recovery instructions would be sent.",
        "success",
      );
    }
  });
});
