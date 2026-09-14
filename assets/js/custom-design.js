/* =========================================================
   PRINTWAVE CUSTOM DESIGN STUDIO
========================================================= */

// =========================================================
// STATE
// =========================================================

let currentProduct = "tshirt";

let currentColor = "white";

let currentSide = "front";

let quantity = 1;

let zoom = 1;

let selectedElement = null;

let elementCounter = 0;

// =========================================================
// PRODUCT DATA
// =========================================================

const customProducts = {
  tshirt: {
    name: "Custom T-Shirt",

    price: 499,
  },

  scarf: {
    name: "Custom Scarf",

    price: 349,
  },

  mug: {
    name: "Custom Mug",

    price: 249,
  },
};

// =========================================================
// ELEMENTS
// =========================================================

const productOptions = document.querySelectorAll(".product-option");

const colorOptions = document.querySelectorAll(".color-option");

const sideOptions = document.querySelectorAll(".side-option");

const tshirtMockup = document.getElementById("tshirtMockup");

const scarfMockup = document.getElementById("scarfMockup");

const mugMockup = document.getElementById("mugMockup");

const printArea = document.getElementById("printArea");

const scarfPrintArea = document.getElementById("scarfPrintArea");

const mugPrintArea = document.getElementById("mugPrintArea");

const uploadButton = document.getElementById("uploadButton");

const imageUpload = document.getElementById("imageUpload");

const addTextButton = document.getElementById("addTextButton");

const clearDesignButton = document.getElementById("clearDesignButton");

const emptyState = document.getElementById("emptyState");

const textControls = document.getElementById("textControls");

const transformControls = document.getElementById("transformControls");

const designText = document.getElementById("designText");

const fontSize = document.getElementById("fontSize");

const fontSizeValue = document.getElementById("fontSizeValue");

const textColor = document.getElementById("textColor");

const fontWeight = document.getElementById("fontWeight");

const positionX = document.getElementById("positionX");

const positionY = document.getElementById("positionY");

const designScale = document.getElementById("designScale");

const designRotation = document.getElementById("designRotation");

const zoomIn = document.getElementById("zoomIn");

const zoomOut = document.getElementById("zoomOut");

const resetZoom = document.getElementById("resetZoom");

const zoomValue = document.getElementById("zoomValue");

const quantityDisplay = document.getElementById("quantity");

const quantityMinus = document.getElementById("quantityMinus");

const quantityPlus = document.getElementById("quantityPlus");

const selectedProductName = document.getElementById("selectedProductName");

const productPrice = document.getElementById("productPrice");

const totalPrice = document.getElementById("totalPrice");

const addCustomProduct = document.getElementById("addCustomProduct");

// =========================================================
// GET ACTIVE PRINT AREA
// =========================================================

function getActivePrintArea() {
  if (currentProduct === "tshirt") {
    return printArea;
  }

  if (currentProduct === "scarf") {
    return scarfPrintArea;
  }

  return mugPrintArea;
}

// =========================================================
// PRODUCT SELECTION
// =========================================================

productOptions.forEach((option) => {
  option.addEventListener("click", () => {
    productOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    currentProduct = option.dataset.product;

    updateProductPreview();

    updateProductInformation();
  });
});

// =========================================================
// UPDATE PRODUCT PREVIEW
// =========================================================

function updateProductPreview() {
  tshirtMockup.classList.add("d-none");

  scarfMockup.classList.add("d-none");

  mugMockup.classList.add("d-none");

  if (currentProduct === "tshirt") {
    tshirtMockup.classList.remove("d-none");
  }

  if (currentProduct === "scarf") {
    scarfMockup.classList.remove("d-none");
  }

  if (currentProduct === "mug") {
    mugMockup.classList.remove("d-none");
  }

  applyProductColor();

  applyZoom();
}

// =========================================================
// COLOR
// =========================================================

colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    colorOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    currentColor = option.dataset.color;

    applyProductColor();
  });
});

// =========================================================
// APPLY COLOR
// =========================================================

