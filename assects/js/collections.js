/* =========================================================
   PRINTWAVE COLLECTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       COLLECTION DATA
    ===================================================== */

  const collections = {
    ganesh: {
      title: "Ganesh Chaturthi",
      type: "FESTIVAL COLLECTION",
      description:
        "Celebrate Ganesh Chaturthi with vibrant designs created for the festive spirit.",
      heroTitle: "Celebrate Ganesh Chaturthi.",
      heroDescription:
        "Festive designs made to bring colour, devotion and celebration to your style.",
    },

    diwali: {
      title: "Diwali",
      type: "FESTIVAL COLLECTION",
      description:
        "Light up your celebration with unique Diwali-inspired designs.",
      heroTitle: "Light Up Your Style.",
      heroDescription:
        "Discover Diwali-inspired designs made for the festival of lights.",
    },

    holi: {
      title: "Holi",
      type: "FESTIVAL COLLECTION",
      description:
        "Bring colour to your wardrobe with fun and vibrant Holi designs.",
      heroTitle: "Add Some Colour.",
      heroDescription:
        "Bold, colourful designs created for the festival of colours.",
    },

    kabaddi: {
      title: "Kabaddi",
      type: "TEAM COLLECTION",
      description:
        "Represent your squad with custom Kabaddi-inspired merchandise.",
      heroTitle: "Play Hard. Wear Proud.",
      heroDescription:
        "Team-inspired designs for players, supporters and Kabaddi lovers.",
    },

    cricket: {
      title: "Cricket",
      type: "TEAM COLLECTION",
      description:
        "Bring your cricket passion to life with custom team merchandise.",
      heroTitle: "For The Love Of Cricket.",
      heroDescription:
        "Cricket-inspired designs for teams, fans, friends and communities.",
    },

    football: {
      title: "Football",
      type: "TEAM COLLECTION",
      description:
        "Represent your team and your game with bold football merchandise.",
      heroTitle: "Own The Game.",
      heroDescription:
        "Football-inspired designs built for players and passionate supporters.",
    },

    college: {
      title: "College Teams",
      type: "TEAM COLLECTION",
      description:
        "Create merchandise that brings your college team and friends together.",
      heroTitle: "Your College. Your Team.",
      heroDescription:
        "Custom merchandise made for college teams, events and student groups.",
    },
  };

  /* =====================================================
       DOM ELEMENTS
    ===================================================== */

  const heroLabel = document.getElementById("collectionHeroLabel");

  const heroTitle = document.getElementById("collectionHeroTitle");

  const heroDescription = document.getElementById("collectionHeroDescription");

  const activeType = document.getElementById("activeCollectionType");

  const activeTitle = document.getElementById("activeCollectionTitle");

  const activeDescription = document.getElementById(
    "activeCollectionDescription",
  );

  const productContainer = document.getElementById("collectionProducts");

  const productCount = document.getElementById("collectionProductCount");

  const emptyState = document.getElementById("collectionEmpty");

  const viewAllLink = document.getElementById("viewAllCollectionLink");

  const collectionTabs = document.querySelectorAll(".collection-tab");

  /* =====================================================
       GET COLLECTION FROM URL
    ===================================================== */

  const params = new URLSearchParams(window.location.search);

  let currentCollection = params.get("collection") || "ganesh";

  /*
       If an invalid collection is entered,
       fall back to Ganesh Chaturthi.
    */

  if (!collections[currentCollection]) {
    currentCollection = "ganesh";
  }

  /* =====================================================
       FORMAT PRICE
    ===================================================== */

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  /* =====================================================
       PRODUCT DATA
    ===================================================== */

  function getCollectionProducts(collectionKey) {
    /*
         products.js already contains the product collection
         field.

         Example:

         collection: "ganesh"
         collection: "cricket"
         collection: "diwali"
        */

    if (!Array.isArray(window.products)) {
      return [];
    }

    return window.products.filter((product) => {
      return (
        String(product.collection).toLowerCase() === collectionKey.toLowerCase()
      );
    });
  }

  /* =====================================================
       PRODUCT CARD
    ===================================================== */

  function createProductCard(product) {
    const oldPrice = product.oldPrice
      ? `
                <span class="old-price">
                    ${formatPrice(product.oldPrice)}
                </span>
            `
      : "";

    const badge = product.badge
      ? `
                <span class="collection-product-badge">
                    ${product.badge}
                </span>
            `
      : "";

    const image = product.image || "assets/images/products/placeholder.jpg";

    return `

            <div class="col-sm-6 col-lg-4 col-xl-3">

                <article class="collection-product-card">

                    <div class="collection-product-image">

                        <img
                            src="${image}"
                            alt="${product.name}"
                            loading="lazy"
                            onerror="this.src='assets/images/products/placeholder.jpg'"
                        >

                        ${badge}

                    </div>


                    <div class="collection-product-info">

                        <span class="collection-product-category">
                            ${product.category || "Product"}
                        </span>


                        <h3 class="collection-product-name">
                            ${product.name}
                        </h3>


                        <div class="collection-product-price">

                            <span class="current-price">
                                ${formatPrice(product.price)}
                            </span>

                            ${oldPrice}

                        </div>


                        <div class="collection-product-actions">

                            <a
                                href="product.html?id=${product.id}"
                                class="view-product"
                            >
                                View Product
                            </a>


                            <button
                                type="button"
                                class="add-product"
                                data-product-id="${product.id}"
                            >
                                Add to Cart
                            </button>

                        </div>

                    </div>

                </article>

            </div>

        `;
  }

  /* =====================================================
       RENDER COLLECTION
    ===================================================== */

  function renderCollection(collectionKey) {
    const collection = collections[collectionKey];

    if (!collection) {
      return;
    }

    /* Update hero */

    heroLabel.textContent = "PRINTWAVE • " + collection.type;

    heroTitle.innerHTML = `${collection.heroTitle.split(".")[0]}.<span>${collection.heroTitle.split(".").slice(1).join(".")}</span>`;

    /*
         If the title does not contain a second sentence,
         use the collection title instead.
        */

    if (!collection.heroTitle.includes(".")) {
      heroTitle.innerHTML = `${collection.heroTitle}<span></span>`;
    }

    heroDescription.textContent = collection.heroDescription;

    /* Active collection */

    activeType.textContent = collection.type;

    activeTitle.textContent = collection.title;

    activeDescription.textContent = collection.description;

    /* Products */

    const products = getCollectionProducts(collectionKey);

    productCount.textContent = `${products.length} Product${products.length !== 1 ? "s" : ""}`;

    if (products.length === 0) {
      productContainer.innerHTML = "";

      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";

      productContainer.innerHTML = products.map(createProductCard).join("");
    }

    /* View all */

    viewAllLink.href = `shop.html?collection=${collectionKey}`;

    /* Active tab */

    collectionTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.collection === collectionKey);
    });

    /* Page title */

    document.title = `${collection.title} Collection | PrintWave`;
  }

  /* =====================================================
       CHANGE COLLECTION
    ===================================================== */

  collectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const collectionKey = tab.dataset.collection;

      if (!collections[collectionKey]) {
        return;
      }

      currentCollection = collectionKey;

      /*
             Update URL without reloading
            */

      const newUrl = `${window.location.pathname}?collection=${collectionKey}`;

      window.history.pushState({ collection: collectionKey }, "", newUrl);

      renderCollection(collectionKey);

      /*
             Smoothly move to products
            */

      document.querySelector(".active-collection-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =====================================================
       BROWSER BACK / FORWARD
    ===================================================== */

  window.addEventListener("popstate", () => {
    const urlParams = new URLSearchParams(window.location.search);

    let collectionKey = urlParams.get("collection") || "ganesh";

    if (!collections[collectionKey]) {
      collectionKey = "ganesh";
    }

    currentCollection = collectionKey;

    renderCollection(collectionKey);
  });

  /* =====================================================
       ADD TO CART
    ===================================================== */

  productContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".add-product");

    if (!button) {
      return;
    }

    const productId = button.dataset.productId;

    const product = window.products?.find(
      (item) => String(item.id) === String(productId),
    );

    if (!product) {
      return;
    }

    /*
             Use existing PrintWave cart
            */

    let cart = JSON.parse(localStorage.getItem("printwaveCart")) || [];

    /*
             Keep the same cart structure used
             by the existing Shop / Product pages.
            */

    const existing = cart.find(
      (item) => String(item.id) === String(product.id) && !item.custom,
    );

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,

        name: product.name,

        price: product.price,

        oldPrice: product.oldPrice || null,

        image: product.image,

        category: product.category,

        type: product.type,

        size: product.sizes?.[0] || null,

        color: product.colors?.[0] || null,

        quantity: 1,

        customizable: product.customizable || false,
      });
    }

    localStorage.setItem("printwaveCart", JSON.stringify(cart));

    /*
             Update global cart count
             */

    if (typeof window.updateGlobalCartCount === "function") {
      window.updateGlobalCartCount();
    }

    showCollectionToast(`${product.name} added to cart`);
  });

  /* =====================================================
       TOAST
    ===================================================== */

  function showCollectionToast(message) {
    let toast = document.getElementById("collectionToast");

    if (!toast) {
      toast = document.createElement("div");

      toast.id = "collectionToast";

      toast.style.position = "fixed";

      toast.style.right = "20px";

      toast.style.bottom = "20px";

      toast.style.zIndex = "9999";

      toast.style.padding = "13px 18px";

      toast.style.borderRadius = "8px";

      toast.style.background = "#111";

      toast.style.color = "#fff";

      toast.style.fontSize = "14px";

      toast.style.fontWeight = "600";

      toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";

      toast.style.transition = "opacity 0.3s ease";

      document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.opacity = "1";

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 2200);
  }

  /* =====================================================
       INITIALIZE
    ===================================================== */

  renderCollection(currentCollection);
});
