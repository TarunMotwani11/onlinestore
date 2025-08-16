/* Enhanced App: Professional cattle supplies website with address collection */

const NEW_ADDRESS = "Block no a-199 room no 397 near Ratan park Dev Samaj road Netaji Ulhasnagar-4";
const PHONE_NUMBER = "917774994499"; // WhatsApp number

// Product catalog with EXACT original local image paths from your original file
const products = [
  { id:1,  name:"LIV 52 30 L",                 category:"Livertonics",        price:2600, mrp:3250, image: "images/liv52_30l.jpg", description: "Comprehensive liver tonic for optimal liver function" },
  { id:2,  name:"LIV 52 5 L",                  category:"Livertonics",        price:840,  mrp:1050, image: "images/liv52_1l.jpg", description: "Effective liver protection and regeneration" },
  { id:3,  name:"LIV 52 1 L",                  category:"Livertonics",        price:390,  mrp:480,  image: "images/liv52_1l.jpg", description: "Premium liver support supplement" },

  { id:4,  name:"E-Booster 1 L",               category:"Calcium supplements", price:640,  mrp:798,  image: "images/ebooster_1l.jpg", description: "Energy boosting calcium supplement" },
  { id:5,  name:"Enerdyna Advance 1 L",        category:"Calcium supplements", price:688,  mrp:860,  image:"https://cdn.netmeds.tech/v2/plain-cake-860195/netmed/wrkr/products/pictures/item/free/original/msx7hY_yWH-vet_mankind_enerdyna_advance_liquid_1000_ml_568400_0_2.jpg", description: "Advanced energy and calcium formula" },
  { id:6,  name:"Ostovet 5 L",                 category:"Calcium supplements", price:600,  mrp:750,  image: "images/ostovet_5l.jpg", description: "Complete calcium and phosphorus supplement" },
  { id:7,  name:"Ostovet Forte 5 L",           category:"Calcium supplements", price:750,  mrp:930,  image: "images/ostovet_forte_5l.jpg", description: "Enhanced calcium formula with vitamins" },
  { id:8,  name:"Chelated Ostovet Forte 5 L",  category:"Calcium supplements", price:880,  mrp:1100, image: "images/chelated_ostovet_forte_5l.jpg", description: "Superior chelated calcium for better absorption" },

  { id:9,  name:"Vimeral Forte 500ml",         category:"Multivitamins", price:920,  mrp:1150, image:"images/vimeral_500ml.png", description: "Complete multivitamin and mineral supplement" },
  { id:10, name:"Vimeral Forte 300ml",         category:"Multivitamins", price:430,  mrp:530, image:"images/vimeral_300ml.png", description: "Essential vitamins for optimal health" },
  { id:11, name:"Multistar Liquid 1 L",        category:"Multivitamins", price:580,  mrp:720,  image:"images/multistar_1l.jpg", description: "Premium multivitamin liquid formula" },
  { id:12, name:"Multistar Liquid 500 ml",     category:"Multivitamins", price:2650, mrp:3200, image:"images/multistar_500ml.jpg", description: "Concentrated multivitamin solution" },
  { id:13, name:"Multistar H Liquid 1 L",      category:"Multivitamins", price:880,  mrp:1070, image:"images/multistar_h_1l.jpg", description: "High-potency multivitamin formula" },
  { id:14, name:"Multistar H Liquid 500 ml",   category:"Multivitamins", price:710,  mrp:880,  image:"images/multistar_h_500ml.jpg", description: "Concentrated high-potency vitamins" },
];

