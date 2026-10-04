/* =========================================
   PRINTWAVE ADMIN CUSTOM DESIGNS
========================================= */

/* =========================================
   STORAGE
========================================= */

const DESIGNS_KEY = "printwaveDesigns";

const ORDERS_KEY = "printwaveOrders";

/* =========================================
   ELEMENTS
========================================= */

const designsTableBody = document.getElementById("designsTableBody");

const emptyDesigns = document.getElementById("emptyDesigns");

const designSearch = document.getElementById("designSearch");

const designStatusFilter = document.getElementById("designStatusFilter");

const designTypeFilter = document.getElementById("designTypeFilter");

const clearDesignFilters = document.getElementById("clearDesignFilters");

const designModal = document.getElementById("designModal");

const closeDesignModal = document.getElementById("closeDesignModal");

const designStatus = document.getElementById("designStatus");

const saveDesignStatus = document.getElementById("saveDesignStatus");

let selectedDesignId = null;

/* =========================================
   GET DESIGNS
========================================= */

function getDesigns() {
  const stored = localStorage.getItem(DESIGNS_KEY);

  if (!stored) {
    return [];
  }

  try {
    const designs = JSON.parse(stored);

    return Array.isArray(designs) ? designs : [];
  } catch (error) {
    console.error("Unable to load designs:", error);

    return [];
  }
}

/* =========================================
   SAVE DESIGNS
========================================= */

function saveDesigns(designs) {
  localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
}

/* =========================================
   GET ORDERS
========================================= */

