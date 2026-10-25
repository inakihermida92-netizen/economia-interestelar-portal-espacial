/* Catálogo de muestra. Reemplazar por recursos propios.
   Cada producto requiere derechos confirmados (rights: true) antes de publicarse.
   DEMO: datos de demostración sin archivos reales. */
const PRODUCTS = [
  { id: "p01", name: "Nebulosa Índigo", artist: "Artista provisional", category: "Láminas", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p02", name: "Luna Cobalto", artist: "Artista provisional", category: "Figuras", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p03", name: "Estación Delta", artist: "Artista provisional", category: "Modelos 3D", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p04", name: "Anillo Solar", artist: "Artista provisional", category: "Láminas", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p05", name: "Cometa Violeta", artist: "Artista provisional", category: "Figuras", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p06", name: "Planeta Ámbar", artist: "Artista provisional", category: "Modelos 3D", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p07", name: "Vía Láctea Lunar", artist: "Artista provisional", category: "Láminas", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p08", name: "Satélite Nova", artist: "Artista provisional", category: "Figuras", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p09", name: "Órbita Carmesí", artist: "Artista provisional", category: "Modelos 3D", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p10", name: "Pulsar Aurora", artist: "Artista provisional", category: "Láminas", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p11", name: "Constelación Gris", artist: "Artista provisional", category: "Figuras", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p12", name: "Cúmulo Esmeralda", artist: "Artista provisional", category: "Modelos 3D", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p13", name: "Quásar Zafiro", artist: "Artista provisional", category: "Láminas", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p14", name: "Agujero Lila", artist: "Artista provisional", category: "Figuras", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true },
  { id: "p15", name: "Puerto Estelar", artist: "Artista provisional", category: "Modelos 3D", price: "[precio]", desc: "[Descripción provisional]", image: "", glb: "", rights: false, published: true }
];

const CONFIG = {
  salesEnabled: false,       // Solo tras autorización escrita.
  paypalUrl: "",             // Enlace de PayPal del titular; vacío = sin redirección.
  showPrices: true,
  discordInvite: "",         // Enlace configurable; no inventar.
  perPage: 15
};

const state = { page: 1, query: "", category: "", artist: "" };
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Portal */
(function portal() {
  const portalEl = $("#portal");
  const enter = $("[data-enter]");
  const skip = $("[data-skip-intro]");
  const video = $("[data-portal-video]");
  if (!portalEl) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (video && reduce) video.pause();
  const finish = () => { portalEl.classList.add("is-gone"); portalEl.setAttribute("aria-hidden", "true"); };
  const go = () => {
    if (reduce) { finish(); return; }
    portalEl.classList.add("is-leaving");
    portalEl.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 1000);
  };
  enter?.addEventListener("click", go);
  skip?.addEventListener("click", finish);
  $("[data-admin-toggle]")?.addEventListener("click", () => $(".admin").toggleAttribute("hidden"));
})();

/* Station menu */
(function station() {
  const wrap = $("[data-station]");
  const toggle = $("[data-station-toggle]");
  const menu = $("[data-station-menu]");
  if (!wrap || !toggle || !menu) return;
  const set = (open) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  };
  toggle.addEventListener("click", () => set(menu.hidden));
  wrap.addEventListener("mouseenter", () => set(true));
  wrap.addEventListener("mouseleave", () => set(false));
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); toggle.focus(); } });
  $$("[data-route]").forEach((a) => a.addEventListener("click", () => { set(false); show(a.dataset.route); }));
  set(false);
})();

/* Views */
function show(view) {
  $$("[data-view]").forEach((v) => { v.hidden = v.dataset.view !== view; });
  if (view === "tienda") render();
}
window.addEventListener("hashchange", () => show((location.hash || "#tienda").slice(1)));
show((location.hash || "#tienda").slice(1));

/* Catalog */
function filtered() {
  const q = state.query.toLowerCase();
  return PRODUCTS.filter((p) => p.published
    && (!q || p.name.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q))
    && (!state.category || p.category === state.category)
    && (!state.artist || p.artist === state.artist));
}

function fillFilters() {
  const cat = $("[data-filter-category]");
  const art = $("[data-filter-artist]");
  [...new Set(PRODUCTS.map((p) => p.category))].forEach((c) => cat.insertAdjacentHTML("beforeend", `<option>${c}</option>`));
  [...new Set(PRODUCTS.map((p) => p.artist))].forEach((a) => art.insertAdjacentHTML("beforeend", `<option>${a}</option>`));
}

function cardHTML(p) {
  const img = p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">` : "";
  const price = CONFIG.showPrices ? `<span class="card-price">${p.price}</span>` : "";
  const buy = CONFIG.salesEnabled
    ? `<button type="button" data-add="${p.id}">Agregar al carrito</button>`
    : `<button type="button" data-availability="${p.id}">Consultar disponibilidad</button>`;
  return `<li class="card" data-id="${p.id}">
    <button class="card-button" type="button" aria-expanded="false" aria-controls="actions-${p.id}">
      <span class="card-media">${img}</span>
      <span class="card-name">${p.name}</span>
      <span class="card-extra">${p.artist}<br>${price}</span>
      <span class="card-orbits" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <div class="card-actions" id="actions-${p.id}" hidden>
      <a href="#pieza" data-view-piece="${p.id}">Ver pieza</a>
      ${buy}
      <button type="button" data-support="${p.id}">Apoyar al artista</button>
      <button type="button" class="card-close" data-close-actions>Cerrar</button>
    </div>
  </li>`;
}