function applyProductColor() {
  let color;

  switch (currentColor) {
    case "black":
      color = "#151515";

      break;

    case "red":
      color = "#d93a3a";

      break;

    case "blue":
      color = "#2459a6";

      break;

    case "yellow":
      color = "#ffb914";

      break;

    default:
      color = "#ffffff";
  }

  document.querySelectorAll(".shirt-body, .shirt-sleeve").forEach((element) => {
    element.style.background = color;
  });

  document.querySelectorAll(".scarf-body").forEach((element) => {
    element.style.background = color;
  });

  document.querySelectorAll(".mug-body").forEach((element) => {
    element.style.background = color;
  });

  const handle = document.querySelector(".mug-handle");

  if (handle) {
    handle.style.borderColor = color;
  }

  // Improve neck contrast

  const neck = document.querySelector(".shirt-neck");

  if (neck) {
    neck.style.background = currentColor === "white" ? "#e7e7e7" : "#111";
  }
}

// =========================================================
// SIDE
// =========================================================

sideOptions.forEach((option) => {
  option.addEventListener("click", () => {
    sideOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    currentSide = option.dataset.side;
  });
});

// =========================================================
// UPLOAD
// =========================================================

uploadButton.addEventListener("click", () => {
  imageUpload.click();
});

// =========================================================
// IMAGE UPLOAD
// =========================================================

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  // 10 MB LIMIT

  if (file.size > 10 * 1024 * 1024) {
    alert("Image must be smaller than 10MB.");

    imageUpload.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    addImageElement(e.target.result);
  };

  reader.readAsDataURL(file);
});

// =========================================================
// ADD IMAGE
// =========================================================

function addImageElement(src) {
  const area = getActivePrintArea();

  const element = document.createElement("div");

  element.className = "design-element";

  elementCounter++;

  element.dataset.id = elementCounter;

  element.dataset.type = "image";

  element.style.left = "50%";

  element.style.top = "50%";

  element.style.transform = "translate(-50%, -50%)";

  element.innerHTML = `

        <img
            src="${src}"
            alt="Custom design"
            style="
                width:140px;
                max-width:140px;
            ">

    `;

  area.appendChild(element);

  makeDraggable(element);

  selectElement(element);
}

// =========================================================
// ADD TEXT
// =========================================================

addTextButton.addEventListener("click", () => {
  const area = getActivePrintArea();

  const element = document.createElement("div");

  elementCounter++;

  element.className = "design-element";

  element.classList.add("design-text");

  element.dataset.id = elementCounter;

  element.dataset.type = "text";

  element.dataset.text = "Your Text";

  element.style.left = "50%";

  element.style.top = "50%";

  element.style.transform = "translate(-50%, -50%)";

  element.style.fontSize = "36px";

  element.style.color = "#151515";

  element.style.fontWeight = "700";

  element.textContent = "Your Text";

  area.appendChild(element);

  makeDraggable(element);

  selectElement(element);

  updatePropertyPanels();
});

// =========================================================
// SELECT ELEMENT
// =========================================================

function selectElement(element) {
  document.querySelectorAll(".design-element").forEach((item) => {
    item.style.outline = "none";
  });

  selectedElement = element;

  selectedElement.style.outline = "2px solid #ffb914";

  updatePropertyPanels();

  loadElementValues();
}

// =========================================================
// PROPERTY PANELS
// =========================================================

function updatePropertyPanels() {
  if (!selectedElement) {
    emptyState.classList.remove("d-none");

    textControls.classList.add("d-none");

    transformControls.classList.add("d-none");

    return;
  }

  emptyState.classList.add("d-none");

  transformControls.classList.remove("d-none");

  if (selectedElement.dataset.type === "text") {
    textControls.classList.remove("d-none");
  } else {
    textControls.classList.add("d-none");
  }
}

// =========================================================
// LOAD VALUES
// =========================================================

function loadElementValues() {
  if (!selectedElement) return;

  positionX.value = Math.round(parseFloat(selectedElement.offsetLeft));

  positionY.value = Math.round(parseFloat(selectedElement.offsetTop));

  designScale.value = selectedElement.dataset.scale || "1";

  designRotation.value = selectedElement.dataset.rotation || "0";

  if (selectedElement.dataset.type === "text") {
    designText.value = selectedElement.textContent;

    fontSize.value = parseInt(selectedElement.style.fontSize) || 36;

    fontSizeValue.textContent = fontSize.value + "px";

    textColor.value = rgbToHex(selectedElement.style.color);

    fontWeight.value = selectedElement.style.fontWeight || "700";
  }
}