// Local fallback images - EXACTLY from your original file
const localFallback = {
  "LIV 52 30 L": "/images/liv52_30l.svg",
  "LIV 52 5 L": "/images/liv52_5l.svg", 
  "LIV 52 1 L": "/images/liv52_1l.svg",
  "E-Booster 1 L": "/images/e_booster_1l.svg",
  "Enerdyna Advance 1 L": "/images/enerdyna_advance_1l.svg",
  "Ostovet 5 L": "/images/ostovet_5l.svg",
  "Ostovet Forte 5 L": "/images/ostovet_forte_5l.svg",
  "Chelated Ostovet Forte 5 L": "/images/chelated_ostovet_forte_5l.svg",
  "Vimeral Forte 500ml": "/images/vimeral_forte_500ml.svg",
  "Vimeral Forte 300ml": "/images/vimeral_forte_300ml.svg",
  "Multistar Liquid 1 L": "/images/multistar_liquid_1l.svg",
  "Multistar Liquid 500 ml": "/images/multistar_liquid_500ml.svg",
  "Multistar H Liquid 1 L": "/images/multistar_h_1l.svg",
  "Multistar H Liquid 500 ml": "/images/multistar_h_500ml.svg",
};

// State management
let cart = [];
let currentOrderData = null; // Store order data for address collection

// Utility functions
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const fmt = (number) => new Intl.NumberFormat('en-IN').format(number);

