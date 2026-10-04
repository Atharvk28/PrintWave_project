/* =========================================
   PRINTWAVE ADMIN ORDERS
========================================= */


/* =========================================
   STORAGE
========================================= */

const ORDERS_KEY = "printwaveOrders";


/* =========================================
   ELEMENTS
========================================= */

const ordersTableBody =
    document.getElementById("ordersTableBody");

const emptyOrders =
    document.getElementById("emptyOrders");

const orderSearch =
    document.getElementById("orderSearch");

const statusFilter =
    document.getElementById("statusFilter");

const paymentFilter =
    document.getElementById("paymentFilter");

const clearFilters =
    document.getElementById("clearFilters");

const orderModal =
    document.getElementById("orderModal");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const detailStatus =
    document.getElementById("detailStatus");

const saveOrderStatus =
    document.getElementById("saveOrderStatus");


let selectedOrderId = null;


/* =========================================
   LOAD ORDERS
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
   SAVE ORDERS
========================================= */

function saveOrders(orders) {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
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
   NORMALIZE STATUS
========================================= */

function normalizeStatus(status) {

    if (!status) {
        return "pending";
    }

    return String(status)
        .toLowerCase()
        .replace(/\s+/g, "-");

}


/* =========================================
   STATUS LABEL
========================================= */

function statusLabel(status) {

    const labels = {

        pending: "Pending",

        confirmed: "Confirmed",

        processing: "Processing",

        shipped: "Shipped",

        delivered: "Delivered",

        cancelled: "Cancelled"

    };

    return labels[normalizeStatus(status)]
        || "Pending";

}


/* =========================================
   PAYMENT TYPE
========================================= */

function normalizePayment(payment) {

    const value =
        String(payment || "")
            .toLowerCase();

    if (
        value.includes("online") ||
        value.includes("upi") ||
        value.includes("card") ||
        value.includes("razorpay")
    ) {

        return "online";

    }

    return "cod";

}


/* =========================================
   PAYMENT LABEL
========================================= */

function paymentLabel(payment) {

    return normalizePayment(payment) === "online"
        ? "Online"
        : "COD";

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

function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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
   CUSTOMER NAME
========================================= */

function getCustomerName(order) {

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

    const full =
        `${first} ${last}`.trim();

    return full || "Guest Customer";

}


/* =========================================
   CUSTOMER EMAIL
========================================= */

function getCustomerEmail(order) {

    return (
        order.email ||
        order.customerEmail ||
        order.customer?.email ||
        "No email"
    );

}


/* =========================================
   CUSTOMER PHONE
========================================= */

function getCustomerPhone(order) {

    return (
        order.phone ||
        order.mobile ||
        order.customerPhone ||
        order.customer?.phone ||
        "—"
    );

}


/* =========================================
   ORDER ITEMS
========================================= */

function getOrderItems(order) {

    if (Array.isArray(order.items)) {
        return order.items;
    }

    if (Array.isArray(order.products)) {
        return order.products;
    }

    return [];

}


/* =========================================
   ITEM COUNT
========================================= */

function getItemCount(order) {

    const items =
        getOrderItems(order);

    if (!items.length) {
        return 0;
    }

    return items.reduce(
        (total, item) =>
            total +
            Number(
                item.quantity ||
                item.qty ||
                1
            ),
        0
    );

}


/* =========================================
   ORDER TOTAL
========================================= */

function getOrderTotal(order) {

    if (
        order.total !== undefined &&
        order.total !== null
    ) {

        return Number(order.total) || 0;

    }

    if (
        order.grandTotal !== undefined
    ) {

        return Number(order.grandTotal) || 0;

    }

    return 0;

}


/* =========================================
   ORDER SUBTOTAL
========================================= */

function getOrderSubtotal(order) {

    if (order.subtotal !== undefined) {

        return Number(order.subtotal) || 0;

    }

    const items =
        getOrderItems(order);

    return items.reduce(
        (total, item) => {

            const price =
                Number(
                    item.price ||
                    item.unitPrice ||
                    0
                );

            const quantity =
                Number(
                    item.quantity ||
                    item.qty ||
                    1
                );

            return total +
                (price * quantity);

        },
        0
    );

}


/* =========================================
   ORDER DISCOUNT
========================================= */

function getOrderDiscount(order) {

    return Number(
        order.discount ||
        order.discountAmount ||
        0
    );

}


/* =========================================
   IMAGE
========================================= */

function getItemImage(item) {

    const image =
        item.image ||
        item.productImage ||
        "";

    if (!image) {

        return "https://via.placeholder.com/100x100?text=Product";

    }

    if (image.startsWith("../")) {

        return image;

    }

    return `../${image}`;

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStats(orders) {

    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                normalizeStatus(
                    order.status
                ) === "pending"
        ).length;


    const shipped =
        orders.filter(
            order =>
                normalizeStatus(
                    order.status
                ) === "shipped"
        ).length;


    const completed =
        orders.filter(
            order =>
                normalizeStatus(
                    order.status
                ) === "delivered"
        ).length;


    const revenue =
        orders.reduce(
            (total, order) =>
                total +
                getOrderTotal(order),
            0
        );


    document.getElementById(
        "totalOrders"
    ).textContent = total;


    document.getElementById(
        "pendingOrders"
    ).textContent = pending;


    document.getElementById(
        "shippedOrders"
    ).textContent = shipped;


    document.getElementById(
        "completedOrders"
    ).textContent = completed;


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatMoney(revenue);

}


/* =========================================
   RENDER ORDERS
========================================= */

function renderOrders() {

    const orders =
        getOrders();


    const search =
        orderSearch.value
            .trim()
            .toLowerCase();


    const status =
        statusFilter.value;


    const payment =
        paymentFilter.value;


    const filtered =
        orders.filter(order => {

            const orderId =
                String(
                    order.orderId ||
                    order.id ||
                    ""
                ).toLowerCase();


            const customer =
                getCustomerName(order)
                    .toLowerCase();


            const email =
                getCustomerEmail(order)
                    .toLowerCase();


            const matchesSearch =

                !search ||

                orderId.includes(search) ||

                customer.includes(search) ||

                email.includes(search);


            const matchesStatus =

                status === "all" ||

                normalizeStatus(
                    order.status
                ) === status;


            const matchesPayment =

                payment === "all" ||

                normalizePayment(
                    order.paymentMethod ||
                    order.payment
                ) === payment;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment
            );

        });


    ordersTableBody.innerHTML = "";


    if (!filtered.length) {

        emptyOrders.classList.add(
            "show"
        );

    } else {

        emptyOrders.classList.remove(
            "show"
        );

    }


    filtered.forEach(order => {

        const orderId =
            order.orderId ||
            order.id ||
            "—";


        const currentStatus =
            normalizeStatus(
                order.status
            );


        const payment =
            normalizePayment(
                order.paymentMethod ||
                order.payment
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="order-id">

                    #${escapeHTML(orderId)}

                </div>

                <div class="order-date-small">

                    ${formatDate(
                        order.createdAt ||
                        order.date ||
                        order.orderDate
                    )}

                </div>

            </td>


            <td>

                <div class="customer-name">

                    ${escapeHTML(
                        getCustomerName(order)
                    )}

                </div>

                <div class="customer-email">

                    ${escapeHTML(
                        getCustomerEmail(order)
                    )}

                </div>

            </td>


            <td>

                <span class="item-count">

                    ${getItemCount(order)}
                    ${getItemCount(order) === 1
                        ? "Item"
                        : "Items"}

                </span>

            </td>


            <td>

                <strong>

                    ${formatMoney(
                        getOrderTotal(order)
                    )}

                </strong>

            </td>


            <td>

                <span class="payment-badge ${
                    payment === "online"
                        ? "payment-online"
                        : "payment-cod"
                }">

                    <i class="bi ${
                        payment === "online"
                            ? "bi-credit-card"
                            : "bi-cash"
                    }"></i>

                    ${paymentLabel(
                        order.paymentMethod ||
                        order.payment
                    )}

                </span>

            </td>


            <td>

                <span class="status-badge status-${currentStatus}">

                    ${statusLabel(
                        currentStatus
                    )}

                </span>

            </td>


            <td>

                ${formatDate(
                    order.createdAt ||
                    order.date ||
                    order.orderDate
                )}

            </td>


            <td>

                <button
                    class="view-order-btn"
                    onclick="viewOrder('${escapeHTML(
                        String(orderId)
                    )}')"
                    title="View Order"
                >

                    <i class="bi bi-eye"></i>

                </button>

            </td>

        `;


        ordersTableBody.appendChild(row);

    });


    updateStats(orders);

}


/* =========================================
   FIND ORDER
========================================= */

function findOrder(orderId) {

    const orders =
        getOrders();


    return orders.find(
        order =>
            String(
                order.orderId ||
                order.id
            ) === String(orderId)
    );

}


/* =========================================
   VIEW ORDER
========================================= */

function viewOrder(orderId) {

    const order =
        findOrder(orderId);


    if (!order) {

        alert("Order not found.");

        return;

    }


    selectedOrderId =
        orderId;


    document.getElementById(
        "modalOrderId"
    ).textContent =
        `#${orderId}`;


    document.getElementById(
        "detailCustomerName"
    ).textContent =
        getCustomerName(order);


    document.getElementById(
        "detailCustomerEmail"
    ).textContent =
        getCustomerEmail(order);


    document.getElementById(
        "detailCustomerPhone"
    ).textContent =
        getCustomerPhone(order);


    /* ADDRESS */

    const address =
        order.address ||
        order.shippingAddress ||
        {};


    let addressText = "";


    if (typeof address === "string") {

        addressText = address;

    } else {

        addressText = [

            address.house ||
            address.houseNo ||
            address.flat,

            address.building,

            address.landmark,

            address.city,

            address.state,

            address.pincode ||
            address.zip

        ]
        .filter(Boolean)
        .join(", ");

    }


    if (!addressText) {

        addressText =
            [
                order.house,
                order.building,
                order.landmark,
                order.city,
                order.state,
                order.pincode
            ]
            .filter(Boolean)
            .join(", ");

    }


    document.getElementById(
        "detailAddress"
    ).textContent =
        addressText || "No address available";


    /* ITEMS */

    const items =
        getOrderItems(order);


    const detailItems =
        document.getElementById(
            "detailItems"
        );


    detailItems.innerHTML = "";


    if (!items.length) {

        detailItems.innerHTML = `
            <p class="text-muted small">
                No item information available.
            </p>
        `;

    } else {

        items.forEach(item => {

            const quantity =
                Number(
                    item.quantity ||
                    item.qty ||
                    1
                );


            const price =
                Number(
                    item.price ||
                    item.unitPrice ||
                    0
                );


            const name =
                item.name ||
                item.productName ||
                "Product";


            const size =
                item.size ||
                "";


            const color =
                item.color ||
                "";


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "detail-item";


            div.innerHTML = `

                <img
                    src="${escapeHTML(
                        getItemImage(item)
                    )}"
                    class="detail-item-image"
                    alt="${escapeHTML(name)}"
                    onerror="this.src='https://via.placeholder.com/100x100?text=Product'"
                >


                <div class="detail-item-info">

                    <div class="detail-item-name">

                        ${escapeHTML(name)}

                    </div>


                    <div class="detail-item-meta">

                        Qty: ${quantity}

                        ${size
                            ? ` · Size: ${escapeHTML(size)}`
                            : ""}

                        ${color
                            ? ` · Color: ${escapeHTML(color)}`
                            : ""}

                    </div>

                </div>


                <div class="detail-item-price">

                    ${formatMoney(
                        price * quantity
                    )}

                </div>

            `;


            detailItems.appendChild(div);

        });

    }


    /* PAYMENT */

    document.getElementById(
        "detailPayment"
    ).textContent =
        paymentLabel(
            order.paymentMethod ||
            order.payment
        );


    document.getElementById(
        "detailSubtotal"
    ).textContent =
        formatMoney(
            getOrderSubtotal(order)
        );


    document.getElementById(
        "detailDiscount"
    ).textContent =
        `- ${formatMoney(
            getOrderDiscount(order)
        )}`;


    document.getElementById(
        "detailTotal"
    ).textContent =
        formatMoney(
            getOrderTotal(order)
        );


    /* STATUS */

    detailStatus.value =
        normalizeStatus(
            order.status
        );


    orderModal.classList.add(
        "show"
    );

}