// =========================================================
// TEXT INPUT
// =========================================================

designText.addEventListener("input", () => {
  if (!selectedElement || selectedElement.dataset.type !== "text") return;

  selectedElement.textContent = designText.value || "Your Text";

  selectedElement.dataset.text = designText.value;
});

// =========================================================
// FONT SIZE
// =========================================================

fontSize.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.style.fontSize = fontSize.value + "px";

  fontSizeValue.textContent = fontSize.value + "px";
});

// =========================================================
// TEXT COLOR
// =========================================================

textColor.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.style.color = textColor.value;
});

// =========================================================
// FONT WEIGHT
// =========================================================

fontWeight.addEventListener("change", () => {
  if (!selectedElement) return;

  selectedElement.style.fontWeight = fontWeight.value;
});

// =========================================================
// POSITION X
// =========================================================

positionX.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.style.left = positionX.value + "px";

  selectedElement.style.transform = getTransform();
});

// =========================================================
// POSITION Y
// =========================================================

positionY.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.style.top = positionY.value + "px";

  selectedElement.style.transform = getTransform();
});

// =========================================================
// SCALE
// =========================================================

designScale.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.dataset.scale = designScale.value;

  selectedElement.style.transform = getTransform();
});

// =========================================================
// ROTATION
// =========================================================

designRotation.addEventListener("input", () => {
  if (!selectedElement) return;

  selectedElement.dataset.rotation = designRotation.value;

  selectedElement.style.transform = getTransform();
});

// =========================================================
// TRANSFORM
// =========================================================

function getTransform() {
  const scale = selectedElement.dataset.scale || "1";

  const rotation = selectedElement.dataset.rotation || "0";

  return `
        translate(-50%, -50%)
        scale(${scale})
        rotate(${rotation}deg)
    `;
}

// =========================================================
// DRAGGING
// =========================================================

function makeDraggable(element) {
  let dragging = false;

  let startX = 0;

  let startY = 0;

  let startLeft = 0;

  let startTop = 0;

  element.addEventListener("mousedown", startDrag);

  element.addEventListener("touchstart", startDrag, { passive: false });

  function startDrag(event) {
    event.preventDefault();

    selectElement(element);

    dragging = true;

    const point = getPointer(event);

    startX = point.x;

    startY = point.y;

    startLeft = parseFloat(element.style.left) || element.offsetLeft;

    startTop = parseFloat(element.style.top) || element.offsetTop;

    document.addEventListener("mousemove", drag);

    document.addEventListener("mouseup", stopDrag);

    document.addEventListener("touchmove", drag, { passive: false });

    document.addEventListener("touchend", stopDrag);
  }

  function drag(event) {
    if (!dragging) return;

    event.preventDefault();

    const point = getPointer(event);

    const dx = point.x - startX;

    const dy = point.y - startY;

    element.style.left = startLeft + dx + "px";

    element.style.top = startTop + dy + "px";

    positionX.value = Math.round(parseFloat(element.style.left));

    positionY.value = Math.round(parseFloat(element.style.top));
  }

  function stopDrag() {
    dragging = false;

    document.removeEventListener("mousemove", drag);

    document.removeEventListener("mouseup", stopDrag);

    document.removeEventListener("touchmove", drag);

    document.removeEventListener("touchend", stopDrag);
  }
}

// =========================================================
// POINTER
// =========================================================

function getPointer(event) {
  if (event.touches) {
    return {
      x: event.touches[0].clientX,

      y: event.touches[0].clientY,
    };
  }

  return {
    x: event.clientX,

    y: event.clientY,
  };
}

// =========================================================
// CLEAR DESIGN
// =========================================================

clearDesignButton.addEventListener("click", () => {
  if (!confirm("Clear all your design elements?")) return;

  document.querySelectorAll(".design-element").forEach((element) => {
    element.remove();
  });

  selectedElement = null;

  updatePropertyPanels();
});

// =========================================================
// ZOOM
// =========================================================

