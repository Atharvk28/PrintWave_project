/* =====================================================
   PRINTWAVE ADMIN COUPONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =================================================
       ADMIN AUTH
    ================================================= */

  const adminData = JSON.parse(
    localStorage.getItem("printwaveAdmin") || "null",
  );

  if (!adminData || !adminData.loggedIn) {
    window.location.href = "admin-login.html";
    return;
  }

  /* =================================================
       ELEMENTS
    ================================================= */

  const tableBody = document.getElementById("couponTableBody");

  const emptyState = document.getElementById("couponEmpty");

  const modal = document.getElementById("couponModal");

  const deleteModal = document.getElementById("deleteModal");

  const form = document.getElementById("couponForm");

  const modalTitle = document.getElementById("modalTitle");

  const couponId = document.getElementById("couponId");

  const couponCode = document.getElementById("couponCode");

  const discountType = document.getElementById("discountType");

  const discountValue = document.getElementById("discountValue");

  const discountPrefix = document.getElementById("discountPrefix");

  const minOrder = document.getElementById("minOrder");

  const maxDiscount = document.getElementById("maxDiscount");

  const usageLimit = document.getElementById("usageLimit");

  const expiryDate = document.getElementById("expiryDate");

  const couponDescription = document.getElementById("couponDescription");

  const couponActive = document.getElementById("couponActive");

  const searchInput = document.getElementById("couponSearch");

  const statusFilter = document.getElementById("statusFilter");

  const discountFilter = document.getElementById("discountFilter");

  const toast = document.getElementById("couponToast");

  const toastMessage = document.getElementById("toastMessage");

  /* =================================================
       DEFAULT COUPONS
    ================================================= */

  let coupons = JSON.parse(localStorage.getItem("printwaveCoupons") || "null");

  if (!Array.isArray(coupons)) {
    coupons = [
      {
        id: "coupon_1",
        code: "PRINT10",
        discountType: "percentage",
        discountValue: 10,
        minOrder: 499,
        maxDiscount: 200,
        usageLimit: 100,
        usedCount: 0,
        expiryDate: "",
        description: "10% off on orders above ₹499",
        active: true,
        createdAt: new Date().toISOString(),
      },

      {
        id: "coupon_2",
        code: "WELCOME50",
        discountType: "fixed",
        discountValue: 50,
        minOrder: 499,
        maxDiscount: 0,
        usageLimit: 0,
        usedCount: 0,
        expiryDate: "",
        description: "₹50 welcome discount",
        active: true,
        createdAt: new Date().toISOString(),
      },

      {
        id: "coupon_3",
        code: "WAVE20",
        discountType: "percentage",
        discountValue: 20,
        minOrder: 999,
        maxDiscount: 300,
        usageLimit: 50,
        usedCount: 0,
        expiryDate: "",
        description: "20% off on orders above ₹999",
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];

    saveCoupons();
  }

  /* =================================================
       SAVE
    ================================================= */

  function saveCoupons() {
    localStorage.setItem("printwaveCoupons", JSON.stringify(coupons));
  }

  /* =================================================
       ADMIN NAME
    ================================================= */

  const adminName = document.getElementById("adminName");

  if (adminName) {
    adminName.textContent = adminData.name || "Administrator";
  }

  /* =================================================
       FOOTER YEAR
    ================================================= */

  const footerYear = document.getElementById("adminFooterYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* =================================================
       HELPERS
    ================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isExpired(coupon) {
    if (!coupon.expiryDate) {
      return false;
    }

    const expiry = new Date(coupon.expiryDate + "T23:59:59");

    return expiry < new Date();
  }

  function getStatus(coupon) {
    if (isExpired(coupon)) {
      return "expired";
    }

    return coupon.active ? "active" : "inactive";
  }

  function formatDate(date) {
    if (!date) {
      return "No expiry";
    }

    const d = new Date(date + "T00:00:00");

    if (isNaN(d.getTime())) {
      return "No expiry";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDiscount(coupon) {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    }

    return `₹${Number(coupon.discountValue || 0).toLocaleString("en-IN")} OFF`;
  }

  /* =================================================
       RENDER
    ================================================= */

  function renderCoupons() {
    const search = searchInput.value.trim().toLowerCase();

    const status = statusFilter.value;

    const discount = discountFilter.value;

    let filtered = coupons.filter((coupon) => {
      const matchesSearch =
        !search ||
        coupon.code.toLowerCase().includes(search) ||
        String(coupon.description || "")
          .toLowerCase()
          .includes(search);

      const couponStatus = getStatus(coupon);

      const matchesStatus = status === "all" || couponStatus === status;

      const matchesDiscount =
        discount === "all" || coupon.discountType === discount;

      return matchesSearch && matchesStatus && matchesDiscount;
    });

    tableBody.innerHTML = "";

    if (!filtered.length) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";

      filtered.forEach((coupon) => {
        tableBody.appendChild(createCouponRow(coupon));
      });
    }

    updateStats();
  }

  /* =================================================
       CREATE ROW
    ================================================= */

  function createCouponRow(coupon) {
    const tr = document.createElement("tr");

    const status = getStatus(coupon);

    let statusHTML = "";

    if (status === "active") {
      statusHTML = `
                <span class="coupon-status active">
                    <i class="bi bi-check-circle"></i>
                    Active
                </span>
            `;
    } else if (status === "expired") {
      statusHTML = `
                <span class="coupon-status expired">
                    <i class="bi bi-clock"></i>
                    Expired
                </span>
            `;
    } else {
      statusHTML = `
                <span class="coupon-status inactive">
                    <i class="bi bi-dash-circle"></i>
                    Inactive
                </span>
            `;
    }

    const usageLimitText =
      coupon.usageLimit > 0
        ? `${coupon.usedCount || 0} / ${coupon.usageLimit}`
        : `${coupon.usedCount || 0} / ∞`;

    const expiryClass = isExpired(coupon)
      ? "expiry-text expired"
      : coupon.expiryDate
        ? "expiry-text"
        : "expiry-text never";

    tr.innerHTML = `

            <td>

                <div class="coupon-code">
                    ${escapeHTML(coupon.code)}
                </div>

                <div class="coupon-description">
                    ${escapeHTML(coupon.description || "No description")}
                </div>

            </td>


            <td>

                <div class="discount-value">
                    ${formatDiscount(coupon)}
                </div>

                ${
                  coupon.maxDiscount > 0 && coupon.discountType === "percentage"
                    ? `
                            <small>
                                Max ₹${Number(
                                  coupon.maxDiscount,
                                ).toLocaleString("en-IN")}
                            </small>
                          `
                    : ""
                }

            </td>


            <td>
                ₹${Number(coupon.minOrder || 0).toLocaleString("en-IN")}
            </td>


            <td>
                <span class="usage-text">
                    ${usageLimitText}
                </span>
            </td>


            <td>
                <span class="${expiryClass}">
                    ${
                      coupon.expiryDate
                        ? formatDate(coupon.expiryDate)
                        : "No expiry"
                    }
                </span>
            </td>


            <td>
                ${statusHTML}
            </td>


            <td>

                <div class="coupon-actions">

                    <button
                        class="coupon-action-btn"
                        title="Edit"
                        data-action="edit"
                        data-id="${coupon.id}"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>


                    <button
                        class="coupon-action-btn"
                        title="${coupon.active ? "Deactivate" : "Activate"}"
                        data-action="toggle"
                        data-id="${coupon.id}"
                    >
                        <i class="bi ${
                          coupon.active ? "bi-toggle-on" : "bi-toggle-off"
                        }"></i>
                    </button>


                    <button
                        class="coupon-action-btn delete"
                        title="Delete"
                        data-action="delete"
                        data-id="${coupon.id}"
                    >
                        <i class="bi bi-trash3"></i>
                    </button>

                </div>

            </td>

        `;

    return tr;
  }

  /* =================================================
       STATS
    ================================================= */

  function updateStats() {
    const total = coupons.length;

    const active = coupons.filter(
      (coupon) => getStatus(coupon) === "active",
    ).length;

    const expired = coupons.filter(
      (coupon) => getStatus(coupon) === "expired",
    ).length;

    const totalUses = coupons.reduce(
      (sum, coupon) => sum + Number(coupon.usedCount || 0),
      0,
    );

    document.getElementById("totalCoupons").textContent = total;

    document.getElementById("activeCoupons").textContent = active;

    document.getElementById("expiredCoupons").textContent = expired;

    document.getElementById("totalUses").textContent = totalUses;
  }

  /* =================================================
       OPEN CREATE MODAL
    ================================================= */

  function openCreateModal() {
    form.reset();

    couponId.value = "";

    modalTitle.textContent = "Create Coupon";

    discountType.value = "percentage";

    discountPrefix.textContent = "%";

    couponActive.checked = true;

    usageLimit.value = 0;

    minOrder.value = 0;

    maxDiscount.value = "";

    modal.classList.add("show");

    setTimeout(() => {
      couponCode.focus();
    }, 100);
  }

  /* =================================================
       OPEN EDIT MODAL
    ================================================= */

  function openEditModal(id) {
    const coupon = coupons.find((item) => item.id === id);

    if (!coupon) {
      return;
    }

    couponId.value = coupon.id;

    couponCode.value = coupon.code;

    discountType.value = coupon.discountType;

    discountValue.value = coupon.discountValue;

    minOrder.value = coupon.minOrder || 0;

    maxDiscount.value = coupon.maxDiscount || "";

    usageLimit.value = coupon.usageLimit || 0;

    expiryDate.value = coupon.expiryDate || "";

    couponDescription.value = coupon.description || "";

    couponActive.checked = coupon.active !== false;

    updateDiscountPrefix();

    modalTitle.textContent = "Edit Coupon";

    modal.classList.add("show");
  }

  /* =================================================
       DISCOUNT PREFIX
    ================================================= */

  function updateDiscountPrefix() {
    if (discountType.value === "percentage") {
      discountPrefix.textContent = "%";

      discountValue.max = "100";
    } else {
      discountPrefix.textContent = "₹";

      discountValue.removeAttribute("max");
    }
  }

  /* =================================================
       SAVE COUPON
    ================================================= */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const code = couponCode.value.trim().toUpperCase();

    const type = discountType.value;

    const value = Number(discountValue.value);

    const minimumOrder = Number(minOrder.value || 0);

    const maximumDiscount = Number(maxDiscount.value || 0);

    const limit = Number(usageLimit.value || 0);

    if (!code) {
      showToast("Please enter a coupon code.");

      return;
    }

    if (!value || value <= 0) {
      showToast("Please enter a valid discount.");

      return;
    }

    if (type === "percentage" && value > 100) {
      showToast("Percentage discount cannot exceed 100%.");

      return;
    }

    const duplicate = coupons.find(
      (coupon) => coupon.code === code && coupon.id !== couponId.value,
    );

    if (duplicate) {
      showToast("This coupon code already exists.");

      return;
    }

    const data = {
      code,

      discountType: type,

      discountValue: value,

      minOrder: minimumOrder,

      maxDiscount: maximumDiscount,

      usageLimit: limit,

      expiryDate: expiryDate.value,

      description: couponDescription.value.trim(),

      active: couponActive.checked,
    };

    if (couponId.value) {
      const index = coupons.findIndex((coupon) => coupon.id === couponId.value);

      if (index !== -1) {
        coupons[index] = {
          ...coupons[index],

          ...data,

          updatedAt: new Date().toISOString(),
        };
      }

      showToast("Coupon updated successfully.");
    } else {
      coupons.unshift({
        id: "coupon_" + Date.now(),

        ...data,

        usedCount: 0,

        createdAt: new Date().toISOString(),
      });

      showToast("Coupon created successfully.");
    }

    saveCoupons();

    closeModal();

    renderCoupons();
  });

  /* =================================================
       DELETE
    ================================================= */

  let deleteCouponId = null;

  function openDeleteModal(id) {
    deleteCouponId = id;

    deleteModal.classList.add("show");
  }

  function closeDeleteModal() {
    deleteCouponId = null;

    deleteModal.classList.remove("show");
  }

  document.getElementById("confirmDelete").addEventListener("click", () => {
    if (!deleteCouponId) {
      return;
    }

    coupons = coupons.filter((coupon) => coupon.id !== deleteCouponId);

    saveCoupons();

    closeDeleteModal();

    renderCoupons();

    showToast("Coupon deleted successfully.");
  });

  /* =================================================
       TOGGLE ACTIVE
    ================================================= */

  function toggleCoupon(id) {
    const coupon = coupons.find((item) => item.id === id);

    if (!coupon) {
      return;
    }

    if (isExpired(coupon)) {
      showToast("Expired coupons cannot be activated.");

      return;
    }

    coupon.active = !coupon.active;

    coupon.updatedAt = new Date().toISOString();

    saveCoupons();

    renderCoupons();

    showToast(coupon.active ? "Coupon activated." : "Coupon deactivated.");
  }

  /* =================================================
       TABLE ACTIONS
    ================================================= */

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const id = button.dataset.id;

    if (action === "edit") {
      openEditModal(id);
    }

    if (action === "toggle") {
      toggleCoupon(id);
    }

    if (action === "delete") {
      openDeleteModal(id);
    }
  });

  /* =================================================
       CLOSE MODAL
    ================================================= */

  function closeModal() {
    modal.classList.remove("show");
  }

  document
    .getElementById("closeCouponModal")
    .addEventListener("click", closeModal);

  document.getElementById("cancelCoupon").addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  /* =================================================
       DELETE MODAL CLOSE
    ================================================= */

  document
    .getElementById("cancelDelete")
    .addEventListener("click", closeDeleteModal);

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });

  /* =================================================
       CREATE BUTTONS
    ================================================= */

  document
    .getElementById("addCouponBtn")
    .addEventListener("click", openCreateModal);

  document
    .getElementById("emptyAddCouponBtn")
    .addEventListener("click", openCreateModal);

  /* =================================================
       FILTERS
    ================================================= */

  searchInput.addEventListener("input", renderCoupons);

  statusFilter.addEventListener("change", renderCoupons);

  discountFilter.addEventListener("change", renderCoupons);

  discountType.addEventListener("change", updateDiscountPrefix);

  /* =================================================
       TOAST
    ================================================= */

  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* =================================================
       SIDEBAR
    ================================================= */

  const sidebar = document.getElementById("adminSidebar");

  const overlay = document.getElementById("sidebarOverlay");

  document.getElementById("openSidebar")?.addEventListener("click", () => {
    sidebar.classList.add("show");

    overlay.classList.add("show");
  });

  document
    .getElementById("closeSidebar")
    ?.addEventListener("click", closeSidebar);

  overlay?.addEventListener("click", closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove("show");

    overlay.classList.remove("show");
  }

  /* =================================================
       LOGOUT
    ================================================= */

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("printwaveAdmin");

    window.location.href = "admin-login.html";
  });

  /* =================================================
       ESC KEY
    ================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();

      closeDeleteModal();
    }
  });

  /* =================================================
       INITIAL RENDER
    ================================================= */

  updateDiscountPrefix();

  renderCoupons();
});
