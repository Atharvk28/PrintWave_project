/* =========================================================
   PRINTWAVE ORDER SUCCESS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const ORDER_KEY = "printwaveLastOrder";

  /* =====================================================
       LOAD ORDER
    ===================================================== */

  const order = getLastOrder();

  /*
   * If there is no order stored,
   * send the visitor back to the shop.
   */

  if (!order) {
    window.location.href = "shop.html";

    return;
  }

  /* =====================================================
       DISPLAY ORDER
    ===================================================== */

  displayOrder(order);

  displayItems(order);

  setupCopyButton(order);

  setupPrintButton();
});

/* =========================================================
   GET LAST ORDER
========================================================= */

function getLastOrder() {
  try {
    const savedOrder = localStorage.getItem("printwaveLastOrder");

    if (!savedOrder) {
      return null;
    }

    return JSON.parse(savedOrder);
  } catch (error) {
    console.error("Unable to load order:", error);

    return null;
  }
}

/* =========================================================
   DISPLAY ORDER
========================================================= */

function displayOrder(order) {
  const orderId = document.getElementById("orderId");

  const customerGreeting = document.getElementById("customerGreeting");

  const orderStatus = document.getElementById("orderStatus");

  const paymentStatus = document.getElementById("paymentStatus");

  const orderTotal = document.getElementById("orderTotal");

  const deliveryName = document.getElementById("deliveryName");

  const deliveryAddress = document.getElementById("deliveryAddress");

  /* =====================================================
       ORDER ID
    ===================================================== */

  orderId.textContent = order.id || "N/A";

  /* =====================================================
       CUSTOMER
    ===================================================== */

  const customer = order.customer || {};

  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    customerGreeting.textContent = `Hi ${fullName}, we've received your order and will start preparing it shortly.`;
  }

  /* =====================================================
       STATUS
    ===================================================== */

  orderStatus.textContent = order.status || "Order Placed";

  /* =====================================================
       PAYMENT
    ===================================================== */

  if (order.paymentMethod === "cod") {
    paymentStatus.textContent = "Cash on Delivery";
  } else {
    paymentStatus.textContent = order.paymentStatus || "Pending";
  }

  /* =====================================================
       TOTAL
    ===================================================== */

  orderTotal.textContent = formatCurrency(order.total || 0);

  /* =====================================================
       DELIVERY NAME
    ===================================================== */

  deliveryName.textContent = fullName || "Customer";

  /* =====================================================
       ADDRESS
    ===================================================== */

  const addressParts = [
    customer.address,

    customer.landmark,

    customer.city,

    customer.state,

    customer.pincode,
  ].filter(Boolean);

  deliveryAddress.textContent = addressParts.join(", ");

  /* =====================================================
       DELIVERY DATE
    ===================================================== */

  const deliveryDate = document.getElementById("deliveryDate");

  if (deliveryDate) {
    deliveryDate.textContent = getExpectedDelivery();
  }
}

/* =========================================================
   DISPLAY ITEMS
========================================================= */

function displayItems(order) {
  const container = document.getElementById("orderItems");

  const itemCount = document.getElementById("itemCount");

  const items = Array.isArray(order.items) ? order.items : [];

  const totalQuantity = items.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  itemCount.textContent = `${totalQuantity} ${
    totalQuantity === 1 ? "item" : "items"
  }`;

  container.innerHTML = "";

  items.forEach((item) => {
    const element = document.createElement("div");

    element.className = "success-product";

    /* IMAGE */

    const imageBox = document.createElement("div");

    imageBox.className = "success-product-image";

    if (item.image) {
      const image = document.createElement("img");

      image.src = item.image;

      image.alt = item.name || "PrintWave Product";

      image.onerror = () => {
        image.style.display = "none";

        imageBox.innerHTML = `
                            <i
                                class="bi bi-image"
                                style="
                                    font-size:22px;
                                    color:#aaa;
                                "
                            ></i>
                            `;
      };

      imageBox.appendChild(image);
    } else {
      imageBox.innerHTML = `
                    <i
                        class="bi bi-image"
                        style="
                            font-size:22px;
                            color:#aaa;
                        "
                    ></i>
                    `;
    }

    /* INFO */

    const info = document.createElement("div");

    info.className = "success-product-info";

    const name = document.createElement("div");

    name.className = "success-product-name";

    name.textContent = item.name || "Custom Product";

    const meta = document.createElement("div");

    meta.className = "success-product-meta";

    const details = [];

    if (item.size) {
      details.push(`Size: ${item.size}`);
    }

    if (item.color) {
      details.push(`Color: ${item.color}`);
    }

    details.push(`Qty: ${item.quantity || 1}`);

    if (item.custom || item.designElements) {
      details.push("Custom Design");
    }

    meta.textContent = details.join(" • ");

    info.appendChild(name);

    info.appendChild(meta);

    /* PRICE */

    const price = document.createElement("div");

    price.className = "success-product-price";

    const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);

    price.textContent = formatCurrency(itemTotal);

    /* APPEND */

    element.appendChild(imageBox);

    element.appendChild(info);

    element.appendChild(price);

    container.appendChild(element);
  });
}

/* =========================================================
   COPY ORDER ID
========================================================= */

function setupCopyButton(order) {
  const button = document.getElementById("copyOrderId");

  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    const orderId = order.id;

    try {
      await navigator.clipboard.writeText(orderId);

      button.innerHTML = '<i class="bi bi-check-lg"></i>';

      setTimeout(() => {
        button.innerHTML = '<i class="bi bi-copy"></i>';
      }, 1500);
    } catch (error) {
      /*
       * Fallback for browsers where
       * Clipboard API isn't available.
       */

      const temporaryInput = document.createElement("input");

      temporaryInput.value = orderId;

      document.body.appendChild(temporaryInput);

      temporaryInput.select();

      document.execCommand("copy");

      temporaryInput.remove();

      button.innerHTML = '<i class="bi bi-check-lg"></i>';

      setTimeout(() => {
        button.innerHTML = '<i class="bi bi-copy"></i>';
      }, 1500);
    }
  });
}

/* =========================================================
   PRINT ORDER
========================================================= */

function setupPrintButton() {
  const button = document.getElementById("printOrder");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    window.print();
  });
}

/* =========================================================
   EXPECTED DELIVERY
========================================================= */

function getExpectedDelivery() {
  const today = new Date();

  const startDate = new Date(today);

  startDate.setDate(startDate.getDate() + 5);

  const endDate = new Date(today);

  endDate.setDate(endDate.getDate() + 7);

  const options = {
    day: "numeric",
    month: "short",
  };

  return `${startDate.toLocaleDateString(
    "en-IN",
    options,
  )} – ${endDate.toLocaleDateString("en-IN", options)}`;
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
