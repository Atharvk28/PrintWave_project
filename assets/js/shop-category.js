/* =====================================================
   PRINTWAVE SHOP CATEGORY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(window.location.search);

    const category =
        params.get("category") || "all";


    const categoryConfig = {

        "all": {
            title: "All Products",
            description:
                "Explore everything from custom T-shirts and scarves to personalized mugs.",
            filter: () => true
        },

        "printed-tshirts": {
            title: "Printed T-Shirts",
            description:
                "Express yourself with bold, comfortable and customizable printed T-shirts.",
            filter: product =>
                product.category === "T-Shirts" &&
                (
                    product.type === "Printed" ||
                    product.type === "Custom Printed" ||
                    product.name.toLowerCase().includes("printed")
                )
        },

        "embroidered-tshirts": {
            title: "Embroidered T-Shirts",
            description:
                "Clean, premium embroidered T-shirts made for everyday style.",
            filter: product =>
                product.category === "T-Shirts" &&
                (
                    product.type === "Embroidered" ||
                    product.name.toLowerCase().includes("embroidered")
                )
        },

        "printed-scarves": {
            title: "Printed Scarves",
            description:
                "Add personality to your look with custom printed scarves.",
            filter: product =>
                product.category === "Scarves" &&
                (
                    product.type === "Printed" ||
                    product.name.toLowerCase().includes("printed")
                )
        },

        "embroidered-scarves": {
            title: "Embroidered Scarves",
            description:
                "Premium scarves featuring detailed embroidered designs.",
            filter: product =>
                product.category === "Scarves" &&
                (
                    product.type === "Embroidered" ||
                    product.name.toLowerCase().includes("embroidered")
                )
        },

        "mugs": {
            title: "Custom Mugs",
            description:
                "Personalized mugs made for gifts, memories and everyday coffee breaks.",
            filter: product =>
                product.category === "Mugs" ||
                product.category === "Mug" ||
                product.name.toLowerCase().includes("mug")
        }

    };


    const config =
        categoryConfig[category] ||
        categoryConfig.all;


    document.title =
        `${config.title} | PrintWave`;


    document.getElementById(
        "categoryTitle"
    ).textContent =
        config.title;


    document.getElementById(
        "categoryDescription"
    ).textContent =
        config.description;


    document.getElementById(
        "breadcrumbCurrent"
    ).textContent =
        config.title;


    document.getElementById(
        "categorySubtitle"
    ).textContent =
        config.description;


    const productGrid =
        document.getElementById(
            "productGrid"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    const productCount =
        document.getElementById(
            "productCount"
        );

    const sortSelect =
        document.getElementById(
            "sortProducts"
        );


    let filteredProducts =
        Array.isArray(window.products)
            ? products.filter(config.filter)
            : [];


    function renderProducts() {

        let list =
            [...filteredProducts];


        const sort =
            sortSelect.value;


        if (sort === "price-low") {

            list.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

        }


        if (sort === "price-high") {

            list.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

        }


        if (sort === "name") {

            list.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

        }


        productCount.textContent =
            `${list.length} ${
                list.length === 1
                    ? "Product"
                    : "Products"
            }`;


        productGrid.innerHTML = "";


        if (!list.length) {

            emptyState.style.display =
                "block";

            return;

        }


        emptyState.style.display =
            "none";


        list.forEach(product => {

            productGrid.innerHTML +=
                createProductCard(product);

        });

    }


    function createProductCard(product) {

        const image =
            product.image || "";


        const imageHTML =
            image
                ? `
                    <img
                        src="${image}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >
                  `
                : `
                    <div class="category-product-image placeholder">

                        <i class="bi bi-image category-placeholder-icon"></i>

                    </div>
                  `;


        let stars = "";

        const rating =
            Number(product.rating || 0);


        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            stars +=
                i <= Math.round(rating)
                    ? "★"
                    : "☆";

        }


        return `

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="category-product-card">

                    <a
                        href="product.html?id=${product.id}"
                        class="text-decoration-none"
                    >

                        <div class="category-product-image">

                            ${
                                image
                                    ? `
                                        <img
                                            src="${image}"
                                            alt="${escapeHTML(product.name)}"
                                            loading="lazy"
                                        >
                                      `
                                    : `
                                        <div class="category-product-image placeholder">

                                            <i class="bi bi-image category-placeholder-icon"></i>

                                        </div>
                                      `
                            }


                            ${
                                product.badge
                                    ? `
                                        <span class="category-product-badge">
                                            ${escapeHTML(product.badge)}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    </a>


                    <div class="category-product-info">

                        <div class="category-product-type">
                            ${escapeHTML(
                                product.category || "Product"
                            )}
                        </div>


                        <a
                            href="product.html?id=${product.id}"
                            class="category-product-name"
                        >
                            ${escapeHTML(product.name)}
                        </a>


                        <div class="category-rating">

                            ${stars}

                            <span>
                                (${product.reviews || 0})
                            </span>

                        </div>


                        <div class="category-product-price">

                            <span class="category-current-price">
                                ₹${Number(
                                    product.price || 0
                                ).toLocaleString("en-IN")}
                            </span>

                            ${
                                product.oldPrice
                                    ? `
                                        <span class="category-old-price">
                                            ₹${Number(
                                                product.oldPrice
                                            ).toLocaleString("en-IN")}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    </div>

                </article>

            </div>

        `;

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    sortSelect.addEventListener(
        "change",
        renderProducts
    );


    renderProducts();


    /* Footer */

    const footerYear =
        document.getElementById(
            "footerYear"
        );

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }

});