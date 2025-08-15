
/* App Fixes: mobile nav, shop now, buy now, images fallback, add-to-cart animation, robust WA flows */

const NEW_ADDRESS = "Block no a-199 room no 397 near Ratan park Dev Samaj road Netaji Ulhasnagar-4";

// Product catalog (keep IDs and names exactly as in your list if needed)
const products = [
  { id:1,  name:"LIV 52 30 L",                 category:"Livertonics",        price:2600, mrp:3250, image: "images/liv52_30l.jpg" },
  { id:2,  name:"LIV 52 5 L",                  category:"Livertonics",        price:840,  mrp:1050, image: "images/liv52_1l.jpg" },
  { id:3,  name:"LIV 52 1 L",                  category:"Livertonics",        price:390,  mrp:480,  image: "images/liv52_1l.jpg" },

  { id:4,  name:"E-Booster 1 L",               category:"Calcium supplements", price:640,  mrp:798,  image: "images/ebooster_1l.jpg" },
  { id:5,  name:"Enerdyna Advance 1 L",        category:"Calcium supplements", price:688,  mrp:860,  image:"https://cdn.netmeds.tech/v2/plain-cake-860195/netmed/wrkr/products/pictures/item/free/original/msx7hY_yWH-vet_mankind_enerdyna_advance_liquid_1000_ml_568400_0_2.jpg" },
  { id:6,  name:"Ostovet 5 L",                 category:"Calcium supplements", price:600,  mrp:750,  image: "images/ostovet_5l.jpg" },
  { id:7,  name:"Ostovet Forte 5 L",           category:"Calcium supplements", price:750,  mrp:930,  image: "images/ostovet_forte_5l.jpg" },
  { id:8,  name:"Chelated Ostovet Forte 5 L",  category:"Calcium supplements", price:880,  mrp:1100, image: "images/chelated_ostovet_forte_5l.jpg" },
  { id:9,  name:"Vimeral Forte 500ml",           category:"Multivitamins", price:920,  mrp:1150, image:"images/vimeral_500ml.png" },
  { id:10, name:"Vimeral Forte 300ml",           category:"Multivitamins", price:430,  mrp:530, image:"images/vimeral_300ml.png" },

  { id:11, name:"Multistar Liquid 1 L",        category:"Multivitamins",       price:580,  mrp:720,  image:"images/multistar_1l.jpg" },
  { id:12, name:"Multistar Liquid 500 ml",        category:"Multivitamins",       price:2650, mrp:3200, image:"images/multistar_500ml.jpg" },
  { id:13, name:"Multistar H Liquid 1 L",      category:"Multivitamins",       price:880,  mrp:1070, image:"images/multistar_h_1l.jpg" }, // local fallback used
  { id:14, name:"Multistar H Liquid 500 ml",   category:"Multivitamins",       price:710,  mrp:880,  image:"images/multistar_h_500ml.jpg" },
  ];

// Build local fallback map (slug => local image)
const localFallback = {
  "LIV 52 30 L": "/images/liv52_30l.svg",
  "LIV 52 5 L": "/images/liv52_5l.svg",
  "LIV 52 1 L": "/images/liv52_1l.svg",
  "E-Booster 1 L": "/images/e_booster_1l.svg",
  "Enerdyna Advance 1 L": "/images/enerdyna_advance_1l.svg",
  "Ostovet 5 L": "/images/ostovet_5l.svg",
  "Ostovet Forte 5 L": "/images/ostovet_forte_5l.svg",
  "Chelated Ostovet Forte 5 L": "/images/chelated_ostovet_forte_5l.svg",
  "Vimeral Forte 5 L": "/images/vimeral_forte_5l.svg",
  "Multistar Liquid 1 L": "/images/multistar_liquid_1l.svg",
  "Multistar Liquid 5 L": "/images/multistar_liquid_5l.svg",
  "Multistar H Liquid 1 L": "/images/multistar_h_1l.svg",
  "Multistar H Liquid 5 L": "/images/multistar_h_5l.svg",
  "Multistar H Liquid 500 ml": "/images/multistar_h_500ml.svg",
};