// Enhanced product rendering with better UI
function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;

  const activeFilter = $(".filter-btn.active");
  const category = activeFilter ? activeFilter.dataset.category : "all";
  const filteredProducts = products.filter(p => category === "all" || p.category === category);

  grid.innerHTML = filteredProducts.map(product => {
    const discount = product.price < product.mrp ? Math.round(100 - (product.price / product.mrp) * 100) : 0;
    const savings = product.mrp - product.price;

    return `
      <div class="product-card" data-product-id="${product.id}">
        ${discount ? `<div class="discount-badge">${discount}% OFF</div>` : ""}
        <div class="product-image-container">
          <img loading="lazy" 
               src="${product.image}" 
               alt="${product.name}" 
               class="product-image"
               onerror="this.onerror=null; this.src='${localFallback[product.name] || '/images/placeholder.svg'}';">
          <div class="product-overlay">
            <button class="btn btn--outline btn--sm quick-view-btn" data-view="${product.id}">
              👁️ Quick View
            </button>
          </div>
        </div>

        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h4 class="product-name">${product.name}</h4>
          <p class="product-description">${product.description || ''}</p>

          <div class="price-section">
            <div class="current-price">₹${fmt(product.price)}</div>
            ${product.mrp > product.price ? `
              <div class="original-price">₹${fmt(product.mrp)}</div>
              <div class="savings">Save ₹${fmt(savings)}</div>
            ` : ''}
          </div>

          <div class="product-actions">
            <button class="btn btn--outline add-to-cart-btn" data-add="${product.id}">
              <span class="btn-icon">🛒</span>
              Add to Cart
            </button>
            <button class="btn btn--primary buy-now-btn" data-buy="${product.id}">
              <span class="btn-icon">⚡</span>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Add fade-in animation
  grid.classList.add('fade-in');
}

// Enhanced filter setup
function setupFilters() {
  $$(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      $$(".filter-btn").forEach(btn => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Add loading state
      const grid = $("#products-grid");
      if (grid) {
        grid.style.opacity = "0.5";
        setTimeout(() => {
          renderProducts();
          grid.style.opacity = "1";
        }, 150);
      }
    });
  });
}

// Enhanced cart management
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showAddToCartFeedback(productId);

  // Animate cart badge
  const cartBadge = $("#cart-badge");
  if (cartBadge) {
    cartBadge.style.display = "block";
    cartBadge.classList.add("cart-bounce");
    setTimeout(() => cartBadge.classList.remove("cart-bounce"), 600);
  }
}

function showAddToCartFeedback(productId) {
  const button = $(`[data-add="${productId}"]`);
  if (!button) return;

  const originalText = button.innerHTML;
  const originalClass = button.className;

  button.innerHTML = '<span class="btn-icon">✅</span> Added!';
  button.className = button.className.replace('btn--outline', 'btn--success');
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalText;
    button.className = originalClass;
    button.disabled = false;
  }, 1500);
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update cart count
  const countElement = $("#cart-count");
  if (countElement) {
    countElement.textContent = totalItems;
  }

  // Update cart total
  const totalElement = $("#cart-total");
  if (totalElement) {
    totalElement.textContent = fmt(totalAmount);
  }

  // Update cart items display
  const cartItemsContainer = $("#cart-items");
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
          <button class="btn btn--primary" data-section="products">Browse Products</button>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" 
                 onerror="this.onerror=null; this.src='${localFallback[item.name] || '/images/placeholder.svg'}';">
          </div>

          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-category">${item.category}</div>
            <div class="cart-item-price">₹${fmt(item.price)} each</div>
          </div>

          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="btn btn--outline btn--sm" data-dec="${item.id}">−</button>
              <span class="quantity-display">${item.qty}</span>
              <button class="btn btn--outline btn--sm" data-inc="${item.id}">+</button>
            </div>
            <div class="item-total">₹${fmt(item.price * item.qty)}</div>
            <button class="btn btn--outline btn--sm remove-btn" data-rem="${item.id}">
              🗑️ Remove
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  // Show/hide cart badge
  const cartBadge = $("#cart-badge");
  if (cartBadge) {
    cartBadge.style.display = totalItems > 0 ? "block" : "none";
    cartBadge.textContent = totalItems;
  }
}

function modifyCart(productId, operation) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex < 0) return;

  if (operation === "inc") {
    cart[itemIndex].qty += 1;
  } else if (operation === "dec") {
    if (cart[itemIndex].qty > 1) {
      cart[itemIndex].qty -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
  } else if (operation === "rem") {
    cart.splice(itemIndex, 1);
  }

  updateCartUI();
}

// Address collection system
function openAddressModal(orderData) {
  currentOrderData = orderData;
  const modal = $("#address-modal");
  if (modal) {
    modal.classList.add("open");
    // Focus on first input
    setTimeout(() => {
      const firstInput = $("#customer-name");
      if (firstInput) firstInput.focus();
    }, 100);
  }
}

function closeAddressModal() {
  const modal = $("#address-modal");
  if (modal) {
    modal.classList.remove("open");
    currentOrderData = null;

    // Reset form
    const form = $("#address-form");
    if (form) form.reset();
  }
}

function validateAddressForm() {
  const requiredFields = [
    'customer-name',
    'customer-phone', 
    'house-flat',
    'area-landmark',
    'city-pincode'
  ];

  let isValid = true;
  let firstInvalidField = null;

  requiredFields.forEach(fieldId => {
    const field = $(`#${fieldId}`);
    if (field) {
      const value = field.value.trim();
      if (!value) {
        field.classList.add('error');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      } else {
        field.classList.remove('error');
      }
    }
  });

  // Validate phone number
  const phoneField = $("#customer-phone");
  if (phoneField && phoneField.value.trim()) {
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phoneField.value.trim())) {
      phoneField.classList.add('error');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phoneField;
    }
  }

  if (!isValid && firstInvalidField) {
    firstInvalidField.focus();
  }

  return isValid;
}