function render() {
  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / CONFIG.perPage));
  state.page = Math.min(state.page, pages);
  const slice = list.slice((state.page - 1) * CONFIG.perPage, state.page * CONFIG.perPage);
  const catalog = $("[data-catalog]");
  catalog.innerHTML = slice.map(cardHTML).join("");
  $("[data-catalog-status]").textContent = list.length
    ? `${list.length} piezas · página ${state.page} de ${pages}`
    : "No hay piezas con esos filtros.";
  renderPager(pages);
}

function renderPager(pages) {
  const pager = $("[data-pager]");
  if (pages <= 1) { pager.innerHTML = ""; return; }
  let html = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="Página anterior">←</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button type="button" data-page="${i}" ${i === state.page ? 'aria-current="page"' : ""}>${i}</button>`;
  }
  html += `<button type="button" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""} aria-label="Página siguiente">→</button>`;
  pager.innerHTML = html;
}

(function catalogEvents() {
  const catalog = $("[data-catalog]");
  if (!catalog) return;
  fillFilters();
  $("[data-search]").addEventListener("input", (e) => { state.query = e.target.value; state.page = 1; render(); });
  $("[data-filter-category]").addEventListener("change", (e) => { state.category = e.target.value; state.page = 1; render(); });
  $("[data-filter-artist]").addEventListener("change", (e) => { state.artist = e.target.value; state.page = 1; render(); });
  $("[data-pager]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-page]");
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page);
    render();
    window.scrollTo({ top: $("#tienda").offsetTop, behavior: "smooth" });
  });
  catalog.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const actionsEl = $("#actions-" + card.dataset.id);
    if (e.target.closest(".card-button")) {
      const open = actionsEl.hidden;
      $$(".card-actions").forEach((el) => { el.hidden = true; });
      $$(".card-button").forEach((b) => b.setAttribute("aria-expanded", "false"));
      actionsEl.hidden = !open;
      card.querySelector(".card-button").setAttribute("aria-expanded", String(open));
      card.classList.toggle("is-active", open);
    }
    if (e.target.closest("[data-close-actions]")) { actionsEl.hidden = true; card.classList.remove("is-active"); }
    const vp = e.target.closest("[data-view-piece]");
    if (vp) { e.preventDefault(); openProduct(vp.dataset.viewPiece); }
    const av = e.target.closest("[data-availability]");
    if (av) { $("[data-catalog-status]").textContent = "Consulta de disponibilidad enviada (demo). Las compras están desactivadas."; }
    const sp = e.target.closest("[data-support]");
    if (sp) { $("[data-catalog-status]").textContent = "Apoyo al artista: canal pendiente de configuración."; }
  });
  render();
})();

/* Product page */
function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  $("[data-product-name]").textContent = p.name;
  $("[data-product-artist]").textContent = p.artist;
  $("[data-product-desc]").textContent = p.desc;
  const price = $("[data-product-price]");
  price.textContent = p.price;
  price.hidden = !CONFIG.showPrices;
  const model = $("[data-model]");
  const fallback = $("[data-viewer-fallback]");
  const msg = $("[data-viewer-message]");
  if (p.glb) { model.setAttribute("src", p.glb); model.hidden = false; msg.hidden = true; }
  else { model.hidden = true; msg.hidden = false; }
  if (p.image) { fallback.src = p.image; fallback.alt = p.name; fallback.hidden = !!p.glb; }
  else { fallback.hidden = true; }
  const actions = $("[data-product-actions]");
  actions.innerHTML = CONFIG.salesEnabled && CONFIG.paypalUrl
    ? `<a class="button button-primary" href="${CONFIG.paypalUrl}" target="_blank" rel="noopener">Pagar con PayPal</a>`
    : `<button class="button button-secondary" type="button" disabled>Compra no disponible</button>`;
  show("pieza");
  window.scrollTo(0, 0);
}
$("[data-back]")?.addEventListener("click", () => { location.hash = "#tienda"; });

/* Discord */
(function discord() {
  const link = $("[data-discord]");
  const note = $("[data-discord-note]");
  if (!link) return;
  if (CONFIG.discordInvite) { link.href = CONFIG.discordInvite; link.hidden = false; note.textContent = "Invitación configurada."; }
})();

/* Admin */
(function admin() {
  const sales = $("[data-admin-sales]");
  if (!sales) return;
  sales.checked = CONFIG.salesEnabled;
  sales.addEventListener("change", () => { CONFIG.salesEnabled = sales.checked; render(); });
  $("[data-admin-price]").checked = CONFIG.showPrices;
  $("[data-admin-price]").addEventListener("change", (e) => { CONFIG.showPrices = e.target.checked; render(); });
  $("[data-admin-discord]").addEventListener("change", (e) => { CONFIG.discordInvite = e.target.value; });
})();

/* Parallax discreto del fondo */
(function parallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slow = (navigator.hardwareConcurrency || 4) <= 2;
  if (reduce || slow) { document.documentElement.classList.add("is-static-bg"); return; }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--parallax", `${-window.scrollY * 0.08}px`);
      ticking = false;
    });
  }, { passive: true });
})();