// State
let cart = [];

// Utility
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const fmt = n => new Intl.NumberFormat('en-IN').format(n);

// Render
function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;
  const active = $(".filter-btn.active");
  const category = active ? active.dataset.category : "all";
  const list = products.filter(p => category === "all" || p.category === category);
  grid.innerHTML = list.map(p => {
    const discount = p.price < p.mrp ? Math.round(100 - (p.price/p.mrp)*100) : 0;
    return `
      <div class="product-card">
        ${discount ? `<div class="discount-badge">${discount}% OFF</div>` : ""}
        <div class="product-img-wrap">
          <img loading="lazy" src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='${localFallback[p.name] || '/images/placeholder.svg'}';">
        </div>
        <div class="product-info">
          <h4>${p.name}</h4>
          <div class="price-row">
            <span class="price">₹${fmt(p.price)}</span>
            <span class="mrp">₹${fmt(p.mrp)}</span>
          </div>
          <div class="actions">
            <button class="btn btn--primary btn--sm" data-add="${p.id}">Add to Cart</button>
            <button class="btn btn--outline btn--sm" data-view="${p.id}">View</button>
            <button class="btn btn--primary btn--sm" data-buy="${p.id}">Buy Now</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Filters
function setupFilters(){
  $$(".filter-btn").forEach(b=>b.addEventListener("click", ()=>{
    $$(".filter-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    renderProducts();
  }));
}

// Cart logic
function addToCart(id) {
  const p = products.find(x=>x.id===id);
  if (!p) return;
  const i = cart.findIndex(x=>x.id===id);
  if (i>-1) cart[i].qty += 1; else cart.push({ ...p, qty:1 });
  updateCartUI();
  // Animation feedback
  const btn = document.querySelector(`[data-add="${id}"]`);
  if (btn) {
    const burst = document.createElement("span");
    burst.className = "added-burst";
    burst.textContent = "+1";
    btn.style.position = "relative";
    btn.appendChild(burst);
    setTimeout(()=> burst.remove(), 650);
    btn.disabled = true;
    const t = btn.textContent;
    btn.textContent = "Added ✓";
    setTimeout(()=>{ btn.textContent = t; btn.disabled = false; }, 900);
  }
}

function updateCartUI(){
  const count = cart.reduce((n,c)=>n+c.qty,0);
  const total = cart.reduce((s,c)=>s + c.price*c.qty,0);
  const list = $("#cart-items");
  const cEl = $("#cart-count"); const tEl = $("#cart-total");
  if (cEl) cEl.textContent = String(count);
  if (tEl) tEl.textContent = fmt(total);
  if (list) {
    list.innerHTML = cart.length ? cart.map(c => `
      <div class="cart-item">
        <img src="${c.image}" alt="${c.name}" onerror="this.onerror=null; this.src='${localFallback[c.name] || '/images/placeholder.svg'}'">
        <div class="ci-main">
          <strong>${c.name}</strong>
          <div>₹${fmt(c.price)} × ${c.qty}</div>
        </div>
        <div class="ci-actions">
          <button class="btn btn--outline btn--sm" data-dec="${c.id}">-</button>
          <button class="btn btn--outline btn--sm" data-inc="${c.id}">+</button>
          <button class="btn btn--outline btn--sm" data-rem="${c.id}">×</button>
        </div>
      </div>
    `).join("") : "<p>Your cart is empty.</p>";
  }
}

function modifyCart(id, op){
  const i = cart.findIndex(x=>x.id===id);
  if (i<0) return;
  if (op==="inc") cart[i].qty += 1;
  if (op==="dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
  if (op==="rem") cart.splice(i,1);
  updateCartUI();
}

function buyNow(id){
  const p = products.find(x=>x.id===id);
  if (!p) return;
  const msg = encodeURIComponent(`Hello! I'd like to order:\n• ${p.name}\n• Qty: 1\n• Price: ₹${p.price}\n\nDelivery address (please enter):\n<your name>\n<house/flat>\n<area/landmark>\n<city & pincode>`);
  window.open(`https://wa.me/917774994499?text=${msg}`, "_blank");
}

// Section navigation (for any element with data-section)
function setupSectionNav(){
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-section]");
    if (!btn) return;
    const id = btn.dataset.section;
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(s=>s.classList.remove("active"));
    const tgt = document.getElementById(id);
    if (tgt) tgt.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Global delegation
document.addEventListener("click", (e)=>{
  const add = e.target.closest("[data-add]");
  const view = e.target.closest("[data-view]");
  const buy = e.target.closest("[data-buy]");
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-rem]");
  const close = e.target.closest("[data-close-modal]");

  if (add) addToCart(Number(add.dataset.add));
  if (buy) buyNow(Number(buy.dataset.buy));
  if (view) openDetails(Number(view.dataset.view));
  if (inc) modifyCart(Number(inc.dataset.inc), "inc");
  if (dec) modifyCart(Number(dec.dataset.dec), "dec");
  if (rem) modifyCart(Number(rem.dataset.rem), "rem");
  if (close) document.getElementById("modal").classList.remove("open");
});