zoomIn.addEventListener("click", () => {
  zoom += 0.1;

  if (zoom > 1.8) {
    zoom = 1.8;
  }

  applyZoom();
});

zoomOut.addEventListener("click", () => {
  zoom -= 0.1;

  if (zoom < 0.6) {
    zoom = 0.6;
  }

  applyZoom();
});

resetZoom.addEventListener("click", () => {
  zoom = 1;

  applyZoom();
});

function applyZoom() {
  const mockups = document.querySelectorAll(".product-mockup");

  mockups.forEach((mockup) => {
    if (!mockup.classList.contains("d-none")) {
      let baseScale = currentProduct === "tshirt" ? 1 : 0.9;

      mockup.style.transform = `scale(${baseScale * zoom})`;
    }
  });

  zoomValue.textContent = Math.round(zoom * 100) + "%";
}

// =========================================================
// QUANTITY
// =========================================================

quantityMinus.addEventListener("click", () => {
  if (quantity <= 1) return;

  quantity--;

  updateQuantity();
});

quantityPlus.addEventListener("click", () => {
  if (quantity >= 99) return;

  quantity++;

  updateQuantity();
});

function updateQuantity() {
  quantityDisplay.textContent = quantity;

  updateTotal();
}

// =========================================================
// PRODUCT INFO
// =========================================================

function updateProductInformation() {
  const product = customProducts[currentProduct];

  selectedProductName.textContent = product.name;

  productPrice.textContent = product.price;

  updateTotal();
}

// =========================================================
// TOTAL
// =========================================================

function updateTotal() {
  const product = customProducts[currentProduct];

  const total = product.price * quantity;

  totalPrice.textContent = total;
}

// =========================================================
// RGB TO HEX
// =========================================================

function rgbToHex(rgb) {
  if (!rgb) return "#151515";

  if (rgb.startsWith("#")) {
    return rgb;
  }

  const result = rgb.match(/\d+/g);

  if (!result) {
    return "#151515";
  }

  return (
    "#" +
    result
      .slice(0, 3)
      .map((x) => Number(x).toString(16).padStart(2, "0"))
      .join("")
  );
}

// =========================================================
// ADD CUSTOM PRODUCT TO CART
// =========================================================

addCustomProduct.addEventListener("click", () => {
  const product = customProducts[currentProduct];

  const designElements = [];

  document.querySelectorAll(".design-element").forEach((element) => {
    const data = {
      type: element.dataset.type,

      x: element.style.left,

      y: element.style.top,

      scale: element.dataset.scale || "1",

      rotation: element.dataset.rotation || "0",
    };

    if (element.dataset.type === "text") {
      data.text = element.textContent;

      data.fontSize = element.style.fontSize;

      data.color = element.style.color;

      data.fontWeight = element.style.fontWeight;
    }

    if (element.dataset.type === "image") {
      const image = element.querySelector("img");

      if (image) {
        data.image = image.src;
      }
    }

    designElements.push(data);
  });

  const customItem = {
    id: "custom-" + Date.now(),

    name: product.name,

    price: product.price,

    image: createPreviewImage(),

    quantity: quantity,

    size: currentProduct === "tshirt" ? "M" : "Standard",

    color: currentColor,

    custom: true,

    productType: currentProduct,

    printSide: currentSide,

    designElements: designElements,
  };

  let cart = JSON.parse(localStorage.getItem("printwaveCart")) || [];

  cart.push(customItem);

  localStorage.setItem("printwaveCart", JSON.stringify(cart));

  updateCartCount();

  const toast = document.getElementById("successToast");

  const bsToast = new bootstrap.Toast(toast);

  bsToast.show();
});

// =========================================================
// CREATE SIMPLE PREVIEW
// =========================================================

function createPreviewImage() {
  if (currentProduct === "tshirt") {
    return "assets/images/tshirt-white.png";
  }

  if (currentProduct === "scarf") {
    return "assets/images/scarf-white.png";
  }

  return "assets/images/mug-white.png";
}

// =========================================================
// CART COUNT
// =========================================================

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("printwaveCart")) || [];

  const count = cart.reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = count;
  });
}

// =========================================================
// INITIALIZE
// =========================================================

updateProductInformation();

updateProductPreview();

updateCartCount();
