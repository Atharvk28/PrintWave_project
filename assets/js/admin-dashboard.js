/* =========================================================
   PRINTWAVE - ADMIN DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       STORAGE KEYS
    ===================================================== */

  const ORDERS_KEY = "printwaveOrders";
  const USERS_KEY = "printwaveUsers";
  const DESIGNS_KEY = "printwaveDesigns";
  const COUPONS_KEY = "printwaveCoupons";
  const ADMIN_KEY = "printwaveAdmin";

  /* =====================================================
       HELPERS
    ===================================================== */

  function getJSON(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);

      if (!data) {
        return fallback;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(`PrintWave: Could not read ${key}`, error);

      return fallback;
    }
  }

  function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function formatCurrency(amount) {
    const value = Number(amount) || 0;

    return `₹${value.toLocaleString("en-IN")}`;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /* =====================================================
       LOAD DATA
    ===================================================== */

  let orders = getJSON(ORDERS_KEY, []);

  let users = getJSON(USERS_KEY, []);

  let designs = getJSON(DESIGNS_KEY, []);

  let coupons = getJSON(COUPONS_KEY, []);

  /*
   * products.js is loaded before this file.
   */

  let productList = [];

  if (typeof products !== "undefined" && Array.isArray(products)) {
    productList = products;
  }

  /* =====================================================
       ADMIN INFORMATION
    ===================================================== */

  const adminName = document.getElementById("adminName");

  const savedAdmin = getJSON(ADMIN_KEY, null);

  if (adminName && savedAdmin) {
    adminName.textContent = savedAdmin.name || "Administrator";
  }

  /* =====================================================
       STATISTICS
    ===================================================== */

  function getOrderTotal(order) {
    return Number(order.total ?? order.grandTotal ?? order.amount ?? 0) || 0;
  }

  function getOrderStatus(order) {
    return String(order.status || "Processing").toLowerCase();
  }

  function calculateRevenue() {
    return orders.reduce((total, order) => {
      const status = getOrderStatus(order);

      /*
       * Cancelled/failed orders are not counted
       * as actual revenue.
       */

      if (
        status === "cancelled" ||
        status === "canceled" ||
        status === "failed"
      ) {
        return total;
      }

      return total + getOrderTotal(order);
    }, 0);
  }

  function updateStatistics() {
    const statOrders = document.getElementById("statOrders");

    const statRevenue = document.getElementById("statRevenue");

    const statProducts = document.getElementById("statProducts");

    const statCustomers = document.getElementById("statCustomers");

    const statPending = document.getElementById("statPending");

    const statCompleted = document.getElementById("statCompleted");

    const statDesigns = document.getElementById("statDesigns");

    const statCoupons = document.getElementById("statCoupons");

    if (statOrders) {
      statOrders.textContent = orders.length;
    }

    if (statRevenue) {
      statRevenue.textContent = formatCurrency(calculateRevenue());
    }

    if (statProducts) {
      statProducts.textContent = productList.length;
    }

    if (statCustomers) {
      statCustomers.textContent = users.length;
    }

    /*
     * Pending orders
     */

    const pendingStatuses = [
      "pending",
      "processing",
      "confirmed",
      "packed",
      "shipped",
    ];

    const pendingCount = orders.filter((order) =>
      pendingStatuses.includes(getOrderStatus(order)),
    ).length;

    if (statPending) {
      statPending.textContent = pendingCount;
    }

    /*
     * Completed orders
     */

    const completedStatuses = ["completed", "delivered", "success"];

    const completedCount = orders.filter((order) =>
      completedStatuses.includes(getOrderStatus(order)),
    ).length;

    if (statCompleted) {
      statCompleted.textContent = completedCount;
    }

    if (statDesigns) {
      statDesigns.textContent = designs.length;
    }

    /*
     * Active coupons
     */

    const activeCoupons = coupons.filter((coupon) => {
      if (coupon.active === false || coupon.enabled === false) {
        return false;
      }

      if (!coupon.expiry) {
        return true;
      }

      return new Date(coupon.expiry) >= new Date();
    });

    if (statCoupons) {
      statCoupons.textContent = activeCoupons.length;
    }
  }

  /* =====================================================
       RECENT ORDERS
    ===================================================== */

  function getOrderId(order) {
    return order.orderId || order.id || "PW-ORDER";
  }

  function getCustomerName(order) {
    if (order.customer && typeof order.customer === "object") {
      const customer = order.customer;

      if (customer.firstName || customer.lastName) {
        return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
      }

      if (customer.name) {
        return customer.name;
      }
    }

    if (order.firstName || order.lastName) {
      return `${order.firstName || ""} ${order.lastName || ""}`.trim();
    }

    return order.name || "Customer";
  }

  function getOrderDate(order) {
    return order.createdAt || order.date || order.orderDate || null;
  }

  function statusClass(status) {
    const normalized = String(status).toLowerCase().replace(/\s+/g, "-");

    if (
      normalized === "delivered" ||
      normalized === "completed" ||
      normalized === "success"
    ) {
      return "completed";
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled" ||
      normalized === "failed"
    ) {
      return "cancelled";
    }

    if (normalized === "pending") {
      return "pending";
    }

    return "processing";
  }

  function renderRecentOrders() {
    const table = document.getElementById("recentOrdersTable");

    if (!table) {
      return;
    }

    if (!Array.isArray(orders) || orders.length === 0) {
      table.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="admin-table-empty"
                    >
                        <i class="bi bi-inbox"></i>
                        <span>No orders yet</span>
                    </td>
                </tr>
            `;

      return;
    }

    /*
     * Sort newest first.
     */

    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(getOrderDate(a) || 0).getTime();

      const dateB = new Date(getOrderDate(b) || 0).getTime();

      return dateB - dateA;
    });

    const recent = sortedOrders.slice(0, 5);

    table.innerHTML = recent
      .map((order) => {
        const orderId = getOrderId(order);

        const customer = getCustomerName(order);

        const date = formatDate(getOrderDate(order));

        const amount = formatCurrency(getOrderTotal(order));

        const status = order.status || "Processing";

        return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(orderId)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(customer)}
                        </td>

                        <td>
                            ${escapeHTML(date)}
                        </td>

                        <td>
                            <strong>
                                ${amount}
                            </strong>
                        </td>

                        <td>

                            <span
                                class="admin-status ${statusClass(status)}"
                            >
                                ${escapeHTML(status)}
                            </span>

                        </td>

                    </tr>
                `;
      })
      .join("");
  }

  /* =====================================================
       PRODUCT SUMMARY
    ===================================================== */

  function updateProductSummary() {
    const summaryProducts = document.getElementById("summaryProducts");

    const summaryTshirts = document.getElementById("summaryTshirts");

    const summaryScarves = document.getElementById("summaryScarves");

    const summaryMugs = document.getElementById("summaryMugs");

    if (summaryProducts) {
      summaryProducts.textContent = productList.length;
    }

    const tshirts = productList.filter((product) => {
      const category = String(
        product.category || product.type || "",
      ).toLowerCase();

      return (
        category.includes("tshirt") ||
        category.includes("t-shirt") ||
        category.includes("tee")
      );
    });

    const scarves = productList.filter((product) => {
      const category = String(
        product.category || product.type || "",
      ).toLowerCase();

      return category.includes("scarf");
    });

    const mugs = productList.filter((product) => {
      const category = String(
        product.category || product.type || "",
      ).toLowerCase();

      return category.includes("mug");
    });

    if (summaryTshirts) {
      summaryTshirts.textContent = tshirts.length;
    }

    if (summaryScarves) {
      summaryScarves.textContent = scarves.length;
    }

    if (summaryMugs) {
      summaryMugs.textContent = mugs.length;
    }
  }

  /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

  const menuToggle = document.getElementById("adminMenuToggle");

  const sidebar = document.getElementById("adminSidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    /*
     * Close sidebar when clicking a link
     * on mobile.
     */

    sidebar.querySelectorAll(".admin-nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 991) {
          sidebar.classList.remove("open");
        }
      });
    });
  }

  /* =====================================================
       ADMIN LOGOUT
    ===================================================== */

  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      const confirmed = confirm(
        "Are you sure you want to logout from the Admin Panel?",
      );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(ADMIN_KEY);

      window.location.href = "admin-login.html";
    });
  }

  /* =====================================================
       FOOTER YEAR
    ===================================================== */

  const footerYear = document.getElementById("adminFooterYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* =====================================================
       INITIALIZE
    ===================================================== */

  updateStatistics();

  renderRecentOrders();

  updateProductSummary();

  console.log("PrintWave Admin Dashboard loaded successfully.");
});