// Modal
function ensureModal(){
  if (!document.getElementById("modal")) {
    const m = document.createElement("div");
    m.id = "modal";
    m.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-dialog">
        <button class="modal-close" data-close-modal aria-label="Close">×</button>
        <div id="modal-body"></div>
      </div>`;
    document.body.appendChild(m);
  }
}
function openDetails(id){
  const p = products.find(x=>x.id===id);
  ensureModal();
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <img class="modal-img" src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='${localFallback[p.name] || '/images/placeholder.svg'}'">
    <h3>${p.name}</h3>
    <p class="muted">${p.category}</p>
    <p><strong>Price:</strong> ₹${fmt(p.price)} <span class="mrp">₹${fmt(p.mrp)}</span></p>
    <div class="modal-actions">
      <button class="btn btn--primary" data-add="${p.id}">Add to Cart</button>
      <button class="btn btn--primary" data-buy="${p.id}">Buy Now</button>
    </div>
  `;
  document.getElementById("modal").classList.add("open");
}

// Mobile header auto-hide on scroll
(function(){
  let lastY = window.scrollY;
  const header = document.querySelector(".header");
  if (!header) return;
  window.addEventListener("scroll", ()=>{
    const y = window.scrollY;
    if (y > lastY && y > 80) header.classList.add("header--hidden");
    else header.classList.remove("header--hidden");
    lastY = y;
  });
})();

// Mobile menu toggle
(function(){
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", ()=> nav.classList.toggle("nav--open"));
})();

// Cart controls in Cart section
document.addEventListener("DOMContentLoaded", ()=>{
  const clearBtn = document.getElementById("cart-clear");
  const checkout = document.getElementById("cart-checkout");
  if (clearBtn) clearBtn.addEventListener("click", ()=>{ cart = []; updateCartUI(); });
  if (checkout) checkout.addEventListener("click", ()=>{
    if (!cart.length) return alert("Your cart is empty.");
    const lines = cart.map(c=>`${c.name} × ${c.qty} — ₹${c.price}`).join("\\n");
    const total = cart.reduce((s,c)=>s + c.price*c.qty, 0);
    const msg = encodeURIComponent(`Hello! I'd like to place an order:\\n\\n${lines}\\n\\nTotal: ₹${fmt(total)}\\n\\nDeliver to:\\n${NEW_ADDRESS}`);
    window.open(`https://wa.me/917774994499?text=${msg}`, "_blank");
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", ()=>{
  setupFilters();
  setupSectionNav();
  renderProducts();
  updateCartUI();
});
