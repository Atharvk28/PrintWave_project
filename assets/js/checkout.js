/* =========================================================
   PRINTWAVE CHECKOUT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "printwaveCart";

  let cart = getCart();

  let discount = 0;

  const checkoutForm = document.getElementById("checkoutForm");

  const checkoutItems = document.getElementById("checkoutItems");

  const subtotalElement = document.getElementById("checkoutSubtotal");

  const discountElement = document.getElementById("checkoutDiscount");

  const totalElement = document.getElementById("checkoutTotal");

  const onlinePaymentNotice = document.getElementById("onlinePaymentNotice");

  /* =====================================================
       CHECK CART
    ===================================================== */

  if (!cart.length) {
    window.location.href = "cart.html";

    return;
  }

  /* =====================================================
       INITIALIZE
    ===================================================== */

  renderCheckoutItems();

  updateSummary();

  setupPaymentMethods();

  setupValidation();

  /* =====================================================
       GET CART
    ===================================================== */

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
      console.error("Unable to load cart:", error);

      return [];
    }
  }

  /* =====================================================
       RENDER ITEMS
    ===================================================== */

  function renderCheckoutItems() {
    checkoutItems.innerHTML = "";

    cart.forEach((item) => {
      const element = document.createElement("div");

      element.className = "checkout-item";

      /* IMAGE */

      const imageBox = document.createElement("div");

      imageBox.className = "checkout-item-image";

      if (item.image) {
        const image = document.createElement("img");

        image.src = item.image;

        image.alt = item.name || "Product";

        image.onerror = () => {
          image.style.display = "none";

          imageBox.innerHTML =
            '<i class="bi bi-image" style="font-size:22px;color:#aaa;"></i>';
        };

        imageBox.appendChild(image);
      } else {
        imageBox.innerHTML =
          '<i class="bi bi-image" style="font-size:22px;color:#aaa;"></i>';
      }

      /* INFO */

      const info = document.createElement("div");

      info.className = "checkout-item-info";

      const name = document.createElement("div");

      name.className = "checkout-item-name";

      name.textContent = item.name || "Custom Product";

      const meta = document.createElement("div");

      meta.className = "checkout-item-meta";

      const details = [];

      if (item.size) {
        details.push(`Size: ${item.size}`);
      }

      if (item.color) {
        details.push(`Color: ${item.color}`);
      }

      details.push(`Qty: ${item.quantity || 1}`);

      meta.textContent = details.join(" • ");

      info.appendChild(name);

      info.appendChild(meta);

      /* PRICE */

      const price = document.createElement("div");

      price.className = "checkout-item-price";

      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);

      price.textContent = formatCurrency(itemTotal);

      element.appendChild(imageBox);

      element.appendChild(info);

      element.appendChild(price);

      checkoutItems.appendChild(element);
    });
  }

  /* =====================================================
       SUMMARY
    ===================================================== */

  function updateSummary() {
    const subtotal = calculateSubtotal();

    /*
     * The current cart system supports
     * coupon discounts visually.
     *
     * We also check sessionStorage/localStorage
     * for a saved coupon if one is added later.
     */

    const savedDiscount =
      Number(sessionStorage.getItem("printwaveDiscount")) || 0;

    discount = savedDiscount;

    const total = Math.max(0, subtotal - discount);

    subtotalElement.textContent = formatCurrency(subtotal);

    discountElement.textContent =
      discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0);

    totalElement.textContent = formatCurrency(total);
  }

  /* =====================================================
       SUBTOTAL
    ===================================================== */

  function calculateSubtotal() {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }

  /* =====================================================
       PAYMENT METHODS
    ===================================================== */

  function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll(
      'input[name="paymentMethod"]',
    );

    paymentMethods.forEach((method) => {
      method.addEventListener("change", () => {
        if (method.value === "online" && method.checked) {
          onlinePaymentNotice.style.display = "block";
        } else {
          onlinePaymentNotice.style.display = "none";
        }
      });
    });
  }

  /* =====================================================
       FORM VALIDATION
    ===================================================== */

  function setupValidation() {
    const phone = document.getElementById("phone");

    const pincode = document.getElementById("pincode");

    /* PHONE */

    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
    });

    /* PINCODE */

    pincode.addEventListener("input", () => {
      pincode.value = pincode.value.replace(/\D/g, "").slice(0, 6);
    });
  }

  /* =====================================================
       SUBMIT ORDER
    ===================================================== */

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();

      return;
    }

    const phone = document.getElementById("phone").value;

    const pincode = document.getElementById("pincode").value;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");

      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode.");

      return;
    }

    placeOrder();
  });

  /* =====================================================
       PLACE ORDER
    ===================================================== */

  function placeOrder() {
    const button = document.getElementById("placeOrderButton");

    button.disabled = true;

    button.innerHTML = `
            <span>
                Processing Order...
            </span>

            <i class="bi bi-hourglass-split"></i>
        `;

    const formData = new FormData(checkoutForm);

    const customer = {
      firstName: formData.get("firstName"),

      lastName: formData.get("lastName"),

      email: formData.get("email"),

      phone: formData.get("phone"),

      address: formData.get("address"),

      landmark: formData.get("landmark"),

      city: formData.get("city"),

      state: formData.get("state"),

      pincode: formData.get("pincode"),

      instructions: formData.get("instructions"),
    };

    const paymentMethod = formData.get("paymentMethod");

    const subtotal = calculateSubtotal();

    const total = Math.max(0, subtotal - discount);

    const order = {
      id: generateOrderId(),

      createdAt: new Date().toISOString(),

      status: "Placed",

      customer: customer,

      paymentMethod: paymentMethod,

      paymentStatus: paymentMethod === "cod" ? "Pending" : "Pending",

      items: cart,

      subtotal: subtotal,

      discount: discount,

      shipping: 0,

      total: total,
    };

    /*
     * Store the order locally for now.
     *
     * Later this will be sent to our
     * backend/database instead.
     */

    localStorage.setItem("printwaveLastOrder", JSON.stringify(order));

    /* Save order history */

    let orders = [];

    try {
      orders = JSON.parse(localStorage.getItem("printwaveOrders")) || [];
    } catch {
      orders = [];
    }

    orders.push(order);

    localStorage.setItem("printwaveOrders", JSON.stringify(orders));

    /*
     * Clear cart after successful order.
     */

    localStorage.removeItem(CART_KEY);

    /*
     * Give the user a small delay
     * so processing feels natural.
     */

    setTimeout(() => {
      window.location.href = `order-success.html?order=${encodeURIComponent(order.id)}`;
    }, 800);
  }

  /* =====================================================
       ORDER ID
    ===================================================== */

  function generateOrderId() {
    const now = new Date();

    const year = now.getFullYear();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `PW-${year}-${random}`;
  }

  /* =====================================================
       CURRENCY
    ===================================================== */

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
});
