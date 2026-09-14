let filteredProducts = [...products];

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(list) {

    if (!productGrid) return;

    productCount.textContent = list.length;

    if (list.length === 0) {

        productGrid.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">

                    <i class="bi bi-search fs-1 text-muted"></i>

                    <h4 class="mt-3">
                        No products found
                    </h4>

                    <p class="text-muted">
                        Try changing your filters or search.
                    </p>

                    <button
                        class="btn btn-dark"
                        onclick="clearFilters()">

                        Clear Filters

                    </button>

                </div>
            </div>
        `;

        return;
    }


    productGrid.innerHTML = list.map(product => {

        const stars = generateStars(product.rating);

        const oldPrice = product.oldPrice
            ? `<span class="old-price">₹${product.oldPrice}</span>`
            : "";

        const badge = product.badge
            ? `
                <span class="product-badge ${product.badge === "SALE" ? "sale" : ""}">
                    ${product.badge}
                </span>
              `
            : "";


        return `

            <div class="col-xl-4 col-md-6">

                <div class="product-card">

                    <div class="product-image">

                        ${badge}

                        <button
                            class="wishlist"
                            onclick="toggleWishlist(${product.id})">

                            <i class="bi bi-heart"></i>

                        </button>


                        <a href="product.html?id=${product.id}">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                loading="lazy">

                        </a>


                        <button
                            class="quick-view"
                            onclick="openProduct(${product.id})">

                            <i class="bi bi-eye me-2"></i>
                            Quick View

                        </button>

                    </div>


                    <div class="product-details">

                        <div class="product-category">

                            ${formatCategory(product.category)}

                        </div>


                        <h5 class="product-name">

                            <a
                                href="product.html?id=${product.id}"
                                class="text-dark">

                                ${product.name}

                            </a>

                        </h5>


                        <div class="rating">

                            ${stars}

                            <span>
                                (${product.reviews})
                            </span>

                        </div>


                        <div class="price-row">

                            <div class="product-price">

                                ₹${product.price}

                                ${oldPrice}

                            </div>


                            <button
                                class="add-cart"
                                onclick="addToCart(${product.id})">

                                <i class="bi bi-cart-plus"></i>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }).join("");

}


// =====================================================
// STAR RATING
// =====================================================

function generateStars(rating) {

    let html = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= rating) {

            html += `
                <i class="bi bi-star-fill"></i>
            `;

        } else {

            html += `
                <i class="bi bi-star"></i>
            `;

        }

    }

    return html;

}


// =====================================================
// CATEGORY FORMAT
// =====================================================

function formatCategory(category) {

    const names = {

        tshirts: "T-Shirt",

        scarves: "Scarf",

        mugs: "Custom Mug"

    };

    return names[category] || category;

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters() {

    filteredProducts = [...products];


    // CATEGORY

    const categories = [
        ...document.querySelectorAll(
            ".category-filter:checked"
        )
    ].map(input => input.value);


    if (categories.length > 0) {

        filteredProducts = filteredProducts.filter(product =>
            categories.includes(product.category)
        );

    }


    // PRINT TYPE

    const types = [
        ...document.querySelectorAll(
            ".type-filter:checked"
        )
    ].map(input => input.value);


    if (types.length > 0) {

        filteredProducts = filteredProducts.filter(product =>
            types.includes(product.type)
        );

    }


    // COLLECTION

    const collections = [
        ...document.querySelectorAll(
            ".collection-filter:checked"
        )
    ].map(input => input.value);


    if (collections.length > 0) {

        filteredProducts = filteredProducts.filter(product =>
            collections.includes(product.collection)
        );

    }


    // SIZE

    const sizes = [
        ...document.querySelectorAll(
            ".size-filter:checked"
        )
    ].map(input => input.value);


    if (sizes.length > 0) {

        filteredProducts = filteredProducts.filter(product =>
            product.sizes.some(size =>
                sizes.includes(size)
            )
        );

    }


    // PRICE

    const minPrice =
        Number(document.getElementById("minPrice")?.value) || 0;

    const maxPrice =
        Number(document.getElementById("maxPrice")?.value) || Infinity;


    filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice &&
        product.price <= maxPrice
    );


    // SEARCH

    const search =
        document.getElementById("shopSearch")?.value
            .toLowerCase()
            .trim();


    if (search) {

        filteredProducts = filteredProducts.filter(product =>

            product.name.toLowerCase().includes(search) ||

            product.description.toLowerCase().includes(search)

        );

    }


    // SORT

    applySorting();


    renderProducts(filteredProducts);

}


// =====================================================
// SORT
// =====================================================

function applySorting() {

    const sort =
        document.getElementById("sortProducts")?.value;


    if (!sort) return;


    switch (sort) {

        case "price-low":

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

            break;


        case "price-high":

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

            break;


        case "rating":

            filteredProducts.sort(
                (a, b) => b.rating - a.rating
            );

            break;


        case "newest":

            filteredProducts.sort(
                (a, b) => b.id - a.id
            );

            break;


        case "featured":

        default:

            filteredProducts.sort(
                (a, b) => a.id - b.id
            );

    }

}


// =====================================================
// CLEAR FILTERS
// =====================================================

function clearFilters() {

    document.querySelectorAll(
        ".category-filter, .type-filter, .collection-filter, .size-filter"
    ).forEach(input => {

        input.checked = false;

    });


    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const search =
        document.getElementById("shopSearch");


    if (minPrice) minPrice.value = "";

    if (maxPrice) maxPrice.value = "";

    if (search) search.value = "";


    filteredProducts = [...products];

    renderProducts(filteredProducts);

}


// =====================================================
// PRODUCT DETAIL
// =====================================================

function openProduct(id) {

    window.location.href =
        `product.html?id=${id}`;

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(id) {

    const product =
        products.find(product => product.id === id);


    if (!product) return;


    let cart =
        JSON.parse(localStorage.getItem("printwaveCart")) || [];


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1,

            size: product.sizes[0],

            color: product.colors[0]

        });

    }


    localStorage.setItem(
        "printwaveCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showCartMessage();

}


// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("printwaveCart")) || [];


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document.querySelectorAll(
        ".cart-count"
    ).forEach(element => {

        element.textContent = count;

    });

}


// =====================================================
// CART MESSAGE
// =====================================================

function showCartMessage() {

    const toast =
        document.getElementById("cartToast");


    if (!toast) return;


    const bsToast =
        new bootstrap.Toast(toast);


    bsToast.show();

}


// =====================================================
// WISHLIST
// =====================================================

function toggleWishlist(id) {

    let wishlist =
        JSON.parse(
            localStorage.getItem("printwaveWishlist")
        ) || [];


    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item => item !== id);

    } else {

        wishlist.push(id);

    }


    localStorage.setItem(
        "printwaveWishlist",
        JSON.stringify(wishlist)
    );

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts(products);

        updateCartCount();


        document.querySelectorAll(
            ".category-filter, .type-filter, .collection-filter, .size-filter"
        ).forEach(input => {

            input.addEventListener(
                "change",
                applyFilters
            );

        });


        document.getElementById(
            "sortProducts"
        )?.addEventListener(
            "change",
            applyFilters
        );


        document.getElementById(
            "shopSearch"
        )?.addEventListener(
            "input",
            applyFilters
        );


        document.getElementById(
            "minPrice"
        )?.addEventListener(
            "input",
            applyFilters
        );


        document.getElementById(
            "maxPrice"
        )?.addEventListener(
            "input",
            applyFilters
        );

    }
);