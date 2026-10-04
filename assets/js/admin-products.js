/* =========================================
   PRINTWAVE ADMIN PRODUCTS
========================================= */

/* =========================================
   STORAGE KEY
========================================= */

const ADMIN_PRODUCTS_KEY = "printwaveAdminProducts";

/* =========================================
   GET DEFAULT PRODUCTS
========================================= */

function getDefaultProducts() {
  if (typeof products !== "undefined" && Array.isArray(products)) {
    return products.map((product) => ({
      ...product,

      stock: product.stock ?? 20,

      status: product.status ?? "active",

      image: product.image || "",
    }));
  }

  return [];
}

/* =========================================
   LOAD PRODUCTS
========================================= */

function getAdminProducts() {
  const stored = localStorage.getItem(ADMIN_PRODUCTS_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Could not read admin products", error);
    }
  }

  const defaultProducts = getDefaultProducts();

  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(defaultProducts));

  return defaultProducts;
}

/* =========================================
   SAVE PRODUCTS
========================================= */

function saveAdminProducts(productList) {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(productList));
}

/* =========================================
   ELEMENTS
========================================= */

const tableBody = document.getElementById("productsTableBody");

const emptyProducts = document.getElementById("emptyProducts");

const productSearch = document.getElementById("productSearch");

const categoryFilter = document.getElementById("categoryFilter");

const collectionFilter = document.getElementById("collectionFilter");

const stockFilter = document.getElementById("stockFilter");

const productModal = document.getElementById("productModal");

const productForm = document.getElementById("productForm");

const modalTitle = document.getElementById("modalTitle");

const closeProductModal = document.getElementById("closeProductModal");

const cancelProduct = document.getElementById("cancelProduct");

const openAddProduct = document.getElementById("openAddProduct");

/* =========================================
   LABEL HELPERS
========================================= */

function categoryLabel(category) {
  const labels = {
    tshirt: "T-Shirt",

    scarf: "Scarf",

    mug: "Mug",
  };

  return labels[category] || category || "—";
}

function collectionLabel(collection) {
  const labels = {
    ganesh: "Ganesh",

    diwali: "Diwali",

    holi: "Holi",

    kabaddi: "Kabaddi",

    cricket: "Cricket",

    football: "Football",

    college: "College",
  };

  return labels[collection] || "None";
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
   IMAGE FALLBACK
========================================= */

function productImage(product) {
  if (product.image) {
    return product.image.startsWith("../")
      ? product.image
      : `../${product.image}`;
  }

  return "https://via.placeholder.com/100x100?text=Product";
}

/* =========================================
   STOCK STATUS
========================================= */

function getStockStatus(stock) {
  stock = Number(stock);

  if (stock <= 0) {
    return {
      label: "Out of Stock",
      className: "stock-out",
    };
  }

  if (stock <= 5) {
    return {
      label: `${stock} Low`,
      className: "stock-low",
    };
  }

  return {
    label: `${stock} In Stock`,
    className: "stock-good",
  };
}

/* =========================================
   UPDATE STATS
========================================= */

function updateStats(productList) {
  const total = productList.length;

  const active = productList.filter(
    (product) => product.status !== "inactive",
  ).length;

  const lowStock = productList.filter(
    (product) => Number(product.stock) > 0 && Number(product.stock) <= 5,
  ).length;

  const outStock = productList.filter(
    (product) => Number(product.stock) <= 0,
  ).length;

  document.getElementById("totalProducts").textContent = total;

  document.getElementById("activeProducts").textContent = active;

  document.getElementById("lowStockProducts").textContent = lowStock;

  document.getElementById("outStockProducts").textContent = outStock;
}

/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {
  const allProducts = getAdminProducts();

  const search = productSearch.value.trim().toLowerCase();

  const category = categoryFilter.value;

  const collection = collectionFilter.value;

  const stock = stockFilter.value;

  const filtered = allProducts.filter((product) => {
    const matchesSearch =
      !search || product.name?.toLowerCase().includes(search);

    const matchesCategory = category === "all" || product.category === category;

    const matchesCollection =
      collection === "all" || product.collection === collection;

    let matchesStock = true;

    if (stock === "in-stock") {
      matchesStock = Number(product.stock) > 5;
    }

    if (stock === "low-stock") {
      matchesStock = Number(product.stock) > 0 && Number(product.stock) <= 5;
    }

    if (stock === "out-stock") {
      matchesStock = Number(product.stock) <= 0;
    }

    return (
      matchesSearch && matchesCategory && matchesCollection && matchesStock
    );
  });

  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    emptyProducts.classList.add("show");
  } else {
    emptyProducts.classList.remove("show");
  }

  filtered.forEach((product) => {
    const stockStatus = getStockStatus(product.stock);

    const row = document.createElement("tr");

    row.innerHTML = `

            <td>

                <div class="product-info">

                    <img
                        src="${escapeHTML(productImage(product))}"
                        class="product-image"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.src='https://via.placeholder.com/100x100?text=Product'"
                    >

                    <div>

                        <div class="product-name">

                            ${escapeHTML(product.name)}

                        </div>

                        <div class="product-type">

                            ${escapeHTML(product.type || "Product")}

                        </div>

                    </div>

                </div>

            </td>


            <td>

                <span class="category-badge">

                    ${escapeHTML(categoryLabel(product.category))}

                </span>

            </td>


            <td>

                <span class="collection-badge">

                    ${escapeHTML(collectionLabel(product.collection))}

                </span>

            </td>


            <td>

                <span class="price-current">

                    ₹${Number(product.price || 0).toLocaleString("en-IN")}

                </span>

                ${
                  product.oldPrice
                    ? `
                            <span class="price-old">
                                ₹${Number(product.oldPrice).toLocaleString("en-IN")}
                            </span>
                          `
                    : ""
                }

            </td>


            <td>

                <span class="stock-badge ${stockStatus.className}">

                    ${stockStatus.label}

                </span>

            </td>


            <td>

                <span class="status-badge ${
                  product.status === "inactive"
                    ? "status-inactive"
                    : "status-active"
                }">

                    ${product.status === "inactive" ? "Inactive" : "Active"}

                </span>

            </td>


            <td>

                <div class="product-actions">

                    <button
                        class="action-btn edit"
                        onclick="editProduct('${product.id}')"
                        title="Edit Product"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        class="action-btn delete"
                        onclick="deleteProduct('${product.id}')"
                        title="Delete Product"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </td>

        `;

    tableBody.appendChild(row);
  });

  updateStats(allProducts);
}

