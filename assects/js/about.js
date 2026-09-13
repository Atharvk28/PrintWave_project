/* =========================================================
   PRINTWAVE ABOUT PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ================= FOOTER YEAR ================= */

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ================= SCROLL REVEAL ================= */

  const revealElements = document.querySelectorAll(
    ".service-card, .why-card, .process-step, .collection-preview-card, .story-image-wrapper",
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("about-reveal-visible");

          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => {
      element.classList.add("about-reveal");

      observer.observe(element);
    });
  }

  /* ================= ACTIVE NAV ================= */

  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "about.html") {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    const aboutLink = document.querySelector(
      '.navbar-nav a[href="about.html"]',
    );

    if (aboutLink) {
      aboutLink.classList.add("active");
    }
  }
});
