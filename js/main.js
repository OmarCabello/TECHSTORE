const products = [
  { id: "rgb-headset", name: "Audífonos RGB ", price: 129.9, offer: false, img: "assets/headphones.webp" },
  { id: "headset-pro", name: "Audífonos Tech Pro", price: 159.9, offer: true, old: 199.9, img: "assets/Audífonos Tech Pro.webp" },
  { id: "headset-lite", name: "Audífonos Lite", price: 89.9, offer: false, img: "assets/Audífonos Lite.webp" },
  { id: "rgb-headset", name: "Audífonos RGB ", price: 129.9, offer: false, img: "assets/headphones.webp" },
  { id: "headset-gamer", name: "Headset Gamer X", price: 149.9, offer: true, old: 189.9, img: "assets/Headset Gamer X.webp" },
  { id: "headset-studio", name: "Audífonos Studio", price: 179.9, offer: false, img: "assets/Audífonos Studio.webp" },
  { id: "headset-studio", name: "Studio", price: 179.9, offer: false, img: "assets/Audífonos Studio.webp" },
  { id: "headset-pro", name: "Audífonos Tech Pro", price: 159.9, offer: true, old: 199.9, img: "assets/headphones.webp" },
  { id: "headset-kids", name: "Audífonos Go", price: 69.9, offer: true, old: 99.9, img: "assets/Audífonos Go.webp" }
];

const page = location.pathname.split("/").pop() || "index.html";
const money = (n) => `S/ ${n.toFixed(2)}`;

const headerHTML = `
<header class="header">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="TECHSTORE inicio">
      <img src="assets/logo-gorila.webp" alt="TECHSTORE" class="brand-logo" />
      <span class="brand-name">TECHSTORE</span>
    </a>
    <form class="search" id="search-form" role="search">
      <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M20 20L16.5 16.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input type="search" id="search-input" placeholder="Buscar productos..." autocomplete="off" />
    </form>
    <nav class="nav" id="main-nav" aria-label="Principal">
      <a href="index.html" class="nav-link">Inicio</a>
      <a href="productos.html" class="nav-link">Productos</a>
      <a href="ofertas.html" class="nav-link">Ofertas</a>
      <a href="contactos.html" class="nav-link">Contactos</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="account-btn" aria-label="Cuenta">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path d="M4.2 20.2c1.6-4 4.4-6 7.8-6s6.2 2 7.8 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
      <button class="icon-btn cart-btn" id="cart-btn" aria-label="Carrito">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="18" cy="20" r="1.5" fill="currentColor" />
          <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.55L21 8H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="cart-count" id="cart-count" hidden>0</span>
      </button>
      <button class="icon-btn menu-btn" id="menu-btn" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;

const footerHTML = `
<footer class="footer">
  <div class="footer-inner">
    <a class="brand brand-footer" href="index.html">
      <img src="assets/logo-gorila.webp" alt="" class="brand-logo" />
      <span class="brand-name">TECHSTORE</span>
    </a>
    <div class="footer-col">
      <a href="index.html">Información</a>
      <a href="productos.html">Servicios</a>
      <a href="contactos.html">Terminos y condiciones</a>
      <a href="contactos.html">Politicas de privacidad</a>
    </div>
    <div class="footer-col">
      <h3>Contacto</h3>
      <p>964754544</p>
      <p>Pasco-perú</p>
    </div>
    <div class="footer-col">
      <h3>Siguenos</h3>
      <div class="socials">
        <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z"/></svg>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14.5 3c.4 2.4 1.7 4 4.2 4.3v2.3c-1.5 0-2.9-.5-4.1-1.4v6.6c0 3.3-2.7 6-6.1 6S2.5 18.1 2.5 14.8s2.6-6 6-6c.3 0 .7 0 1 .1v2.5c-.3-.1-.7-.2-1-.2-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6V3h2.4z"/></svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-col payments">
      <h3>Metodos de pago</h3>
      <div class="pay-logos">
        <span class="pay visa">VISA</span>
        <span class="pay mc"><i></i><i></i></span>
        <span class="pay paypal">Pay<span>Pal</span></span>
      </div>
    </div>
  </div>
  <p class="copyright">@TECHSTORE-DERECHOS RESERVADOS 2026</p>
</footer>`;

const drawersHTML = `
<aside class="drawer" id="cart-drawer" aria-hidden="true">
  <div class="drawer-panel">
    <div class="drawer-head">
      <h2>Carrito</h2>
      <button class="icon-btn" id="close-cart" aria-label="Cerrar carrito">×</button>
    </div>
    <div id="cart-items"></div>
    <div class="drawer-foot">
      <p>Total: <strong id="cart-total">S/ 0.00</strong></p>
      <button class="btn-buy" id="checkout-btn">Finalizar compra</button>
    </div>
  </div>