/* =========================================
   UPDATE STATUS
========================================= */

saveOrderStatus.addEventListener(
    "click",
    function() {

        if (!selectedOrderId) {
            return;
        }


        const newStatus =
            detailStatus.value;


        const orders =
            getOrders();


        const updated =
            orders.map(order => {

                const orderId =
                    order.orderId ||
                    order.id;


                if (
                    String(orderId) ===
                    String(selectedOrderId)
                ) {

                    return {

                        ...order,

                        status: newStatus,

                        updatedAt:
                            new Date()
                                .toISOString()

                    };

                }


                return order;

            });


        saveOrders(updated);


        showToast(
            "Order status updated successfully."
        );


        renderOrders();


        closeModal();

    }
);


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    orderModal.classList.remove(
        "show"
    );

    selectedOrderId = null;

}


closeOrderModal.addEventListener(
    "click",
    closeModal
);


orderModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            orderModal
        ) {

            closeModal();

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

            closeModal();

        }

    }
);


/* =========================================
   FILTERS
========================================= */

orderSearch.addEventListener(
    "input",
    renderOrders
);


statusFilter.addEventListener(
    "change",
    renderOrders
);


paymentFilter.addEventListener(
    "change",
    renderOrders
);


clearFilters.addEventListener(
    "click",
    function() {

        orderSearch.value = "";

        statusFilter.value = "all";

        paymentFilter.value = "all";

        renderOrders();

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

renderOrders();