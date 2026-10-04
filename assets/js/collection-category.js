/* =====================================================
   PRINTWAVE COLLECTION CATEGORY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const collection =
        params.get("collection") || "ganesh";


    /* =================================================
       COLLECTION CONFIG
    ================================================= */

    const collections = {

        ganesh: {

            title: "Ganesh Chaturthi Collection",

            shortTitle:
                "Ganesh Chaturthi",

            description:
                "Celebrate Bappa with festive PrintWave designs created for Ganesh Chaturthi.",

            eyebrow:
                "FESTIVAL COLLECTION",

            type:
                "festival"

        },


        diwali: {

            title: "Diwali Collection",

            shortTitle:
                "Diwali",

            description:
                "Light up your celebration with vibrant Diwali-inspired PrintWave designs.",

            eyebrow:
                "FESTIVAL COLLECTION",

            type:
                "festival"

        },


        holi: {

            title: "Holi Collection",

            shortTitle:
                "Holi",

            description:
                "Bring the colours of Holi to your wardrobe with colourful PrintWave designs.",

            eyebrow:
                "FESTIVAL COLLECTION",

            type:
                "festival"

        },


        kabaddi: {

            title: "Kabaddi Collection",

            shortTitle:
                "Kabaddi",

            description:
                "Show your team spirit with bold Kabaddi-inspired PrintWave designs.",

            eyebrow:
                "TEAM COLLECTION",

            type:
                "team"

        },


        cricket: {

            title: "Cricket Collection",

            shortTitle:
                "Cricket",

            description:
                "For cricket lovers, fans and teams — wear your passion with PrintWave.",

            eyebrow:
                "TEAM COLLECTION",

            type:
                "team"

        },


        football: {

            title: "Football Collection",

            shortTitle:
                "Football",

            description:
                "Bring football energy to your style with PrintWave team-inspired designs.",

            eyebrow:
                "TEAM COLLECTION",

            type:
                "team"

        },


        college: {

            title: "College Team Collection",

            shortTitle:
                "College Teams",

            description:
                "Represent your college, your squad and your campus with custom team designs.",

            eyebrow:
                "TEAM COLLECTION",

            type:
                "team"

        }

    };


    const config =
        collections[collection];


    /* =================================================
       INVALID COLLECTION
    ================================================= */

    if (!config) {

        window.location.href =
            "collections.html";

        return;

    }


    /* =================================================
       PAGE TEXT
    ================================================= */

    document.title =
        `${config.title} | PrintWave`;


    document.getElementById(
        "collectionTitle"
    ).textContent =
        config.title;


    document.getElementById(
        "collectionDescription"
    ).textContent =
        config.description;


    document.getElementById(
        "collectionEyebrow"
    ).textContent =
        config.eyebrow;


    document.getElementById(
        "breadcrumbCurrent"
    ).textContent =
        config.shortTitle;


    document.getElementById(
        "collectionSubtitle"
    ).textContent =
        config.description;


    /* =================================================
       HERO THEME
    ================================================= */

    document.body.classList.add(
        `collection-${config.type}`
    );


    /* =================================================
       PRODUCTS
    ================================================= */

    let collectionProducts =
        Array.isArray(window.products)
            ? products.filter(
                product =>
                    String(
                        product.collection || ""
                    ).toLowerCase() ===
                    collection.toLowerCase()
            )
            : [];


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


    /* =================================================
       RENDER
    ================================================= */

    function renderProducts() {

        let list =
            [...collectionProducts];


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


    /* =================================================
       PRODUCT CARD
    ================================================= */

    function createProductCard(product) {

        const image =
            product.image || "";


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
                                            src="${escapeHTML(image)}"
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
                                product.category ||
                                "Product"
                            )}

                        </div>


                        <a
                            href="product.html?id=${product.id}"
                            class="category-product-name"
                        >

                            ${escapeHTML(
                                product.name
                            )}

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


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =================================================
       SORT
    ================================================= */

    sortSelect.addEventListener(
        "change",
        renderProducts
    );


    /* =================================================
       FOOTER
    ================================================= */

    const footerYear =
        document.getElementById(
            "footerYear"
        );

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    /* =================================================
       INITIAL RENDER
    ================================================= */

    renderProducts();

});