</aside>
<aside class="drawer" id="account-drawer" aria-hidden="true">
  <div class="drawer-panel">
    <div class="drawer-head">
      <h2>Cuenta</h2>
      <button class="icon-btn" id="close-account" aria-label="Cerrar cuenta">×</button>
    </div>
    
<form class="contact-form" id="login-form">

  <label for="login-email">Correo</label>

  <input
    type="email"
    id="login-email"
    name="email"
    placeholder="Ingresa tu correo"
    required
  />

  <label for="login-password">Contraseña</label>

  <input
    type="password"
    id="login-password"
    name="password"
    placeholder="Ingresa tu contraseña"
    required
  />

  <button type="submit" class="btn-buy">
    Ingresar
  </button>

  <p class="form-ok" id="login-ok" hidden></p>

</form>

</aside>`;

document.getElementById("site-header").outerHTML = headerHTML;
document.getElementById("site-footer").outerHTML = footerHTML;
document.getElementById("site-drawers").outerHTML = drawersHTML;

const dots = document.querySelector(".dot-grid");
if (dots) dots.innerHTML = Array.from({ length: 36 }, () => "<span></span>").join("");

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("techstore-cart") || "[]");
} catch (e) {
  cart = [];
}

function saveCart() {
  localStorage.setItem("techstore-cart", JSON.stringify(cart));
}

function cardHTML(p) {
  return `
    <article class="card">
      <div class="card-media"><img src="${p.img}" alt="${p.name}" /></div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="price">${money(p.price)}${p.old ? `<span class="old">${money(p.old)}</span>` : ""}</p>
        <button class="btn-buy" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </article>`;
}

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  const emptyState = document.getElementById("empty-state");
  if (!grid) return;
  grid.innerHTML = list.map(cardHTML).join("");
  if (emptyState) emptyState.hidden = list.length > 0;
}

function renderOffers() {
  const offersGrid = document.getElementById("offers-grid");
  if (!offersGrid) return;
  offersGrid.innerHTML = products.filter((p) => p.offer).map(cardHTML).join("");
}

function renderCart() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItems) return;
  if (!cart.length) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartTotal.textContent = money(0);
    cartCount.hidden = true;
    return;
  }
  cartItems.innerHTML = cart
    .map(
      (item, i) => `
      <div class="cart-line">
        <span>${item.name}</span>
        <span>${money(item.price)}</span>
        <button data-remove="${i}" aria-label="Quitar">Quitar</button>
      </div>`
    )
    .join("");
  cartTotal.textContent = money(cart.reduce((s, i) => s + i.price, 0));
  cartCount.hidden = false;
  cartCount.textContent = String(cart.length);
}

document.body.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const p = products.find((x) => x.id === add.dataset.add);
    if (p) {
      cart.push(p);
      saveCart();
      renderCart();
    }
  }
  const remove = e.target.closest("[data-remove]");
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart();
    renderCart();
  }
});

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  location.href = `productos.html?q=${encodeURIComponent(q)}`;
});

function toggleDrawer(id, open) {
  const el = document.getElementById(id);
  el.classList.toggle("open", open);
  el.setAttribute("aria-hidden", open ? "false" : "true");
}

document.getElementById("cart-btn").addEventListener("click", () => toggleDrawer("cart-drawer", true));
document.getElementById("close-cart").addEventListener("click", () => toggleDrawer("cart-drawer", false));
document.getElementById("cart-drawer").addEventListener("click", (e) => {
  if (e.target.id === "cart-drawer") toggleDrawer("cart-drawer", false);
});
document.getElementById("account-btn").addEventListener("click", () => toggleDrawer("account-drawer", true));
document.getElementById("close-account").addEventListener("click", () => toggleDrawer("account-drawer", false));
document.getElementById("account-drawer").addEventListener("click", (e) => {
  if (e.target.id === "account-drawer") toggleDrawer("account-drawer", false);
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  saveCart();
  renderCart();
  alert("Gracias por tu compra en TECHSTORE.");
  toggleDrawer("cart-drawer", false);
});


const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));

const params = new URLSearchParams(location.search);
const q = (params.get("q") || "").trim().toLowerCase();
if (document.getElementById("product-grid")) {
  const list = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  renderProducts(list);
  if (q) document.getElementById("search-input").value = params.get("q");
}
renderOffers();
renderCart();