function getOrders() {
  const stored = localStorage.getItem(ORDERS_KEY);

  if (!stored) {
    return [];
  }

  try {
    const orders = JSON.parse(stored);

    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

/* =========================================
   NORMALIZE STATUS
========================================= */

function normalizeStatus(status) {
  if (!status) {
    return "pending";
  }

  return String(status).toLowerCase().replace(/\s+/g, "-");
}

/* =========================================
   STATUS LABEL
========================================= */

function statusLabel(status) {
  const labels = {
    pending: "Pending",

    approved: "Approved",

    rejected: "Rejected",
  };

  return labels[normalizeStatus(status)] || "Pending";
}

/* =========================================
   PRODUCT TYPE LABEL
========================================= */

function productTypeLabel(type) {
  const labels = {
    tshirt: "T-Shirt",

    "t-shirt": "T-Shirt",

    tshirts: "T-Shirt",

    scarf: "Scarf",

    mug: "Mug",

    printed: "Printed",

    embroidered: "Embroidered",

    custom: "Custom",
  };

  const key = String(type || "").toLowerCase();

  return labels[key] || type || "Custom";
}

/* =========================================
   GET DESIGN NAME
========================================= */

function getDesignName(design) {
  return design.name || design.designName || design.title || "Custom Design";
}

/* =========================================
   GET CUSTOMER NAME
========================================= */

function getCustomerName(design) {
  return (
    design.customerName ||
    design.nameOfCustomer ||
    design.customer ||
    "Guest Customer"
  );
}

/* =========================================
   GET CUSTOMER EMAIL
========================================= */

function getCustomerEmail(design) {
  return design.email || design.customerEmail || "";
}

/* =========================================
   GET DESIGN TYPE
========================================= */

function getDesignType(design) {
  if (design.designType) {
    return design.designType;
  }

  if (design.designElements && Array.isArray(design.designElements)) {
    const hasImage = design.designElements.some(
      (item) => item.type === "image",
    );

    const hasText = design.designElements.some((item) => item.type === "text");

    if (hasImage && hasText) {
      return "Image + Text";
    }

    if (hasImage) {
      return "Image Design";
    }

    if (hasText) {
      return "Text Design";
    }
  }

  return "Custom";
}

/* =========================================
   GET PRODUCT
========================================= */

function getProductName(design) {
  return (
    design.productName ||
    design.product ||
    design.productType ||
    "Custom Product"
  );
}

/* =========================================
   GET IMAGE
========================================= */

function getDesignImage(design) {
  return (
    design.preview ||
    design.previewImage ||
    design.designImage ||
    design.image ||
    design.uploadedImage ||
    ""
  );
}

/* =========================================
   GET DESIGN ID
========================================= */

function getDesignId(design, index) {
  return design.id || design.designId || `DESIGN-${index + 1}`;
}

/* =========================================
   GET QUANTITY
========================================= */

function getQuantity(design) {
  return design.quantity || design.qty || 1;
}

/* =========================================
   GET COLOR
========================================= */

function getColor(design) {
  return design.color || design.productColor || "Default";
}

/* =========================================
   GET ORDER ID
========================================= */

function getOrderId(design) {
  return design.orderId || design.order || "Not linked";
}

/* =========================================
   DESIGN CREATED DATE
========================================= */

function getDesignDate(design) {
  return (
    design.createdAt ||
    design.submittedAt ||
    design.date ||
    design.created ||
    null
  );
}

/* =========================================
   DESIGN ELEMENTS
========================================= */

function getDesignElements(design) {
  if (Array.isArray(design.designElements)) {
    return design.designElements;
  }

  if (Array.isArray(design.elements)) {
    return design.elements;
  }

  return [];
}

/* =========================================
   UPDATE STATS
========================================= */

function updateStats(designs) {
  const total = designs.length;

  const pending = designs.filter(
    (design) => normalizeStatus(design.status) === "pending",
  ).length;

  const approved = designs.filter(
    (design) => normalizeStatus(design.status) === "approved",
  ).length;

  const rejected = designs.filter(
    (design) => normalizeStatus(design.status) === "rejected",
  ).length;

  const orders = getOrders();

  const customOrders = orders.filter((order) => {
    const items = order.items || order.products || [];

    return items.some(
      (item) =>
        item.custom === true ||
        item.customizable === true ||
        item.designElements,
    );
  }).length;

  document.getElementById("totalDesigns").textContent = total;

  document.getElementById("pendingDesigns").textContent = pending;

  document.getElementById("approvedDesigns").textContent = approved;

  document.getElementById("rejectedDesigns").textContent = rejected;

  document.getElementById("customOrders").textContent = customOrders;
}

/* =========================================
   CREATE THUMBNAIL
========================================= */

function createThumbnail(design) {
  const image = getDesignImage(design);

  if (!image) {
    return `

            <div class="design-thumbnail">

                <i class="bi bi-palette"></i>

            </div>

        `;
  }

  let imagePath = image;

  if (
    !image.startsWith("data:") &&
    !image.startsWith("http") &&
    !image.startsWith("../")
  ) {
    imagePath = `../${image}`;
  }

  return `

        <div class="design-thumbnail">

            <img
                src="${escapeHTML(imagePath)}"
                alt="Custom Design"
                onerror="
                    this.parentElement.innerHTML =
                    '<i class=&quot;bi bi-palette&quot;></i>';
                "
            >

        </div>

    `;
}

/* =========================================
   RENDER DESIGNS
========================================= */

function renderDesigns() {
  const allDesigns = getDesigns();

  const search = designSearch.value.trim().toLowerCase();

  const status = designStatusFilter.value;

  const type = designTypeFilter.value;

  const filtered = allDesigns.filter((design) => {
    const name = getDesignName(design).toLowerCase();

    const customer = getCustomerName(design).toLowerCase();

    const email = getCustomerEmail(design).toLowerCase();

    const orderId = String(getOrderId(design)).toLowerCase();

    const productType = String(
      design.productType || design.type || "",
    ).toLowerCase();

    const matchesSearch =
      !search ||
      name.includes(search) ||
      customer.includes(search) ||
      email.includes(search) ||
      orderId.includes(search);

    const matchesStatus =
      status === "all" || normalizeStatus(design.status) === status;

    let matchesType = true;

    if (type !== "all") {
      matchesType = productType.includes(type);
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  designsTableBody.innerHTML = "";

  if (!filtered.length) {
    emptyDesigns.classList.add("show");
  } else {
    emptyDesigns.classList.remove("show");
  }

  filtered.forEach((design, index) => {
    const designId = getDesignId(design, index);

    const currentStatus = normalizeStatus(design.status);

    const row = document.createElement("tr");

    row.innerHTML = `

                <td>

                    <div class="design-info">

                        ${createThumbnail(design)}


                        <div>

                            <div class="design-name">

                                ${escapeHTML(getDesignName(design))}

                            </div>


                            <div class="design-id">

                                #${escapeHTML(designId)}

                            </div>

                        </div>

                    </div>

                </td>


                <td>

                    <div class="design-customer-name">

                        ${escapeHTML(getCustomerName(design))}

                    </div>


                    <div class="design-customer-email">

                        ${escapeHTML(getCustomerEmail(design))}

                    </div>

                </td>


                <td>

                    <span class="product-type-badge">

                        ${escapeHTML(
                          productTypeLabel(design.productType || design.type),
                        )}

                    </span>

                </td>


                <td>

                    <span class="design-type-badge">

                        ${escapeHTML(getDesignType(design))}

                    </span>

                </td>


                <td>

                    <span class="design-status ${currentStatus}">

                        ${escapeHTML(statusLabel(currentStatus))}

                    </span>

                </td>


                <td>

                    ${formatDate(getDesignDate(design))}

                </td>


                <td>

                    <button
                        class="view-design-btn"
                        onclick="viewDesign('${escapeHTML(String(designId))}')"
                        title="View Design"
                    >

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            `;

    designsTableBody.appendChild(row);
  });

  updateStats(allDesigns);
}

/* =========================================
   FIND DESIGN
========================================= */

function findDesign(id) {
  const designs = getDesigns();

  return designs.find((design, index) => {
    const designId = getDesignId(design, index);

    return String(designId) === String(id);
  });
}

/* =========================================
   VIEW DESIGN
========================================= */

function viewDesign(id) {
  const designs = getDesigns();

  const designIndex = designs.findIndex(
    (design, index) => String(getDesignId(design, index)) === String(id),
  );

  if (designIndex === -1) {
    alert("Design not found.");

    return;
  }

  const design = designs[designIndex];

  selectedDesignId = id;

  /* =====================================
       HEADER
    ====================================== */

  document.getElementById("detailDesignName").textContent =
    getDesignName(design);

  /* =====================================
       PREVIEW
    ====================================== */

  const preview = document.getElementById("designPreview");

  const image = getDesignImage(design);

  if (image) {
    let imagePath = image;

    if (
      !image.startsWith("data:") &&
      !image.startsWith("http") &&
      !image.startsWith("../")
    ) {
      imagePath = `../${image}`;
    }

    preview.innerHTML = `

            <img
                src="${escapeHTML(imagePath)}"
                alt="Custom Design Preview"
                onerror="
                    this.parentElement.innerHTML =
                    '<div class=&quot;preview-placeholder&quot;><i class=&quot;bi bi-image&quot;></i><span>Preview unavailable</span></div>';
                "
            >

        `;
  } else {
    preview.innerHTML = `

            <div class="preview-placeholder">

                <i class="bi bi-image"></i>

                <span>
                    No preview available
                </span>

            </div>

        `;
  }

  /* =====================================
       CUSTOMER
    ====================================== */

  document.getElementById("detailCustomerName").textContent =
    getCustomerName(design);

  document.getElementById("detailCustomerEmail").textContent =
    getCustomerEmail(design) || "—";

  document.getElementById("detailCustomerPhone").textContent =
    design.phone || design.customerPhone || "—";

  document.getElementById("detailOrderId").textContent = getOrderId(design);

  /* =====================================
       PRODUCT
    ====================================== */

  document.getElementById("detailProduct").textContent = getProductName(design);

  document.getElementById("detailProductType").textContent = productTypeLabel(
    design.productType || design.type,
  );

  document.getElementById("detailProductColor").textContent = getColor(design);

  document.getElementById("detailQuantity").textContent = getQuantity(design);

  /* =====================================
       DESIGN ELEMENTS
    ====================================== */

  renderDesignElements(design);

  /* =====================================
       NOTES
    ====================================== */

  document.getElementById("customerDesignNotes").textContent =
    design.notes ||
    design.customerNotes ||
    design.instructions ||
    "No notes provided.";

  /* =====================================
       STATUS
    ====================================== */

  designStatus.value = normalizeStatus(design.status);

  designModal.classList.add("show");
}

/* =========================================
   RENDER DESIGN ELEMENTS
========================================= */

function renderDesignElements(design) {
  const container = document.getElementById("designElements");

  container.innerHTML = "";

  const elements = getDesignElements(design);

  if (!elements.length) {
    container.innerHTML = `

            <div class="design-element">

                <strong>
                    Custom Design
                </strong>

                <span>
                    No element metadata available.
                </span>

            </div>

        `;

    return;
  }

  elements.forEach((element, index) => {
    const div = document.createElement("div");

    div.className = "design-element";

    let title = element.type || `Element ${index + 1}`;

    let value = "";

    if (element.type === "text") {
      value = element.text || element.content || "";
    } else if (element.type === "image") {
      value = "Uploaded Image";
    } else {
      value = element.value || element.name || "";
    }

    div.innerHTML = `

                <strong>

                    ${escapeHTML(title)}

                </strong>


                <span>

                    ${escapeHTML(value || "—")}

                </span>

            `;

    container.appendChild(div);
  });
}

/* =========================================
   UPDATE DESIGN STATUS
========================================= */

saveDesignStatus.addEventListener("click", function () {
  if (selectedDesignId === null) {
    return;
  }

  const newStatus = designStatus.value;

  const designs = getDesigns();

  const updated = designs.map((design, index) => {
    const designId = getDesignId(design, index);

    if (String(designId) === String(selectedDesignId)) {
      return {
        ...design,

        status: newStatus,

        updatedAt: new Date().toISOString(),
      };
    }

    return design;
  });

  saveDesigns(updated);

  showToast("Design status updated successfully.");

  renderDesigns();

  closeModal();
});

/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {
  designModal.classList.remove("show");

  selectedDesignId = null;
}

closeDesignModal.addEventListener("click", closeModal);

designModal.addEventListener("click", (event) => {
  if (event.target === designModal) {
    closeModal();
  }
});

/* =========================================
   ESC
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* =========================================
   FILTERS
========================================= */

designSearch.addEventListener("input", renderDesigns);

designStatusFilter.addEventListener("change", renderDesigns);

designTypeFilter.addEventListener("change", renderDesigns);

clearDesignFilters.addEventListener("click", function () {
  designSearch.value = "";

  designStatusFilter.value = "all";

  designTypeFilter.value = "all";

  renderDesigns();
});

/* =========================================
   TOAST
========================================= */

function showToast(message) {
  const toast = document.getElementById("adminToast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================
   LOGOUT
========================================= */

document.getElementById("adminLogout").addEventListener("click", function () {
  localStorage.removeItem("printwaveAdmin");

  window.location.href = "admin-login.html";
});

/* =========================================
   INITIALIZE
========================================= */

renderDesigns();
