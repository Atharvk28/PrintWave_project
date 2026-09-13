/* =========================================================
   PRINTWAVE CART
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "printwaveCart";

  let cart = getCart();

  let discount = 0;

  let appliedCoupon = null;

  /* =====================================================
       DOM ELEMENTS
    ===================================================== */

  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");
  const cartItems = document.getElementById("cartItems");

  const cartCount = document.getElementById("cartCount");
  const cartItemText = document.getElementById("cartItemText");

  const subtotalElement = document.getElementById("subtotal");
  const discountElement = document.getElementById("discount");
  const totalElement = document.getElementById("total");

  const clearCartButton = document.getElementById("clearCart");

  const couponInput = document.getElementById("couponInput");
  const applyCouponButton = document.getElementById("applyCoupon");
  const couponMessage = document.getElementById("couponMessage");

  const checkoutButton = document.getElementById("checkoutButton");

  /* =====================================================
       INITIALIZE
    ===================================================== */

  renderCart();
  updateCartCount();

  /* =====================================================
       GET CART
    ===================================================== */

  function getCart() {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Could not load cart:", error);

      return [];
    }
  }

  /* =====================================================
       SAVE CART
    ===================================================== */

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCount();
  }

  /* =====================================================
       CART COUNT
    ===================================================== */

  function updateCartCount() {
    const count = cart.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);

    if (cartCount) {
      cartCount.textContent = count;
    }
  }

  /* =====================================================
       RENDER CART
    ===================================================== */

  function renderCart() {
    if (!cart.length) {
      emptyCart.style.display = "block";
      cartContent.style.display = "none";

      return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "flex";

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
      const cartItem = createCartItem(item, index);

      cartItems.appendChild(cartItem);
    });

    updateSummary();
  }

  /* =====================================================
       CREATE CART ITEM
    ===================================================== */

  function createCartItem(item, index) {
    const wrapper = document.createElement("div");

    wrapper.className = "cart-item";

    /* ---------------------------------------------
           IMAGE
        --------------------------------------------- */

    const imageContainer = document.createElement("div");

    imageContainer.className = "cart-product-image";

    if (item.image) {
      const image = document.createElement("img");

      image.src = item.image;

      image.alt = item.name || "PrintWave Product";

      image.onerror = () => {
        image.style.display = "none";

        imageContainer.innerHTML =
          '<i class="bi bi-image" style="font-size:35px;color:#aaa;"></i>';
      };

      imageContainer.appendChild(image);
    } else {
      imageContainer.innerHTML =
        '<i class="bi bi-image" style="font-size:35px;color:#aaa;"></i>';
    }

    /* ---------------------------------------------
           PRODUCT INFO
        --------------------------------------------- */

    const info = document.createElement("div");

    info.className = "cart-product-info";

    /* CUSTOM DESIGN LABEL */

    if (item.custom || item.customizable || item.designElements) {
      const customLabel = document.createElement("div");

      customLabel.className = "custom-design-label";

      customLabel.innerHTML = `
                <i class="bi bi-magic"></i>
                Custom Design
            `;

      info.appendChild(customLabel);
    }

    /* NAME */

    const name = document.createElement("div");

    name.className = "cart-product-name";

    name.textContent = item.name || "Custom Product";

    info.appendChild(name);

    /* PRICE */

    const price = document.createElement("div");

    price.className = "cart-product-price";

    price.textContent = formatCurrency(item.price);

    info.appendChild(price);

    /* META */

    const meta = document.createElement("div");

    meta.className = "cart-product-meta";

    if (item.size) {
      meta.appendChild(createMeta("Size", item.size));
    }

    if (item.color) {
      meta.appendChild(createMeta("Color", item.color));
    }

    if (item.type) {
      meta.appendChild(createMeta("Type", capitalize(item.type)));
    }

    info.appendChild(meta);

    /* QUANTITY */

    const quantity = document.createElement("div");

    quantity.className = "cart-quantity";

    const decrease = document.createElement("button");

    decrease.className = "quantity-btn";

    decrease.innerHTML = '<i class="bi bi-dash"></i>';

    decrease.addEventListener("click", () => updateQuantity(index, -1));

    const quantityValue = document.createElement("span");

    quantityValue.className = "quantity-value";

    quantityValue.textContent = item.quantity || 1;

    const increase = document.createElement("button");

    increase.className = "quantity-btn";

    increase.innerHTML = '<i class="bi bi-plus"></i>';

    increase.addEventListener("click", () => updateQuantity(index, 1));

    quantity.appendChild(decrease);
    quantity.appendChild(quantityValue);
    quantity.appendChild(increase);

    info.appendChild(quantity);

    /* REMOVE */

    const remove = document.createElement("button");

    remove.className = "remove-item-btn";

    remove.style.marginTop = "12px";

    remove.innerHTML = `
            <i class="bi bi-trash3"></i>
            Remove
        `;

    remove.addEventListener("click", () => removeItem(index));

    info.appendChild(remove);

    /* ---------------------------------------------
           TOTAL
        --------------------------------------------- */

    const itemTotal = document.createElement("div");

    itemTotal.className = "cart-item-total";

    const itemQuantity = Number(item.quantity || 1);

    itemTotal.textContent = formatCurrency(
      Number(item.price || 0) * itemQuantity,
    );

    /* ---------------------------------------------
           APPEND
        --------------------------------------------- */

    wrapper.appendChild(imageContainer);

    wrapper.appendChild(info);

    wrapper.appendChild(itemTotal);

    return wrapper;
  }

  /* =====================================================
       META CREATOR
    ===================================================== */

  function createMeta(label, value) {
    const element = document.createElement("span");

    element.className = "cart-meta-item";

    element.textContent = `${label}: ${value}`;

    return element;
  }

  /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

  function updateQuantity(index, change) {
    if (!cart[index]) {
      return;
    }

    let quantity = Number(cart[index].quantity || 1);

    quantity += change;

    if (quantity <= 0) {
      removeItem(index);

      return;
    }

    /* Safety limit */

    if (quantity > 20) {
      showCartMessage("Maximum quantity is 20.");

      return;
    }

    cart[index].quantity = quantity;

    saveCart();

    renderCart();
  }

  /* =====================================================
       REMOVE ITEM
    ===================================================== */

  function removeItem(index) {
    if (!cart[index]) {
      return;
    }

    const productName = cart[index].name || "Product";

    cart.splice(index, 1);

    saveCart();

    renderCart();

    showCartMessage(`${productName} removed from cart.`);
  }

  /* =====================================================
       CLEAR CART
    ===================================================== */

  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
      if (!cart.length) {
        return;
      }

      const confirmed = confirm(
        "Are you sure you want to remove all items from your cart?",
      );

      if (!confirmed) {
        return;
      }

      cart = [];

      discount = 0;

      appliedCoupon = null;

      saveCart();

      renderCart();

      if (couponMessage) {
        couponMessage.textContent = "";
      }

      if (couponInput) {
        couponInput.value = "";
      }
    });
  }

  /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

  function updateSummary() {
    const subtotal = calculateSubtotal();

    const shipping = calculateShipping(subtotal);

    const total = Math.max(0, subtotal + shipping - discount);

    subtotalElement.textContent = formatCurrency(subtotal);

    discountElement.textContent =
      discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0);

    totalElement.textContent = formatCurrency(total);

    cartItemText.textContent = `${getTotalItems()} ${
      getTotalItems() === 1 ? "item" : "items"
    }`;
  }

  /* =====================================================
       SUBTOTAL
    ===================================================== */

  function calculateSubtotal() {
    return cart.reduce((total, item) => {
      const price = Number(item.price || 0);

      const quantity = Number(item.quantity || 1);

      return total + price * quantity;
    }, 0);
  }

  /* =====================================================
       SHIPPING
    ===================================================== */

  function calculateShipping(subtotal) {
    /*
     * PrintWave currently uses FREE shipping.
     *
     * Later this can become:
     * - Pincode based
     * - Weight based
     * - Delivery speed based
     */

    return 0;
  }

  /* =====================================================
       TOTAL ITEMS
    ===================================================== */

  function getTotalItems() {
    return cart.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);
  }

  /* =====================================================
       COUPON SYSTEM
    ===================================================== */

  if (applyCouponButton) {
    applyCouponButton.addEventListener("click", applyCoupon);
  }

  function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
      couponMessage.textContent = "Please enter a coupon code.";

      couponMessage.style.color = "#dc3545";

      return;
    }

    const subtotal = calculateSubtotal();

    /*
     * DEMO COUPONS
     *
     * These are frontend-only for now.
     * Later coupon validation must happen
     * on the backend.
     */

    const coupons = {
      PRINT10: {
        type: "percentage",
        value: 10,
      },

      WELCOME50: {
        type: "fixed",
        value: 50,
      },

      WAVE20: {
        type: "percentage",
        value: 20,
      },
    };

    const coupon = coupons[code];

    if (!coupon) {
      discount = 0;

      appliedCoupon = null;

      couponMessage.textContent = "Invalid coupon code.";

      couponMessage.style.color = "#dc3545";

      updateSummary();

      return;
    }

    if (coupon.type === "percentage") {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    appliedCoupon = code;

    couponMessage.textContent = `${code} applied successfully!`;

    couponMessage.style.color = "#218838";

    updateSummary();
  }

  /* =====================================================
       CHECKOUT
    ===================================================== */

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (!cart.length) {
        return;
      }

      /*
       * Checkout page will be built next.
       */

      window.location.href = "checkout.html";
    });
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

  /* =====================================================
       CAPITALIZE
    ===================================================== */

  function capitalize(value) {
    if (!value) {
      return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /* =====================================================
       CART MESSAGE
    ===================================================== */

  function showCartMessage(message) {
    /*
     * Small temporary notification.
     */

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";

    toast.style.bottom = "25px";

    toast.style.right = "25px";

    toast.style.zIndex = "9999";

    toast.style.background = "#111";

    toast.style.color = "#fff";

    toast.style.padding = "12px 18px";

    toast.style.borderRadius = "8px";

    toast.style.fontSize = "12px";

    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,.2)";

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }
});
