/* =========================================
   PRINTWAVE ADMIN CUSTOMERS
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const USERS_KEY = "printwaveUsers";
const ORDERS_KEY = "printwaveOrders";
const CUSTOMER_STATUS_KEY = "printwaveCustomerStatus";


/* =========================================
   ELEMENTS
========================================= */

const customerTableBody =
    document.getElementById("customersTableBody");

const emptyCustomers =
    document.getElementById("emptyCustomers");

const customerSearch =
    document.getElementById("customerSearch");

const customerFilter =
    document.getElementById("customerFilter");

const customerSort =
    document.getElementById("customerSort");

const clearCustomerFilters =
    document.getElementById("clearCustomerFilters");

const customerModal =
    document.getElementById("customerModal");

const closeCustomerModal =
    document.getElementById("closeCustomerModal");

const customerStatus =
    document.getElementById("customerStatus");

const saveCustomerStatus =
    document.getElementById("saveCustomerStatus");


let selectedCustomerEmail = null;


/* =========================================
   GET USERS
========================================= */

function getUsers() {

    const stored =
        localStorage.getItem(USERS_KEY);

    if (!stored) {

        return [];

    }

    try {

        const users =
            JSON.parse(stored);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "Unable to load customers:",
            error
        );

        return [];

    }

}


/* =========================================
   GET ORDERS
========================================= */

function getOrders() {

    const stored =
        localStorage.getItem(ORDERS_KEY);

    if (!stored) {

        return [];

    }

    try {

        const orders =
            JSON.parse(stored);

        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        console.error(
            "Unable to load orders:",
            error
        );

        return [];

    }

}


/* =========================================
   CUSTOMER STATUS
========================================= */

function getCustomerStatuses() {

    const stored =
        localStorage.getItem(
            CUSTOMER_STATUS_KEY
        );

    if (!stored) {

        return {};

    }

    try {

        return JSON.parse(stored) || {};

    } catch {

        return {};

    }

}


/* =========================================
   SAVE CUSTOMER STATUS
========================================= */