/* =========================================
   OPEN ADD MODAL
========================================= */

function openAddProductModal() {
  productForm.reset();

  document.getElementById("productId").value = "";

  document.getElementById("productStock").value = 20;

  modalTitle.textContent = "Add Product";

  productModal.classList.add("show");
}

/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {
  productModal.classList.remove("show");
}

/* =========================================
   EDIT PRODUCT
========================================= */

function editProduct(id) {
  const productList = getAdminProducts();

  const product = productList.find((item) => String(item.id) === String(id));

  if (!product) {
    alert("Product not found.");

    return;
  }

  modalTitle.textContent = "Edit Product";

  document.getElementById("productId").value = product.id;

  document.getElementById("productName").value = product.name || "";

  document.getElementById("productCategory").value = product.category || "";

  document.getElementById("productType").value = product.type || "printed";

  document.getElementById("productCollection").value = product.collection || "";

  document.getElementById("productBadge").value = product.badge || "";

  document.getElementById("productPrice").value = product.price || "";

  document.getElementById("productOldPrice").value = product.oldPrice || "";

  document.getElementById("productStock").value = product.stock ?? 20;

  document.getElementById("productImage").value = product.image || "";

  document.getElementById("productDescription").value =
    product.description || "";

  document.getElementById("productCustomizable").checked = Boolean(
    product.customizable,
  );

  /* SIZES */

  document.querySelectorAll(".size-option").forEach((checkbox) => {
    checkbox.checked =
      Array.isArray(product.sizes) && product.sizes.includes(checkbox.value);
  });

  /* COLORS */

  document.querySelectorAll(".color-option").forEach((checkbox) => {
    checkbox.checked =
      Array.isArray(product.colors) && product.colors.includes(checkbox.value);
  });

  productModal.classList.add("show");
}

/* =========================================
   DELETE PRODUCT
========================================= */

function deleteProduct(id) {
  const productList = getAdminProducts();

  const product = productList.find((item) => String(item.id) === String(id));

  if (!product) return;

  const confirmed = confirm(`Delete "${product.name}"?`);

  if (!confirmed) return;

  const updatedProducts = productList.filter(
    (item) => String(item.id) !== String(id),
  );

  saveAdminProducts(updatedProducts);

  showToast("Product deleted successfully.");

  renderProducts();
}

/* =========================================
   SAVE PRODUCT
========================================= */

productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const productId = document.getElementById("productId").value;

  const productName = document.getElementById("productName").value.trim();

  const category = document.getElementById("productCategory").value;

  const type = document.getElementById("productType").value;

  const collection = document.getElementById("productCollection").value;

  const badge = document.getElementById("productBadge").value;

  const price = Number(document.getElementById("productPrice").value);

  const oldPrice =
    Number(document.getElementById("productOldPrice").value) || 0;

  const stock = Number(document.getElementById("productStock").value);

  const image = document.getElementById("productImage").value.trim();

  const description = document
    .getElementById("productDescription")
    .value.trim();

  const customizable = document.getElementById("productCustomizable").checked;

  /* SIZES */

  const sizes = Array.from(
    document.querySelectorAll(".size-option:checked"),
  ).map((checkbox) => checkbox.value);

  /* COLORS */

  const colors = Array.from(
    document.querySelectorAll(".color-option:checked"),
  ).map((checkbox) => checkbox.value);

  let productList = getAdminProducts();

  const productData = {
    id: productId || `PW-${Date.now()}`,

    name: productName,

    category,

    type,

    collection,

    price,

    oldPrice,

    badge,

    image,

    stock,

    status: "active",

    rating: 0,

    reviews: 0,

    sizes,

    colors,

    description,

    customizable,
  };

  if (productId) {
    /* UPDATE */

    productList = productList.map((product) => {
      if (String(product.id) === String(productId)) {
        return {
          ...product,
          ...productData,
        };
      }

      return product;
    });

    showToast("Product updated successfully.");
  } else {
    /* ADD */

    productList.push(productData);

    showToast("Product added successfully.");
  }

  saveAdminProducts(productList);

  closeModal();

  renderProducts();
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
   FILTER EVENTS
========================================= */

productSearch.addEventListener("input", renderProducts);

categoryFilter.addEventListener("change", renderProducts);

collectionFilter.addEventListener("change", renderProducts);

stockFilter.addEventListener("change", renderProducts);

/* =========================================
   MODAL EVENTS
========================================= */

openAddProduct.addEventListener("click", openAddProductModal);

closeProductModal.addEventListener("click", closeModal);

cancelProduct.addEventListener("click", closeModal);

/* Click outside modal */

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeModal();
  }
});

/* =========================================
   ESC KEY
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* =========================================
   ADMIN LOGOUT
========================================= */

document.getElementById("adminLogout").addEventListener("click", () => {
  localStorage.removeItem("printwaveAdmin");

  window.location.href = "admin-login.html";
});

/* =========================================
   INITIALIZE
========================================= */

renderProducts();
