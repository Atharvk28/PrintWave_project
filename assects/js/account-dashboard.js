/* =========================================================
   PRINTWAVE - ACCOUNT DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const CURRENT_USER_KEY = "printwaveCurrentUser";
    const USERS_KEY = "printwaveUsers";
    const ORDERS_KEY = "printwaveOrders";
    const WISHLIST_KEY = "printwaveWishlist";
    const ADDRESSES_KEY = "printwaveAddresses";


    /* =====================================================
       BASIC HELPERS
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


    function getCurrentUser() {
        return getJSON(CURRENT_USER_KEY, null);
    }


    /* =====================================================
       LOGIN PROTECTION
    ===================================================== */

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "account.html";
        return;
    }


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const welcomeName = document.getElementById("welcomeName");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserEmail = document.getElementById("sidebarUserEmail");
    const profileAvatar = document.getElementById("profileAvatar");

    const totalOrders = document.getElementById("totalOrders");
    const totalWishlist = document.getElementById("totalWishlist");
    const totalDesigns = document.getElementById("totalDesigns");

    const recentOrders = document.getElementById("recentOrders");
    const allOrders = document.getElementById("allOrders");
    const wishlistGrid = document.getElementById("wishlistGrid");
    const addressGrid = document.getElementById("addressGrid");

    const profileForm = document.getElementById("profileForm");
    const logoutBtn = document.getElementById("logoutBtn");

    const addAddressBtn = document.getElementById("addAddressBtn");

    const footerYear = document.getElementById("footerYear");


    /* =====================================================
       LOAD DATA
    ===================================================== */

    let orders = getJSON(ORDERS_KEY, []);
    let wishlist = getJSON(WISHLIST_KEY, []);
    let addresses = getJSON(ADDRESSES_KEY, []);


    /* =====================================================
       USER NAME
    ===================================================== */

    function getUserFirstName() {

        if (currentUser.firstName) {
            return currentUser.firstName;
        }

        if (currentUser.name) {
            return currentUser.name.split(" ")[0];
        }

        return "Customer";
    }


    function getUserFullName() {

        if (currentUser.firstName || currentUser.lastName) {
            return `${currentUser.firstName || ""} ${currentUser.lastName || ""}`
                .trim();
        }

        return currentUser.name || "Customer";
    }


    /* =====================================================
       DISPLAY USER INFORMATION
    ===================================================== */

    function loadUserInformation() {

        const firstName = getUserFirstName();
        const fullName = getUserFullName();

        if (welcomeName) {
            welcomeName.textContent = fullName;
        }

        if (sidebarUserName) {
            sidebarUserName.textContent = fullName;
        }

        if (sidebarUserEmail) {
            sidebarUserEmail.textContent =
                currentUser.email || "No email available";
        }

        if (profileAvatar) {
            profileAvatar.textContent =
                firstName.charAt(0).toUpperCase() || "P";
        }

    }


    /* =====================================================
       PROFILE FORM
    ===================================================== */

    function loadProfileForm() {

        const firstNameInput =
            document.getElementById("profileFirstName");

        const lastNameInput =
            document.getElementById("profileLastName");

        const emailInput =
            document.getElementById("profileEmail");

        const phoneInput =
            document.getElementById("profilePhone");

        const bioInput =
            document.getElementById("profileBio");


        if (firstNameInput) {
            firstNameInput.value =
                currentUser.firstName || "";
        }

        if (lastNameInput) {
            lastNameInput.value =
                currentUser.lastName || "";
        }

        if (emailInput) {
            emailInput.value =
                currentUser.email || "";

            /*
             * Email is used as the user's login identifier.
             * Keep it read-only in this frontend prototype.
             */
            emailInput.readOnly = true;
        }

        if (phoneInput) {
            phoneInput.value =
                currentUser.phone || "";
        }

        if (bioInput) {
            bioInput.value =
                currentUser.bio || "";
        }

    }


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    if (profileForm) {

        profileForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const firstName =
                document.getElementById("profileFirstName").value.trim();

            const lastName =
                document.getElementById("profileLastName").value.trim();

            const phone =
                document.getElementById("profilePhone").value.trim();

            const bio =
                document.getElementById("profileBio").value.trim();


            if (!firstName) {
                showDashboardMessage(
                    "Please enter your first name.",
                    "error"
                );
                return;
            }


            /* Update current user */

            currentUser.firstName = firstName;
            currentUser.lastName = lastName;
            currentUser.phone = phone;
            currentUser.bio = bio;

            /* Update current session */

            saveJSON(
                CURRENT_USER_KEY,
                currentUser
            );


            /* Update user inside users array */

            const users = getJSON(USERS_KEY, []);

            const userIndex = users.findIndex(
                user =>
                    user.email &&
                    currentUser.email &&
                    user.email.toLowerCase() ===
                    currentUser.email.toLowerCase()
            );


            if (userIndex !== -1) {

                users[userIndex] = {
                    ...users[userIndex],
                    firstName,
                    lastName,
                    phone,
                    bio
                };

                saveJSON(
                    USERS_KEY,
                    users
                );

            }


            loadUserInformation();

            showDashboardMessage(
                "Profile updated successfully!",
                "success"
            );

        });

    }


    /* =====================================================
       DASHBOARD MESSAGE
    ===================================================== */

    function showDashboardMessage(message, type = "success") {

        const oldMessage =
            document.querySelector(".dashboard-alert");

        if (oldMessage) {
            oldMessage.remove();
        }


        const alert = document.createElement("div");

        alert.className =
            `dashboard-alert alert alert-${type === "error" ? "danger" : "success"} alert-dismissible fade show`;

        alert.setAttribute("role", "alert");

        alert.innerHTML = `
            ${escapeHTML(message)}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
            ></button>
        `;


        const content =
            document.querySelector(".dashboard-content");

        if (content) {
            content.prepend(alert);
        }


        setTimeout(() => {

            if (alert && alert.parentNode) {
                alert.remove();
            }

        }, 4000);

    }


    /* =====================================================
       DASHBOARD NAVIGATION
    ===================================================== */

    const menuButtons =
        document.querySelectorAll(
            ".dashboard-menu button[data-panel]"
        );

    const panels =
        document.querySelectorAll(
            ".dashboard-panel"
        );


    function openPanel(panelId) {

        panels.forEach(panel => {
            panel.classList.remove("active");
        });


        menuButtons.forEach(button => {
            button.classList.remove("active");
        });


        const selectedPanel =
            document.getElementById(panelId);

        if (selectedPanel) {
            selectedPanel.classList.add("active");
        }


        const selectedButton =
            document.querySelector(
                `.dashboard-menu button[data-panel="${panelId}"]`
            );

        if (selectedButton) {
            selectedButton.classList.add("active");
        }


        /*
         * Scroll to dashboard content on mobile.
         */
        if (window.innerWidth < 768) {

            const dashboard =
                document.querySelector(".dashboard-content");

            if (dashboard) {

                dashboard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    }


    menuButtons.forEach(button => {

        button.addEventListener("click", () => {

            const panelId =
                button.dataset.panel;

            if (panelId) {
                openPanel(panelId);
            }

        });

    });


    /* "View All" recent orders link */

    document.querySelectorAll(
        "[data-open-panel]"
    ).forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const panelId =
                link.dataset.openPanel;

            openPanel(panelId);

        });

    });


    /* =====================================================
       ORDERS
    ===================================================== */

    function getUserOrders() {

        if (!Array.isArray(orders)) {
            return [];
        }


        /*
         * Orders created by our checkout currently contain
         * customer information. Match by email whenever possible.
         */

        const userEmail =
            currentUser.email
                ? currentUser.email.toLowerCase()
                : "";


        const filtered = orders.filter(order => {

            if (!order) {
                return false;
            }


            if (
                order.email &&
                userEmail
            ) {

                return (
                    order.email.toLowerCase() === userEmail
                );

            }


            if (
                order.customer &&
                order.customer.email &&
                userEmail
            ) {

                return (
                    order.customer.email.toLowerCase() === userEmail
                );

            }


            /*
             * If the prototype order doesn't contain an email,
             * don't display it as belonging to another account.
             */

            return false;

        });


        return filtered;

    }


    function formatCurrency(amount) {

        const value =
            Number(amount) || 0;

        return `₹${value.toLocaleString("en-IN")}`;

    }


    function formatOrderDate(dateValue) {

        if (!dateValue) {
            return "Date unavailable";
        }


        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    function getOrderId(order) {

        return (
            order.orderId ||
            order.id ||
            "PW-ORDER"
        );

    }


    function getOrderTotal(order) {

        return (
            order.total ??
            order.grandTotal ??
            order.amount ??
            0
        );

    }


    function getOrderStatus(order) {

        return (
            order.status ||
            "Processing"
        );

    }


    function renderOrder(order) {

        const orderId =
            getOrderId(order);

        const orderDate =
            formatOrderDate(
                order.date ||
                order.createdAt ||
                order.orderDate
            );

        const total =
            formatCurrency(
                getOrderTotal(order)
            );

        const status =
            getOrderStatus(order);


        return `
            <div class="order-item">

                <div class="order-info">

                    <h6>
                        ${escapeHTML(orderId)}
                    </h6>

                    <p>
                        ${escapeHTML(orderDate)}
                    </p>

                </div>

                <div>
                    <span class="order-status">
                        ${escapeHTML(status)}
                    </span>
                </div>

                <div class="order-total">
                    ${total}
                </div>

            </div>
        `;

    }


    function renderOrders() {

        const userOrders =
            getUserOrders();


        if (totalOrders) {
            totalOrders.textContent =
                userOrders.length;
        }


        /* Recent orders */

        if (recentOrders) {

            if (userOrders.length === 0) {

                recentOrders.innerHTML = `
                    <div class="dashboard-empty">

                        <div class="dashboard-empty-icon">
                            <i class="bi bi-box-seam"></i>
                        </div>

                        <h5>
                            No orders yet
                        </h5>

                        <p>
                            Your orders will appear here.
                        </p>

                        <a
                            href="shop.html"
                            class="pw-primary-btn text-decoration-none d-inline-block"
                        >
                            Start Shopping
                        </a>

                    </div>
                `;

            } else {

                const recent =
                    userOrders.slice(0, 3);

                recentOrders.innerHTML =
                    recent.map(renderOrder).join("");

            }

        }


        /* All orders */

        if (allOrders) {

            if (userOrders.length === 0) {

                allOrders.innerHTML = `
                    <div class="dashboard-empty">

                        <div class="dashboard-empty-icon">
                            <i class="bi bi-box-seam"></i>
                        </div>

                        <h5>
                            No orders found
                        </h5>

                        <p>
                            Once you place an order, it will appear here.
                        </p>

                        <a
                            href="shop.html"
                            class="pw-primary-btn text-decoration-none d-inline-block"
                        >
                            Browse Products
                        </a>

                    </div>
                `;

            } else {

                allOrders.innerHTML =
                    userOrders.map(renderOrder).join("");

            }

        }

    }


    /* =====================================================
       WISHLIST
    ===================================================== */

    function getWishlistItems() {

        if (!Array.isArray(wishlist)) {
            return [];
        }

        return wishlist;

    }


    function getWishlistId(item) {

        if (typeof item === "string") {
            return item;
        }

        return (
            item.id ||
            item.productId ||
            ""
        );

    }


    function getProductById(id) {

        /*
         * products.js is loaded before this file.
         */

        if (
            typeof products === "undefined" ||
            !Array.isArray(products)
        ) {
            return null;
        }


        return products.find(
            product =>
                String(product.id) === String(id)
        ) || null;

    }


    function renderWishlistItem(item) {

        const id =
            getWishlistId(item);

        const product =
            typeof item === "object" && item.name
                ? item
                : getProductById(id);


        if (!product) {
            return "";
        }


        const name =
            product.name ||
            "PrintWave Product";

        const price =
            product.price || 0;

        const image =
            product.image ||
            "../assets/images/products/placeholder.jpg";


        return `
            <div
                class="wishlist-item"
                data-wishlist-id="${escapeHTML(String(id))}"
            >

                <div class="wishlist-item-image">

                    <img
                        src="${escapeAttribute(image)}"
                        alt="${escapeAttribute(name)}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="wishlist-item-body">

                    <h6>
                        ${escapeHTML(name)}
                    </h6>

                    <div class="wishlist-price mb-3">
                        ${formatCurrency(price)}
                    </div>

                    <div class="d-flex gap-2">

                        <a
                            href="product.html?id=${encodeURIComponent(id)}"
                            class="pw-primary-btn text-decoration-none"
                        >
                            View
                        </a>

                        <button
                            type="button"
                            class="pw-secondary-btn remove-wishlist-btn"
                            data-id="${escapeAttribute(String(id))}"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;

    }


    function renderWishlist() {

        const items =
            getWishlistItems();


        if (totalWishlist) {
            totalWishlist.textContent =
                items.length;
        }


        if (!wishlistGrid) {
            return;
        }


        if (items.length === 0) {

            wishlistGrid.innerHTML = `
                <div class="dashboard-empty">

                    <div class="dashboard-empty-icon">
                        <i class="bi bi-heart"></i>
                    </div>

                    <h5>
                        Your wishlist is empty
                    </h5>

                    <p>
                        Save products you love and find them here later.
                    </p>

                    <a
                        href="shop.html"
                        class="pw-primary-btn text-decoration-none d-inline-block"
                    >
                        Explore Products
                    </a>

                </div>
            `;

            return;

        }


        wishlistGrid.innerHTML =
            items
                .map(renderWishlistItem)
                .filter(Boolean)
                .join("");


        /*
         * Remove wishlist item
         */

        wishlistGrid
            .querySelectorAll(".remove-wishlist-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        button.dataset.id;

                    wishlist =
                        wishlist.filter(item => {

                            return String(
                                getWishlistId(item)
                            ) !== String(id);

                        });


                    saveJSON(
                        WISHLIST_KEY,
                        wishlist
                    );


                    renderWishlist();

                    showDashboardMessage(
                        "Item removed from your wishlist.",
                        "success"
                    );

                });

            });

    }


    /* =====================================================
       SAVED ADDRESSES
    ===================================================== */

    function renderAddresses() {

        if (!addressGrid) {
            return;
        }


        if (!Array.isArray(addresses)) {
            addresses = [];
        }


        if (addresses.length === 0) {

            addressGrid.innerHTML = `
                <div class="dashboard-empty">

                    <div class="dashboard-empty-icon">
                        <i class="bi bi-geo-alt"></i>
                    </div>

                    <h5>
                        No saved addresses
                    </h5>

                    <p>
                        Add an address for faster checkout.
                    </p>

                </div>
            `;

            return;

        }


        addressGrid.innerHTML =
            addresses
                .map((address, index) => {

                    return `
                        <div class="address-card">

                            <h6>
                                ${escapeHTML(
                                    address.label ||
                                    `Address ${index + 1}`
                                )}
                            </h6>

                            <p>
                                ${escapeHTML(address.name || "")}
                                <br>

                                ${escapeHTML(address.house || "")}
                                <br>

                                ${escapeHTML(address.landmark || "")}

                                ${
                                    address.city
                                        ? `<br>${escapeHTML(address.city)}`
                                        : ""
                                }

                                ${
                                    address.state
                                        ? `, ${escapeHTML(address.state)}`
                                        : ""
                                }

                                ${
                                    address.pincode
                                        ? ` - ${escapeHTML(address.pincode)}`
                                        : ""
                                }

                                ${
                                    address.phone
                                        ? `<br>Phone: ${escapeHTML(address.phone)}`
                                        : ""
                                }
                            </p>

                            <button
                                type="button"
                                class="pw-secondary-btn mt-3 remove-address-btn"
                                data-index="${index}"
                            >
                                <i class="bi bi-trash me-1"></i>
                                Remove
                            </button>

                        </div>
                    `;

                })
                .join("");


        addressGrid
            .querySelectorAll(".remove-address-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    addresses.splice(index, 1);

                    saveJSON(
                        ADDRESSES_KEY,
                        addresses
                    );

                    renderAddresses();

                    showDashboardMessage(
                        "Address removed successfully.",
                        "success"
                    );

                });

            });

    }


    /* =====================================================
       ADD ADDRESS
    ===================================================== */

    if (addAddressBtn) {

        addAddressBtn.addEventListener("click", () => {

            const name =
                prompt(
                    "Enter recipient name:"
                );

            if (!name) {
                return;
            }


            const house =
                prompt(
                    "Enter house / flat / building:"
                );

            if (!house) {
                return;
            }


            const landmark =
                prompt(
                    "Enter landmark (optional):"
                ) || "";


            const city =
                prompt(
                    "Enter city:"
                );

            if (!city) {
                return;
            }


            const state =
                prompt(
                    "Enter state:"
                );

            if (!state) {
                return;
            }


            const pincode =
                prompt(
                    "Enter 6-digit pincode:"
                );

            if (
                !pincode ||
                !/^\d{6}$/.test(pincode)
            ) {

                showDashboardMessage(
                    "Please enter a valid 6-digit pincode.",
                    "error"
                );

                return;

            }


            const phone =
                prompt(
                    "Enter phone number:"
                ) || currentUser.phone || "";


            const label =
                prompt(
                    "Address label (Home / Office):",
                    "Home"
                ) || "Home";


            const newAddress = {

                id:
                    `ADDR-${Date.now()}`,

                label,
                name,
                house,
                landmark,
                city,
                state,
                pincode,
                phone

            };


            addresses.push(newAddress);


            saveJSON(
                ADDRESSES_KEY,
                addresses
            );


            renderAddresses();


            showDashboardMessage(
                "Address saved successfully!",
                "success"
            );

        });

    }


    /* =====================================================
       CUSTOM DESIGNS
    ===================================================== */

    function calculateDesignCount() {

        /*
         * Custom designs will eventually have their own
         * localStorage collection.
         *
         * For now we also check custom products inside orders.
         */

        let designCount =
            getJSON(
                "printwaveDesigns",
                []
            );


        if (!Array.isArray(designCount)) {
            designCount = [];
        }


        const userOrders =
            getUserOrders();


        let orderDesignCount = 0;


        userOrders.forEach(order => {

            if (!Array.isArray(order.items)) {
                return;
            }


            order.items.forEach(item => {

                if (
                    item.custom ||
                    item.customizable ||
                    item.designElements
                ) {
                    orderDesignCount++;
                }

            });

        });


        return designCount.length +
            orderDesignCount;

    }


    function renderDesignCount() {

        const count =
            calculateDesignCount();


        if (totalDesigns) {
            totalDesigns.textContent =
                count;
        }

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                CURRENT_USER_KEY
            );


            window.location.href =
                "account.html";

        });

    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cartCount =
            document.getElementById("cartCount");

        if (!cartCount) {
            return;
        }


        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem(
                        "printwaveCart"
                    )
                ) || [];

        } catch (error) {

            cart = [];

        }


        const count =
            cart.reduce(
                (total, item) =>
                    total +
                    (Number(item.quantity) || 1),
                0
            );


        cartCount.textContent =
            count;

    }


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {
        return escapeHTML(value);
    }


    /* =====================================================
       INITIALIZE DASHBOARD
    ===================================================== */

    loadUserInformation();

    loadProfileForm();

    renderOrders();

    renderWishlist();

    renderAddresses();

    renderDesignCount();

    updateCartCount();


    console.log(
        "PrintWave Account Dashboard loaded successfully."
    );

});