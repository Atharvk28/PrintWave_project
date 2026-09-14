/* =========================================================
   PRINTWAVE - GLOBAL JAVASCRIPT
   Shared functionality across all pages
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CART
    ===================================================== */

    updateGlobalCartCount();


    /* =====================================================
       SEARCH
    ===================================================== */

    setupGlobalSearch();

});


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateGlobalCartCount() {

    const cartCountElement =
        document.getElementById("cartCount");

    if (!cartCountElement) {
        return;
    }


    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("printwaveCart")
            ) || [];

    } catch (error) {

        console.error(
            "Unable to read PrintWave cart:",
            error
        );

        cart = [];

    }


    const totalItems =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 1);

            },
            0
        );


    cartCountElement.textContent =
        totalItems;

}


/* =========================================================
   SEARCH
========================================================= */

function setupGlobalSearch() {

    const searchButton =
        document.getElementById("searchButton");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const closeSearch =
        document.getElementById("closeSearch");

    const globalSearch =
        document.getElementById("globalSearch");

    const performSearch =
        document.getElementById("performSearch");


    if (
        !searchButton ||
        !searchOverlay
    ) {
        return;
    }


    /* ---------------------------------------------
       OPEN SEARCH
    --------------------------------------------- */

    searchButton.addEventListener(
        "click",
        () => {

            searchOverlay.classList.add(
                "active"
            );


            setTimeout(
                () => {

                    if (globalSearch) {
                        globalSearch.focus();
                    }

                },
                100
            );

        }
    );


    /* ---------------------------------------------
       CLOSE SEARCH
    --------------------------------------------- */

    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            closeSearchOverlay
        );

    }


    /* ---------------------------------------------
       CLICK OUTSIDE
    --------------------------------------------- */

    searchOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                searchOverlay
            ) {

                closeSearchOverlay();

            }

        }
    );


    /* ---------------------------------------------
       ESC KEY
    --------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                searchOverlay.classList.contains(
                    "active"
                )
            ) {

                closeSearchOverlay();

            }

        }
    );


    /* ---------------------------------------------
       SEARCH BUTTON
    --------------------------------------------- */

    if (performSearch) {

        performSearch.addEventListener(
            "click",
            performGlobalSearch
        );

    }


    /* ---------------------------------------------
       ENTER KEY
    --------------------------------------------- */

    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    performGlobalSearch();

                }

            }
        );

    }


    /* ---------------------------------------------
       FUNCTIONS
    --------------------------------------------- */

    function closeSearchOverlay() {

        searchOverlay.classList.remove(
            "active"
        );

    }


    function performGlobalSearch() {

        if (!globalSearch) {
            return;
        }


        const query =
            globalSearch.value.trim();


        if (!query) {
            return;
        }


        /*
         * Send the search term to Shop.
         *
         * Example:
         *
         * shop.html?search=cricket
         */

        window.location.href =
            `shop.html?search=${encodeURIComponent(query)}`;

    }

}


/* =========================================================
   GLOBAL CART HELPERS
========================================================= */

/*
 * Other PrintWave scripts can use these functions.
 */


/* GET CART */

function getPrintWaveCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "printwaveCart"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Unable to load PrintWave cart:",
            error
        );

        return [];

    }

}


/* SAVE CART */

function savePrintWaveCart(cart) {

    localStorage.setItem(
        "printwaveCart",
        JSON.stringify(cart)
    );


    updateGlobalCartCount();

}


/* CLEAR CART */

function clearPrintWaveCart() {

    localStorage.removeItem(
        "printwaveCart"
    );


    updateGlobalCartCount();

}


/* =========================================================
   GLOBAL WISHLIST HELPERS
========================================================= */

function getPrintWaveWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "printwaveWishlist"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Unable to load wishlist:",
            error
        );

        return [];

    }

}


function savePrintWaveWishlist(wishlist) {

    localStorage.setItem(
        "printwaveWishlist",
        JSON.stringify(wishlist)
    );

}