function submitAddressForm() {
  if (!validateAddressForm() || !currentOrderData) return;

  // Collect address data
  const addressData = {
    name: $("#customer-name").value.trim(),
    phone: $("#customer-phone").value.trim(),
    houseFlat: $("#house-flat").value.trim(),
    areaLandmark: $("#area-landmark").value.trim(),
    cityPincode: $("#city-pincode").value.trim(),
    specialInstructions: $("#special-instructions").value.trim()
  };

  // Create formatted address
  const formattedAddress = `${addressData.name}\n${addressData.phone}\n${addressData.houseFlat}\n${addressData.areaLandmark}\n${addressData.cityPincode}`;

  // Create WhatsApp message
  let message = `🛒 *NEW ORDER REQUEST*\n\n`;

  if (currentOrderData.type === 'single') {
    // Single product order
    const product = currentOrderData.product;
    message += `📦 *Product:* ${product.name}\n`;
    message += `📊 *Category:* ${product.category}\n`;
    message += `🔢 *Quantity:* 1\n`;
    message += `💰 *Price:* ₹${fmt(product.price)}\n\n`;
  } else if (currentOrderData.type === 'cart') {
    // Cart checkout
    message += `📦 *Order Details:*\n`;
    currentOrderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qty: ${item.qty} × ₹${fmt(item.price)} = ₹${fmt(item.price * item.qty)}\n`;
    });
    message += `\n💰 *Total Amount:* ₹${fmt(currentOrderData.total)}\n\n`;
  }

  message += `🏠 *Delivery Address:*\n${formattedAddress}\n\n`;

  if (addressData.specialInstructions) {
    message += `📝 *Special Instructions:*\n${addressData.specialInstructions}\n\n`;
  }

  message += `⏰ *Order Time:* ${new Date().toLocaleString('en-IN')}\n\n`;
  message += `Please confirm this order and let me know the delivery time and final amount including delivery charges. Thank you! 🙏`;

  // Send to WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappURL, '_blank');

  // Close modal and clear cart if it was a cart checkout
  closeAddressModal();
  if (currentOrderData.type === 'cart') {
    cart = [];
    updateCartUI();

    // Show success message
    showSuccessMessage("Order sent successfully! We'll contact you soon on WhatsApp.");
  } else {
    showSuccessMessage("Order sent successfully! We'll contact you soon on WhatsApp.");
  }
}

function showSuccessMessage(message) {
  // Create and show a toast notification
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">✅</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 100);

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Buy now functionality
function buyNow(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const orderData = {
    type: 'single',
    product: product
  };

  openAddressModal(orderData);
}

// Cart checkout functionality
function checkoutCart() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add some products first.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const orderData = {
    type: 'cart',
    items: [...cart], // Create a copy
    total: total
  };

  openAddressModal(orderData);
}

// Product details modal
function ensureModal() {
  if (!$("#modal")) {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-dialog product-modal-dialog">
        <button class="modal-close" data-close-modal aria-label="Close">×</button>
        <div id="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

function openProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  ensureModal();
  const modalBody = $("#modal-body");
  const discount = product.price < product.mrp ? Math.round(100 - (product.price / product.mrp) * 100) : 0;

  modalBody.innerHTML = `
    <div class="product-modal-content">
      <div class="modal-product-image">
        <img src="${product.image}" alt="${product.name}" 
             onerror="this.onerror=null; this.src='${localFallback[product.name] || '/images/placeholder.svg'}';">
        ${discount ? `<div class="modal-discount-badge">${discount}% OFF</div>` : ""}
      </div>

      <div class="modal-product-info">
        <div class="modal-product-category">${product.category}</div>
        <h3 class="modal-product-name">${product.name}</h3>
        <p class="modal-product-description">${product.description || 'High-quality cattle supplement for optimal health and nutrition.'}</p>

        <div class="modal-price-section">
          <div class="modal-current-price">₹${fmt(product.price)}</div>
          ${product.mrp > product.price ? `
            <div class="modal-original-price">₹${fmt(product.mrp)}</div>
            <div class="modal-savings">You save ₹${fmt(product.mrp - product.price)}</div>
          ` : ''}
        </div>

        <div class="modal-features">
          <h4>Key Features:</h4>
          <ul>
            <li>✅ Genuine and authentic product</li>
            <li>✅ Veterinarian recommended</li>
            <li>✅ Fast-acting formula</li>
            <li>✅ Safe for regular use</li>
          </ul>
        </div>

        <div class="modal-actions">
          <button class="btn btn--outline btn--lg" data-add="${product.id}">
            <span class="btn-icon">🛒</span>
            Add to Cart
          </button>
          <button class="btn btn--primary btn--lg" data-buy="${product.id}">
            <span class="btn-icon">⚡</span>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `;

  $("#modal").classList.add("open");
}

// Section navigation with smooth transitions
function setupSectionNavigation() {
  document.addEventListener("click", (e) => {
    const sectionButton = e.target.closest("[data-section]");
    if (!sectionButton) return;

    const targetSectionId = sectionButton.dataset.section;
    const currentSection = $(".section.active");
    const targetSection = $(`#${targetSectionId}`);

    if (!targetSection || targetSection === currentSection) return;

    // Update navigation buttons
    $$(".nav-btn").forEach(btn => btn.classList.remove("active"));
    sectionButton.classList.add("active");

    // Transition sections
    if (currentSection) {
      currentSection.style.opacity = "0";
      setTimeout(() => {
        currentSection.classList.remove("active");
        targetSection.classList.add("active");
        targetSection.style.opacity = "0";
        setTimeout(() => {
          targetSection.style.opacity = "1";
        }, 50);
      }, 150);
    } else {
      targetSection.classList.add("active");
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Global event delegation
document.addEventListener("click", (e) => {
  const target = e.target;

  // Product actions
  if (target.closest("[data-add]")) {
    const productId = parseInt(target.closest("[data-add]").dataset.add);
    addToCart(productId);
  }

  if (target.closest("[data-buy]")) {
    const productId = parseInt(target.closest("[data-buy]").dataset.buy);
    buyNow(productId);
  }

  if (target.closest("[data-view]")) {
    const productId = parseInt(target.closest("[data-view]").dataset.view);
    openProductDetails(productId);
  }

  // Cart actions
  if (target.closest("[data-inc]")) {
    const productId = parseInt(target.closest("[data-inc]").dataset.inc);
    modifyCart(productId, "inc");
  }

  if (target.closest("[data-dec]")) {
    const productId = parseInt(target.closest("[data-dec]").dataset.dec);
    modifyCart(productId, "dec");
  }

  if (target.closest("[data-rem]")) {
    const productId = parseInt(target.closest("[data-rem]").dataset.rem);
    modifyCart(productId, "rem");
  }

  // Modal controls
  if (target.closest("[data-close-modal]")) {
    $("#modal")?.classList.remove("open");
  }

  if (target.closest("[data-close-address-modal]")) {
    closeAddressModal();
  }
});

// Enhanced mobile navigation
function setupMobileNavigation() {
  const menuToggle = $(".menu-toggle");
  const nav = $(".nav");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("nav--open");
    menuToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking a nav item
  $$(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      menuToggle.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove("nav--open");
      menuToggle.classList.remove("active");
    }
  });
}

// Enhanced header auto-hide
function setupHeaderAutoHide() {
  let lastScrollY = window.scrollY;
  let ticking = false;

  const header = $(".header");
  if (!header) return;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY && scrollY > 100) {
      // Scrolling down
      header.classList.add("header--hidden");
    } else {
      // Scrolling up
      header.classList.remove("header--hidden");
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function requestHeaderUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestHeaderUpdate);
}

// Form validation helpers
function setupFormValidation() {
  // Real-time validation for form fields
  const form = $("#address-form");
  if (!form) return;

  const inputs = $$("input, textarea", form);
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("error") && input.value.trim()) {
        input.classList.remove("error");
      }
    });
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitAddressForm();
  });
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  // Core functionality
  setupFilters();
  setupSectionNavigation();
  renderProducts();
  updateCartUI();

  // Enhanced features
  setupMobileNavigation();
  setupHeaderAutoHide();
  setupFormValidation();

  // Cart controls
  const clearCartBtn = $("#cart-clear");
  const checkoutBtn = $("#cart-checkout");

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length > 0 && confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        updateCartUI();
        showSuccessMessage("Cart cleared successfully!");
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkoutCart);
  }

  // Add smooth loading animation
  document.body.classList.add("loaded");
});