function saveCustomerStatuses(statuses) {

    localStorage.setItem(
        CUSTOMER_STATUS_KEY,
        JSON.stringify(statuses)
    );

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
   FORMAT MONEY
========================================= */

function formatMoney(value) {

    return `₹${Number(value || 0)
        .toLocaleString("en-IN")}`;

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(value) {

    if (!value) {

        return "—";

    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

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


/* =========================================
   GET CUSTOMER NAME
========================================= */

function getCustomerName(user) {

    if (user.name) {

        return user.name;

    }


    if (user.fullName) {

        return user.fullName;

    }


    const first =
        user.firstName || "";

    const last =
        user.lastName || "";


    return (
        `${first} ${last}`.trim() ||
        "Customer"
    );

}


/* =========================================
   GET EMAIL
========================================= */

function getUserEmail(user) {

    return (
        user.email ||
        user.emailAddress ||
        ""
    );

}


/* =========================================
   GET PHONE
========================================= */

function getUserPhone(user) {

    return (
        user.phone ||
        user.mobile ||
        user.phoneNumber ||
        "—"
    );

}


/* =========================================
   GET ORDER EMAIL
========================================= */

function getOrderEmail(order) {

    return (
        order.email ||
        order.customerEmail ||
        order.customer?.email ||
        ""
    ).toLowerCase();

}


/* =========================================
   GET ORDER CUSTOMER NAME
========================================= */

function getOrderCustomerName(order) {

    if (order.customerName) {

        return order.customerName;

    }

    const first =
        order.firstName ||
        order.customer?.firstName ||
        "";

    const last =
        order.lastName ||
        order.customer?.lastName ||
        "";

    return (
        `${first} ${last}`.trim() ||
        "Guest Customer"
    );

}


/* =========================================
   ORDER TOTAL
========================================= */

function getOrderTotal(order) {

    if (
        order.total !== undefined
    ) {

        return Number(
            order.total
        ) || 0;

    }


    if (
        order.grandTotal !== undefined
    ) {

        return Number(
            order.grandTotal
        ) || 0;

    }


    return 0;

}


/* =========================================
   GET CUSTOMER DATA
========================================= */

function buildCustomers() {

    const users =
        getUsers();

    const orders =
        getOrders();

    const statuses =
        getCustomerStatuses();


    const customerMap = {};


    /* =====================================
       USERS
    ====================================== */

    users.forEach(user => {

        const email =
            getUserEmail(user)
                .toLowerCase();


        if (!email) {

            return;

        }


        customerMap[email] = {

            ...user,

            email,

            name:
                getCustomerName(user),

            phone:
                getUserPhone(user),

            orders: [],

            orderCount: 0,

            totalSpent: 0,

            lastOrder: null,

            status:
                statuses[email] ||
                user.status ||
                "active"

        };

    });


    /* =====================================
       ORDERS
    ====================================== */

    orders.forEach(order => {

        const email =
            getOrderEmail(order);


        if (!email) {

            return;

        }


        if (!customerMap[email]) {

            customerMap[email] = {

                name:
                    getOrderCustomerName(order),

                email,

                phone:
                    order.phone ||
                    order.mobile ||
                    "—",

                createdAt:
                    order.createdAt ||
                    order.date ||
                    new Date().toISOString(),

                orders: [],

                orderCount: 0,

                totalSpent: 0,

                lastOrder: null,

                status:
                    statuses[email] ||
                    "active"

            };

        }


        customerMap[email]
            .orders
            .push(order);


        customerMap[email]
            .orderCount++;


        customerMap[email]
            .totalSpent +=
                getOrderTotal(order);


        const orderDate =
            new Date(
                order.createdAt ||
                order.date ||
                order.orderDate ||
                0
            );


        const currentLast =
            customerMap[email]
                .lastOrder;


        if (
            !currentLast ||
            orderDate >
            new Date(
                currentLast.createdAt ||
                currentLast.date ||
                0
            )
        ) {

            customerMap[email]
                .lastOrder = order;

        }

    });


    return Object.values(
        customerMap
    );

}


/* =========================================
   CUSTOMER INITIAL
========================================= */

function getInitial(name) {

    const clean =
        String(name || "C")
            .trim();


    if (!clean) {

        return "C";

    }


    const words =
        clean.split(/\s+/);


    if (words.length >= 2) {

        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();

    }


    return clean[0]
        .toUpperCase();

}


/* =========================================
   IS NEW CUSTOMER
========================================= */

function isNewCustomer(customer) {

    const createdAt =
        customer.createdAt ||
        customer.registeredAt ||
        customer.created_at;


    if (!createdAt) {

        return false;

    }


    const created =
        new Date(createdAt);


    if (
        Number.isNaN(
            created.getTime()
        )
    ) {

        return false;

    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        created.getTime();


    const thirtyDays =
        30 *
        24 *
        60 *
        60 *
        1000;


    return (
        difference >= 0 &&
        difference <= thirtyDays
    );

}


/* =========================================
   UPDATE STATS
========================================= */

function updateStats(customers) {

    const total =
        customers.length;


    const active =
        customers.filter(
            customer =>
                customer.status !== "inactive"
        ).length;


    const withOrders =
        customers.filter(
            customer =>
                customer.orderCount > 0
        ).length;


    const newCustomers =
        customers.filter(
            customer =>
                isNewCustomer(customer)
        ).length;


    const revenue =
        customers.reduce(
            (total, customer) =>
                total +
                customer.totalSpent,
            0
        );


    document.getElementById(
        "totalCustomers"
    ).textContent =
        total;


    document.getElementById(
        "activeCustomers"
    ).textContent =
        active;


    document.getElementById(
        "customersWithOrders"
    ).textContent =
        withOrders;


    document.getElementById(
        "newCustomers"
    ).textContent =
        newCustomers;


    document.getElementById(
        "customerRevenue"
    ).textContent =
        formatMoney(revenue);

}


/* =========================================
   SORT CUSTOMERS
========================================= */

function sortCustomers(customers) {

    const sort =
        customerSort.value;


    return customers.sort(
        (a, b) => {

            if (sort === "newest") {

                return (
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
                );

            }


            if (sort === "oldest") {

                return (
                    new Date(
                        a.createdAt || 0
                    ) -
                    new Date(
                        b.createdAt || 0
                    )
                );

            }


            if (sort === "orders-high") {

                return (
                    b.orderCount -
                    a.orderCount
                );

            }


            if (sort === "spending-high") {

                return (
                    b.totalSpent -
                    a.totalSpent
                );

            }


            if (sort === "name") {

                return a.name
                    .localeCompare(
                        b.name
                    );

            }


            return 0;

        }
    );

}


/* =========================================
   RENDER CUSTOMERS
========================================= */

function renderCustomers() {

    let customers =
        buildCustomers();


    const search =
        customerSearch.value
            .trim()
            .toLowerCase();


    const filter =
        customerFilter.value;


    customers =
        customers.filter(
            customer => {

                const name =
                    customer.name
                        .toLowerCase();


                const email =
                    customer.email
                        .toLowerCase();


                const phone =
                    String(
                        customer.phone || ""
                    ).toLowerCase();


                const matchesSearch =

                    !search ||

                    name.includes(search) ||

                    email.includes(search) ||

                    phone.includes(search);


                if (!matchesSearch) {

                    return false;

                }


                if (
                    filter ===
                    "with-orders"
                ) {

                    return (
                        customer.orderCount > 0
                    );

                }


                if (
                    filter ===
                    "without-orders"
                ) {

                    return (
                        customer.orderCount === 0
                    );

                }


                if (
                    filter === "new"
                ) {

                    return isNewCustomer(
                        customer
                    );

                }


                return true;

            }
        );


    customers =
        sortCustomers(
            customers
        );


    customerTableBody.innerHTML = "";


    if (!customers.length) {

        emptyCustomers.classList.add(
            "show"
        );

    } else {

        emptyCustomers.classList.remove(
            "show"
        );

    }


    customers.forEach(
        customer => {

            const row =
                document.createElement("tr");


            const lastOrder =
                customer.lastOrder;


            const lastOrderDate =
                lastOrder
                    ? formatDate(
                        lastOrder.createdAt ||
                        lastOrder.date ||
                        lastOrder.orderDate
                    )
                    : "No orders";


            row.innerHTML = `

                <td>

                    <div class="customer-info">

                        <div class="customer-avatar">

                            ${escapeHTML(
                                getInitial(
                                    customer.name
                                )
                            )}

                        </div>


                        <div>

                            <div class="customer-name">

                                ${escapeHTML(
                                    customer.name
                                )}

                            </div>


                            <div class="customer-email-small">

                                ${escapeHTML(
                                    customer.email
                                )}

                            </div>

                        </div>

                    </div>

                </td>


                <td>

                    <div class="contact-email">

                        ${escapeHTML(
                            customer.email
                        )}

                    </div>


                    <div class="contact-phone">

                        ${escapeHTML(
                            customer.phone
                        )}

                    </div>

                </td>


                <td>

                    ${
                        customer.orderCount > 0

                            ? `

                                <span class="order-count-badge">

                                    ${customer.orderCount}

                                </span>

                              `

                            : `

                                <span class="no-orders">

                                    No orders

                                </span>

                              `
                    }

                </td>


                <td>

                    <span class="spending">

                        ${formatMoney(
                            customer.totalSpent
                        )}

                    </span>

                </td>


                <td>

                    ${lastOrderDate}

                </td>


                <td>

                    ${formatDate(
                        customer.createdAt
                    )}

                </td>


                <td>

                    <span class="customer-status ${
                        customer.status === "inactive"
                            ? "inactive"
                            : "active"
                    }">

                        ${
                            customer.status === "inactive"
                                ? "Inactive"
                                : "Active"
                        }

                    </span>

                </td>


                <td>

                    <button
                        class="view-customer-btn"
                        onclick="viewCustomer('${escapeHTML(
                            customer.email
                        )}')"
                        title="View Customer"
                    >

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            `;


            customerTableBody.appendChild(
                row
            );

        }
    );


    updateStats(
        buildCustomers()
    );

}


/* =========================================
   VIEW CUSTOMER
========================================= */

function viewCustomer(email) {

    const customers =
        buildCustomers();


    const customer =
        customers.find(
            item =>
                item.email.toLowerCase() ===
                String(email).toLowerCase()
        );


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;

    }


    selectedCustomerEmail =
        customer.email;


    /* HEADER */

    document.getElementById(
        "detailAvatar"
    ).textContent =
        getInitial(
            customer.name
        );


    document.getElementById(
        "detailName"
    ).textContent =
        customer.name;


    /* INFORMATION */

    document.getElementById(
        "detailFullName"
    ).textContent =
        customer.name;


    document.getElementById(
        "detailEmail"
    ).textContent =
        customer.email;


    document.getElementById(
        "detailPhone"
    ).textContent =
        customer.phone;


    document.getElementById(
        "detailJoined"
    ).textContent =
        formatDate(
            customer.createdAt
        );


    /* OVERVIEW */

    document.getElementById(
        "detailOrders"
    ).textContent =
        customer.orderCount;


    document.getElementById(
        "detailSpent"
    ).textContent =
        formatMoney(
            customer.totalSpent
        );


    const average =
        customer.orderCount > 0

            ? customer.totalSpent /
              customer.orderCount

            : 0;


    document.getElementById(
        "detailAverage"
    ).textContent =
        formatMoney(
            average
        );


    /* RECENT ORDERS */

    renderCustomerOrders(
        customer.orders
    );


    /* STATUS */

    customerStatus.value =
        customer.status === "inactive"
            ? "inactive"
            : "active";


    customerModal.classList.add(
        "show"
    );

}


/* =========================================
   RENDER CUSTOMER ORDERS
========================================= */

function renderCustomerOrders(
    orders
) {

    const container =
        document.getElementById(
            "customerOrders"
        );


    container.innerHTML = "";


    if (!orders.length) {

        container.innerHTML = `

            <p
                class="text-muted small"
            >

                This customer has not placed any orders yet.

            </p>

        `;

        return;

    }


    const sortedOrders =
        [...orders].sort(
            (a, b) =>
                new Date(
                    b.createdAt ||
                    b.date ||
                    0
                ) -
                new Date(
                    a.createdAt ||
                    a.date ||
                    0
                )
        );


    sortedOrders
        .slice(0, 5)
        .forEach(order => {

            const orderId =
                order.orderId ||
                order.id ||
                "—";


            const status =
                String(
                    order.status ||
                    "pending"
                )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "customer-order";


            div.innerHTML = `

                <div class="customer-order-main">

                    <div class="customer-order-id">

                        #${escapeHTML(
                            orderId
                        )}

                    </div>


                    <div class="customer-order-date">

                        ${formatDate(
                            order.createdAt ||
                            order.date ||
                            order.orderDate
                        )}

                    </div>

                </div>


                <span
                    class="customer-order-status"
                >

                    ${escapeHTML(
                        status
                    )}

                </span>


                <div class="customer-order-total">

                    ${formatMoney(
                        getOrderTotal(order)
                    )}

                </div>

            `;


            container.appendChild(
                div
            );

        });

}


/* =========================================
   SAVE CUSTOMER STATUS
========================================= */

saveCustomerStatus.addEventListener(
    "click",
    function() {

        if (!selectedCustomerEmail) {

            return;

        }


        const statuses =
            getCustomerStatuses();


        statuses[
            selectedCustomerEmail
        ] =
            customerStatus.value;


        saveCustomerStatuses(
            statuses
        );


        showToast(
            "Customer status updated successfully."
        );


        renderCustomers();

        closeCustomerModal();

    }
);


/* =========================================
   CLOSE MODAL
========================================= */

function closeCustomerModal() {

    customerModal.classList.remove(
        "show"
    );

    selectedCustomerEmail =
        null;

}


closeCustomerModal.addEventListener(
    "click",
    closeCustomerModal
);


customerModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            customerModal
        ) {

            closeCustomerModal();

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeCustomerModal();

        }

    }
);


/* =========================================
   SEARCH / FILTER
========================================= */

customerSearch.addEventListener(
    "input",
    renderCustomers
);


customerFilter.addEventListener(
    "change",
    renderCustomers
);


customerSort.addEventListener(
    "change",
    renderCustomers
);


clearCustomerFilters.addEventListener(
    "click",
    function() {

        customerSearch.value = "";

        customerFilter.value =
            "all";

        customerSort.value =
            "newest";

        renderCustomers();

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "adminToast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("adminLogout")
    .addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "printwaveAdmin"
            );

            window.location.href =
                "admin-login.html";

        }
    );


/* =========================================
   INITIALIZE
========================================= */

renderCustomers();