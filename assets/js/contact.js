/* =========================================================
   PRINTWAVE CONTACT PAGE
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
       ELEMENTS
    ===================================================== */

  const form = document.getElementById("contactForm");

  const successMessage = document.getElementById("contactSuccess");

  const sendAnotherButton = document.getElementById("sendAnotherMessage");

  const submitButton = document.getElementById("contactSubmitButton");

  const submitText = submitButton?.querySelector(".submit-text");

  const submitLoading = submitButton?.querySelector(".submit-loading");

  const subject = document.getElementById("subject");

  const orderIdWrapper = document.getElementById("orderIdWrapper");

  /* =====================================================
       ORDER ID VISIBILITY
    ===================================================== */

  function updateOrderIdVisibility() {
    if (!subject || !orderIdWrapper) {
      return;
    }

    if (subject.value === "order") {
      orderIdWrapper.style.display = "block";
    } else {
      orderIdWrapper.style.display = "block";
    }
  }

  if (subject) {
    subject.addEventListener("change", updateOrderIdVisibility);

    updateOrderIdVisibility();
  }

  /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* =====================================================
       PHONE VALIDATION
    ===================================================== */

  function isValidPhone(phone) {
    if (!phone) {
      return true;
    }

    return /^[6-9]\d{9}$/.test(phone);
  }

  /* =====================================================
       FORM VALIDATION
    ===================================================== */

  function validateForm() {
    let isValid = true;

    const firstName = document.getElementById("firstName");

    const lastName = document.getElementById("lastName");

    const email = document.getElementById("email");

    const phone = document.getElementById("phone");

    const message = document.getElementById("message");

    const consent = document.getElementById("contactConsent");

    /* First Name */

    if (!firstName.value.trim()) {
      firstName.classList.add("is-invalid");

      isValid = false;
    } else {
      firstName.classList.remove("is-invalid");
    }

    /* Last Name */

    if (!lastName.value.trim()) {
      lastName.classList.add("is-invalid");

      isValid = false;
    } else {
      lastName.classList.remove("is-invalid");
    }

    /* Email */

    if (!isValidEmail(email.value.trim())) {
      email.classList.add("is-invalid");

      isValid = false;
    } else {
      email.classList.remove("is-invalid");
    }

    /* Phone */

    if (!isValidPhone(phone.value.trim())) {
      phone.classList.add("is-invalid");

      isValid = false;
    } else {
      phone.classList.remove("is-invalid");
    }

    /* Subject */

    if (!subject.value) {
      subject.classList.add("is-invalid");

      isValid = false;
    } else {
      subject.classList.remove("is-invalid");
    }

    /* Message */

    if (message.value.trim().length < 10) {
      message.classList.add("is-invalid");

      isValid = false;
    } else {
      message.classList.remove("is-invalid");
    }

    /* Consent */

    if (!consent.checked) {
      consent.classList.add("is-invalid");

      isValid = false;
    } else {
      consent.classList.remove("is-invalid");
    }

    return isValid;
  }

  /* =====================================================
       REMOVE VALIDATION ERROR WHILE TYPING
    ===================================================== */

  const fields = form?.querySelectorAll("input, textarea, select");

  fields?.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        field.classList.remove("is-invalid");
      }
    });

    field.addEventListener("change", () => {
      if (field.classList.contains("is-invalid")) {
        field.classList.remove("is-invalid");
      }
    });
  });

  /* =====================================================
       SUBMIT FORM
    ===================================================== */

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      const firstInvalid = form.querySelector(".is-invalid");

      firstInvalid?.focus();

      return;
    }

    /* Loading state */

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (submitText) {
      submitText.style.display = "none";
    }

    if (submitLoading) {
      submitLoading.style.display = "inline-flex";
    }

    /*
             Frontend demo delay.

             Later this will become an API request
             to the PrintWave backend.
            */

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    /* Save enquiry locally for prototype */

    const enquiry = {
      id: `MSG-${Date.now()}`,

      firstName: document.getElementById("firstName").value.trim(),

      lastName: document.getElementById("lastName").value.trim(),

      email: document.getElementById("email").value.trim(),

      phone: document.getElementById("phone").value.trim(),

      subject: subject.value,

      orderId: document.getElementById("orderId").value.trim(),

      message: document.getElementById("message").value.trim(),

      createdAt: new Date().toISOString(),
    };

    const existingMessages =
      JSON.parse(localStorage.getItem("printwaveContactMessages")) || [];

    existingMessages.push(enquiry);

    localStorage.setItem(
      "printwaveContactMessages",
      JSON.stringify(existingMessages),
    );

    /* Hide form */

    form.style.display = "none";

    /* Show success */

    successMessage.style.display = "block";

    /* Restore button */

    if (submitButton) {
      submitButton.disabled = false;
    }

    if (submitText) {
      submitText.style.display = "inline";
    }

    if (submitLoading) {
      submitLoading.style.display = "none";
    }

    /* Scroll to success */

    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  /* =====================================================
       SEND ANOTHER MESSAGE
    ===================================================== */

  sendAnotherButton?.addEventListener("click", () => {
    form.reset();

    form.style.display = "block";

    successMessage.style.display = "none";

    form.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
    });

    form.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});
