/* ==========================================================================
   Artesanatos da Mi Pinho — interações da área pública (loja)
   ========================================================================== */

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl = n => "R$ " + Number(n || 0).toFixed(2).replace(".", ",");
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const num = v => { const n = parseFloat(String(v ?? "").replace(",", ".")); return isFinite(n) ? n : null; };
const fotosDe = p => Array.isArray(p.fotos) && p.fotos.length ? p.fotos : (p.foto ? [p.foto] : []);
const QS = () => (typeof window.__SEARCH === "string" ? window.__SEARCH : location.search);
const fotoUrl = f => (window.__FOTO && window.__FOTO[f]) || ("img/" + encodeURIComponent(f));
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C5 15.500 3 11.500 3 8.500A4.500 4.500 0 0 1 7.500 4C9.500 4 11 5 12 6.800 13 5 14.500 4 16.500 4A4.500 4.500 0 0 1 21 8.500c0 3-2 7-9 12.500z"/></svg>';

// foto que nao carrega (ainda nao foi enviada ao GitHub): volta para o icone
document.addEventListener("error", e => {
  const t = e.target;
  if(t && t.tagName === "IMG" && t.classList.contains("foto")){
    const holder = t.parentElement;
    t.remove();
    if(holder && !holder.querySelector("svg")) holder.insertAdjacentHTML("beforeend", icon(t.dataset.icon || "flower"));
  }
}, true);


/* enfeites da coleção de Natal (só aparecem nela) */
const NATAL_TREE = `<svg viewBox="0 0 100 135" aria-hidden="true"><polygon points="50,6 54,17 66,18 57,26 60,38 50,31 40,38 43,26 34,18 46,17" fill="#FFD166"/><path d="M50 22 L78 58 H62 L86 92 H66 L94 124 H6 L34 92 H14 L38 58 H22 Z" fill="#1E8A5C" stroke="#0C3F2D" stroke-width="2.500" stroke-linejoin="round"/><path d="M50 22 L22 58 H38 L14 92 H34 L6 124" fill="none" stroke="#2FB57F" stroke-width="2" opacity=".55"/><rect x="43" y="124" width="14" height="11" rx="2" fill="#7A4A2B"/><circle cx="44" cy="52" r="4.500" fill="#ff5a5f"/><circle cx="60" cy="74" r="4.500" fill="#FFD166"/><circle cx="36" cy="84" r="4.500" fill="#fff3d6"/><circle cx="68" cy="108" r="4.500" fill="#ff5a5f"/><circle cx="30" cy="112" r="4.500" fill="#FFD166"/><circle cx="52" cy="98" r="4" fill="#ff5a5f"/><circle cx="52" cy="38" r="3.500" class="tw" fill="#fff3d6"/><circle cx="40" cy="66" r="3" class="tw tw2" fill="#FFD166"/><circle cx="64" cy="90" r="3" class="tw" fill="#fff3d6"/><circle cx="24" cy="100" r="3" class="tw tw2" fill="#fff3d6"/></svg>`;
const NATAL_GIFT = (a, b) => `<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="6" y="22" width="48" height="34" rx="4" fill="${a}" stroke="#0C3F2D" stroke-width="2.500"/><rect x="25" y="22" width="10" height="34" fill="${b}"/><rect x="6" y="34" width="48" height="9" fill="${b}" opacity=".9"/><path d="M30 22c-4-12-18-12-14-4 2 4 10 4 14 4zM30 22c4-12 18-12 14-4-2 4-10 4-14 4z" fill="none" stroke="${b}" stroke-width="3.500" stroke-linejoin="round"/></svg>`;
const NATAL_BALL = (c) => `<svg viewBox="0 0 40 70" aria-hidden="true"><path d="M20 0v26" stroke="#F8D98A" stroke-width="1.500"/><rect x="15" y="24" width="10" height="7" rx="2" fill="#F8D98A"/><circle cx="20" cy="46" r="15" fill="${c}" stroke="#0C3F2D" stroke-width="2"/><path d="M9 44c4-9 11-12 18-9" fill="none" stroke="#fff" stroke-width="2.500" stroke-linecap="round" opacity=".65"/><path d="M6 48c9 6 19 6 28 0" fill="none" stroke="#F8D98A" stroke-width="2" opacity=".9"/></svg>`;
const NATAL_CANE = `<svg viewBox="0 0 40 80" aria-hidden="true"><path d="M12 76V26a13 13 0 0 1 26 0" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M12 76V26a13 13 0 0 1 26 0" fill="none" stroke="#e63946" stroke-width="10" stroke-linecap="round" stroke-dasharray="7 9"/></svg>`;
const NATAL_DECO = `<div class="deco" aria-hidden="true">
  <div class="ball b1">${NATAL_BALL("#e63946")}</div><div class="ball b2">${NATAL_BALL("#FFD166")}</div><div class="ball b3">${NATAL_BALL("#6fe3a1")}</div><div class="ball b4">${NATAL_BALL("#e63946")}</div><div class="ball b5">${NATAL_BALL("#fff3d6")}</div>
  <div class="tree t1">${NATAL_TREE}</div><div class="tree t2">${NATAL_TREE}</div>
  <div class="gift g1">${NATAL_GIFT("#e63946", "#FFD166")}</div><div class="gift g2">${NATAL_GIFT("#FFD166", "#e63946")}</div>
  <div class="gift g3">${NATAL_GIFT("#fff3d6", "#1E8A5C")}</div><div class="gift g4">${NATAL_GIFT("#e63946", "#fff3d6")}</div>
</div>`;

function toast(msg){
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

/* animações de entrada ao rolar (desligadas se a pessoa prefere menos movimento) */
let _io = null;
function reveal(){
  try{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    if(!_io) _io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); _io.unobserve(e.target); } }), {threshold:.08, rootMargin:"0px 0px -30px 0px"});
    document.querySelectorAll(".section-head,.product-card,.step,.testi-card,.cat-bubble,.faq-item,.info-card,.video-wrap,.about-photo,.insta-grid .cell").forEach(el => {
      if(el.classList.contains("rv")) return;
      el.classList.add("rv"); _io.observe(el);
    });
  }catch(e){ document.documentElement.classList.remove("js-reveal"); }
}

let TEXTOS = {};
const T = (k, d) => (TEXTOS[k] != null && String(TEXTOS[k]).trim() !== "" ? TEXTOS[k] : d);
// converte **negrito**, [texto](link) e quebras de linha em HTML seguro
function fmt(t){
  let h = esc(String(t));
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => /^(https?:|mailto:|tel:|#|[\w./?=&%-]+$)/.test(u) ? `<a href="${u}">${a}</a>` : a);
  return h.replace(/\n/g, "<br>");
}
function aplicaTextos(){
  document.querySelectorAll("[data-t]").forEach(el => {
    const v = TEXTOS[el.dataset.t];
    if(v == null || String(v).trim() === "") return;
    if(el.hasAttribute("data-m")) el.innerHTML = fmt(v); else el.textContent = v;
  });
  document.querySelectorAll("[data-tp]").forEach(el => { const v = TEXTOS[el.dataset.tp]; if(v) el.setAttribute("placeholder", v); });
  const pg = document.body.dataset.page;
  const t = pg && TEXTOS["seo." + pg + ".title"], d = pg && TEXTOS["seo." + pg + ".desc"];
  if(t) document.title = t;
  if(d){ const m = document.querySelector('meta[name="description"]'); if(m) m.setAttribute("content", d); }
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  const settings = getSettings();
  TEXTOS = settings.textos || {};
  aplicaTextos();
  document.querySelectorAll("[data-brand-name]").forEach(el => { el.textContent = settings.brand; });
  const cats = getCategories();
  const products = getProducts();
  const colecoes = (settings.colecoes || []).filter(c => c.ativa !== false);
  updateCartBadge(); updateFavBadge();

  const catDe = p => cats.find(c => c.id === p.categoria);
  const iconeDe = p => (catDe(p) || {}).icon || "flower";
  const thumbHTML = p => {
    const f = fotosDe(p)[0];
    return f
      ? `<img class="foto" src="${fotoUrl(f)}" alt="${esc(p.nome)}" loading="lazy" data-icon="${iconeDe(p)}">`
      : icon(iconeDe(p));
  };
  const waProduto = p => waLink(settings.whatsapp, `Olá, Mi! Vi a peça ${p.nome} no site ${settings.brand} e queria saber quando ela volta ao estoque.`);

  // ---- textos e links que vêm das configurações ----
  document.querySelectorAll("[data-wa-float],[data-wa-generic]").forEach(el => { el.href = waLink(settings.whatsapp, settings.whatsappMsgPadrao); });
  document.querySelectorAll("[data-insta-link]").forEach(el => { el.href = `https://instagram.com/${settings.instagram}`; });
  document.querySelectorAll("[data-insta-handle]").forEach(el => { el.textContent = "@" + settings.instagram; });
  document.querySelectorAll("[data-brand-name]").forEach(el => { el.textContent = settings.brand; });
  document.querySelectorAll("[data-brand-slogan]").forEach(el => { el.textContent = settings.slogan; });
  document.querySelectorAll("[data-store-email]").forEach(el => { el.textContent = settings.email; });
  document.querySelectorAll("[data-store-cidade]").forEach(el => { el.textContent = settings.cidade; });
  document.querySelectorAll("[data-store-horario]").forEach(el => { el.textContent = settings.horario; });


  // ---- como encomendar e perguntas frequentes (listas editáveis) ----
  const passosEl = document.querySelector("[data-passos]");
  if(passosEl && (settings.passos || []).length){
    passosEl.innerHTML = settings.passos.map((s, i) => `<div class="step"><div class="num">${i + 1}</div><h4>${esc(s.titulo)}</h4><p>${esc(s.texto)}</p></div>`).join("");
  }
  const faqEl = document.querySelector("[data-faq]");
  if(faqEl && (settings.faq || []).length){
    faqEl.innerHTML = settings.faq.map((f, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(f.pergunta)}</summary><p>${fmt(f.resposta)}</p></details>`).join("");
  }

  // ---- faixa de aviso no topo ----
  try{
    if(settings.faixaAtiva && settings.faixaTexto && !sessionStorage.getItem("mipinho-faixa-off")){
      const bar = document.createElement("div");
      bar.className = "announce";
      const txt = esc(settings.faixaTexto);
      bar.innerHTML = (settings.faixaLink ? `<a href="${esc(settings.faixaLink)}">${txt}</a>` : `<span>${txt}</span>`) + `<button class="x" type="button" aria-label="Fechar aviso">✕</button>`;
      bar.querySelector(".x").addEventListener("click", () => { bar.remove(); try{ sessionStorage.setItem("mipinho-faixa-off", "1"); }catch(e){} });
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }catch(e){}

  // ---- menu do celular ----
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.main-nav");
  if(toggle && nav){
    const setMenu = open => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", e => { if(e.key === "Escape") setMenu(false); });
  }

  // ---- categorias (home) ----
  const catGrid = document.querySelector("[data-cat-grid]");
  if(catGrid){
    const colorClasses = ["c1", "c2", "c3"];
    catGrid.innerHTML = cats.slice(0, 10).map((c, i) => `
      <a class="cat-bubble" href="catalogo.html?categoria=${encodeURIComponent(c.id)}">
        <div class="blob-ico ${colorClasses[i % 3]}">${icon(c.icon)}</div>
        <span>${esc(c.nome)}</span>
      </a>`).join("");
  }

  // ---- card de produto ----
  function productCard(p){
    const sold = !!p.esgotado;
    const badge = sold ? '<span class="tag sold">${T("app.esgotado",T("app.esgotado","Esgotado"))}</span>'
                : p.lancamento ? '<span class="tag">${T("app.lancamento","Lançamento")}</span>'
                : p.maisVendido ? '<span class="tag alt">${T("app.maisvendido","Mais vendido")}</span>'
                : p.destaque ? '<span class="tag">${T("app.destaque","Destaque")}</span>' : "";
    const statusLabel = sold ? T("app.esgotado","Esgotado") : (p.status === "pronta" ? T("app.pronta","Pronta entrega") : T("app.sobenc","Sob encomenda"));
    const varias = (p.cores || []).length > 1;
    const action = sold
      ? `<a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${waProduto(p)}">${T("app.avise","Avise-me")}</a>`
      : varias
        ? `<a class="btn btn-primary btn-sm" href="produto.html?id=${encodeURIComponent(p.id)}">${T("app.escolhercor","Escolher cor")}</a>`
        : `<button class="btn btn-primary btn-sm" type="button" data-add="${esc(p.id)}" data-cor="${esc((p.cores || [])[0] || "")}">${T("app.adicionar","Adicionar")}</button>`;
    const fav = isFav(p.id);
    return `
    <article class="product-card ${sold ? "sold" : ""}">
      <div class="thumb-box">
        <a class="thumb" href="produto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${esc(p.nome)}">${badge}${thumbHTML(p)}</a>
        <button class="fav-btn" type="button" data-fav="${esc(p.id)}" aria-pressed="${fav}" aria-label="Favoritar ${esc(p.nome)}">${HEART}</button>
      </div>
      <div class="body">
        <span class="cat">${esc((catDe(p) || {}).nome || p.categoria)}</span>
        <h4><a href="produto.html?id=${encodeURIComponent(p.id)}">${esc(p.nome)}</a></h4>
        <div class="price-row"><span class="price">${brl(p.preco)}</span><span class="status">${statusLabel}</span></div>
        <div class="actions">
          <a class="btn btn-outline btn-sm view" href="produto.html?id=${encodeURIComponent(p.id)}">${T("app.verpeca","Ver peça")}</a>
          ${action}
        </div>
      </div>
    </article>`;
  }

  function flash(btn, texto){
    if(!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.textContent = texto || T("app.adicionado","Adicionado ✓");
    btn.classList.add("done");
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove("done"); }, 1500);
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-add]");
    if(b){ addToCart(b.dataset.add, b.dataset.cor || "", 1); flash(b); return; }
    const f = e.target.closest("[data-fav]");
    if(f){
      const on = toggleFav(f.dataset.fav);
      document.querySelectorAll(`[data-fav="${CSS.escape(f.dataset.fav)}"]`).forEach(x => {
        x.setAttribute("aria-pressed", String(on));
        if(x.dataset.favLabel != null) x.innerHTML = on ? T("app.nosfav","♥ Nos favoritos") : T("app.favoritar","♡ Favoritar");
      });
      f.classList.remove("pop"); void f.offsetWidth; f.classList.add("pop");
      toast(on ? T("app.favon","Adicionado aos favoritos") : T("app.favoff","Removido dos favoritos"));
      if(document.querySelector("[data-fav-root]") && !on) renderFavs();
    }
  });

  // ---- destaques (home) ----
  const featGrid = document.querySelector("[data-featured-grid]");
  if(featGrid) featGrid.innerHTML = products.filter(p => p.destaque).slice(0, 6).map(productCard).join("");

  // ---- coleções especiais (home) ----
  const colRoot = document.querySelector("[data-colecoes-root]");
  if(colRoot){
    colRoot.innerHTML = colecoes.map(c => {
      const ps = products.filter(p => p.colecao === c.id).slice(0, 4);
      if(!ps.length) return "";
      const natal = /natal/i.test(c.id + " " + c.nome);
      return `<section class="colecao ${natal ? "natal" : ""}">${natal ? '<div class="lights" aria-hidden="true"></div><div class="snow" aria-hidden="true"></div>' + NATAL_DECO : ""}<div class="container">
        <div class="section-head"><span class="eyebrow-hand">${natal ? "feliz natal ✦ ponto por ponto" : "edição especial"}</span><h2>${esc(c.nome)}</h2><p>${esc(c.descricao || "")}</p></div>
        <div class="product-grid">${ps.map(productCard).join("")}</div>
        <div style="text-align:center;margin-top:34px;"><a class="btn btn-outline" href="catalogo.html?colecao=${encodeURIComponent(c.id)}">Ver coleção completa</a></div>
      </div></section>`;
    }).join("");
  }

  document.querySelectorAll(".colecao.natal").forEach(sec => {
    const lights = sec.querySelector(".lights"), snow = sec.querySelector(".snow");
    const n = Math.max(10, Math.round((sec.clientWidth || 390) / 34));
    if(lights) lights.innerHTML = Array.from({length: n}, (_, i) => `<span style="--d:${(i * 0.37).toFixed(2)}s;--y:${i % 2 ? 9 : 0}px"></span>`).join("");
    if(snow) snow.innerHTML = Array.from({length: 22}, (_, i) => {
      const s = 3 + (i * 7) % 6, l = (i * 47) % 100, du = 7 + (i * 5) % 8, de = -((i * 3) % 10);
      return `<i style="left:${l}%;width:${s}px;height:${s}px;animation-duration:${du}s;animation-delay:${de}s"></i>`;
    }).join("");
  });

  // ---- vídeo (home) ----
  const vidSec = document.querySelector("[data-video-section]");
  if(vidSec){
    const url = String(settings.videoUrl || "").trim();
    const box = vidSec.querySelector("[data-video-box]");
    let html = "";
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);
    if(yt) html = `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="Vídeo da ${esc(settings.brand)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    else if(/\.(mp4|webm)(\?|$)/i.test(url)) html = `<video controls playsinline preload="metadata" src="${esc(url)}"></video>`;
    if(html){ box.innerHTML = html; vidSec.hidden = false; }
  }

  // ---- galeria, foto da Mi e depoimentos (home e sobre) ----
  const galeria = (settings.galeria || []).filter(Boolean);
  const instaFill = document.querySelector("[data-insta-grid-fill]");
  if(instaFill && galeria.length){
    instaFill.innerHTML = galeria.slice(0, 8).map(g => `<div class="cell"><img src="${fotoUrl(g)}" alt="Bastidores do ateliê" loading="lazy"></div>`).join("");
  }
  if(settings.fotoMi){
    document.querySelectorAll(".about-photo").forEach(el => { el.innerHTML = `<img src="${fotoUrl(settings.fotoMi)}" alt="Michele, a artesã" loading="lazy">`; });
  }
  const testi = document.querySelector(".testi-grid");
  if(testi && Array.isArray(settings.depoimentos) && settings.depoimentos.length){
    testi.innerHTML = settings.depoimentos.slice(0, 6).map(d => {
      const n = Math.max(1, Math.min(5, Number(d.estrelas) || 5));
      return `<div class="testi-card"><div class="stars" aria-label="${n} de 5 estrelas">${"★".repeat(n)}${"☆".repeat(5 - n)}</div><p>"${esc(d.texto)}"</p><div class="who">${esc(d.nome)}, cliente</div></div>`;
    }).join("");
  }

  // ---- dados para buscadores (home) ----
  if(document.querySelector("[data-featured-grid]")){
    try{
      const ld = {"@context":"https://schema.org","@type":"LocalBusiness",name:settings.brand,description:settings.slogan,
        address:{"@type":"PostalAddress",addressLocality:settings.cidade},telephone:"+" + String(settings.whatsapp || "").replace(/\D/g, ""),
        sameAs:[`https://instagram.com/${settings.instagram}`]};
      const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
    }catch(e){}
  }

  // ---- catálogo: filtro por categoria/coleção, busca e ordem ----
  const catalogGrid = document.querySelector("[data-catalog-grid]");
  if(catalogGrid){
    const params = new URLSearchParams(QS());
    let activeCat = params.get("colecao") ? "col:" + params.get("colecao") : (params.get("categoria") || "todas");
    const filterBar = document.querySelector("[data-filters]");
    const search = document.querySelector("[data-search]");
    const sort = document.querySelector("[data-sort]");
    const count = document.querySelector("[data-count]");
    const colsComPeca = colecoes.filter(c => products.some(p => p.colecao === c.id));

    function renderFilters(){
      const chips = [{id: "todas", nome: "Todas"}, ...colsComPeca.map(c => ({id: "col:" + c.id, nome: (/natal/i.test(c.id + c.nome) ? "🎄 " : "✨ ") + c.nome})), ...cats];
      filterBar.innerHTML = chips.map(c =>
        `<button class="chip ${c.id === activeCat ? "active" : ""}" type="button" data-filter="${esc(c.id)}">${esc(c.nome)}</button>`).join("");
      filterBar.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
        activeCat = btn.dataset.filter; renderFilters(); renderGrid();
      }));
    }
    function renderGrid(){
      let list = products.slice();
      if(activeCat.startsWith("col:")) list = list.filter(p => p.colecao === activeCat.slice(4));
      else if(activeCat !== "todas") list = list.filter(p => p.categoria === activeCat);
      const q = norm(search ? search.value : "").trim();
      if(q) list = list.filter(p => norm(`${p.nome} ${p.desc} ${(catDe(p) || {}).nome || ""}`).includes(q));
      const ord = sort ? sort.value : "";
      if(ord === "menor") list.sort((a, b) => a.preco - b.preco);
      else if(ord === "maior") list.sort((a, b) => b.preco - a.preco);
      else if(ord === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      if(count) count.textContent = list.length === 1 ? "1 peça" : `${list.length} peças`;
      catalogGrid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p style="grid-column:1/-1;text-align:center;color:var(--plum-soft)">${T("app.nenhuma","Nenhuma peça encontrada. Fale com a Mi, ela pode fazer sob encomenda.")}</p>`;
      reveal();
    }
    if(filterBar) renderFilters();
    if(search) search.addEventListener("input", renderGrid);
    if(sort) sort.addEventListener("change", renderGrid);
    renderGrid();
  }

  // ---- favoritos ----
  function renderFavs(){
    const root = document.querySelector("[data-fav-root]"); if(!root) return;
    const ps = readFavs().map(id => products.find(p => p.id === id)).filter(Boolean);
    if(!ps.length){
      root.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 21C5 15.500 3 11.500 3 8.500A4.500 4.500 0 0 1 7.500 4C9.500 4 11 5 12 6.800 13 5 14.500 4 16.500 4A4.500 4.500 0 0 1 21 8.500c0 3-2 7-9 12.500z"/></svg>
        <h2>Nenhum favorito ainda</h2><p style="color:var(--plum-soft)">Toque no coração das peças que você amou e elas ficam guardadas aqui.</p>
        <a class="btn btn-primary" href="catalogo.html">${T("app.vercatalogo","Ver o catálogo")}</a></div>`;
      return;
    }
    const msg = `Olá, Mi! Estas são as peças que mais gostei no site ${settings.brand}:\n\n` + ps.map(p => `• ${p.nome} (${brl(p.preco)})`).join("\n") + "\n\nPode me ajudar a escolher?";
    root.innerHTML = `<div class="product-grid">${ps.map(productCard).join("")}</div>
      <div style="text-align:center;margin-top:34px;"><a class="btn btn-whats" target="_blank" rel="noopener" href="${waLink(settings.whatsapp, msg)}">Enviar minha lista para a Mi</a></div>`;
    reveal();
  }
  renderFavs();

  // ---- página de produto ----
  const pdp = document.querySelector("[data-pdp]");
  if(pdp){
    const id = new URLSearchParams(QS()).get("id");
    const p = products.find(x => x.id === id);
    const root = document.querySelector("[data-pdp-root]");
    if(!p){
      root.innerHTML = `<div class="empty-state"><h2>Peça não encontrada</h2><p>Ela pode ter saído do catálogo.</p><a class="btn btn-primary" href="catalogo.html">${T("app.vercatalogo","Ver o catálogo")}</a></div>`;
    }else{
      const q = sel => document.querySelector(sel);
      const sold = !!p.esgotado;
      document.title = `${p.nome} · ${settings.brand}`;
      const md = document.querySelector('meta[name="description"]'); if(md) md.setAttribute("content", `${p.nome} em crochê feito à mão. ${p.desc || ""}`.trim());
      q("[data-pdp-crumb]").innerHTML = `<a href="index.html">Início</a> / <a href="catalogo.html">Catálogo</a> / ${esc(p.nome)}`;
      q("[data-pdp-cat]").textContent = (catDe(p) || {}).nome || p.categoria;
      q("[data-pdp-nome]").textContent = p.nome;
      q("[data-pdp-preco]").textContent = brl(p.preco);
      q("[data-pdp-desc]").textContent = p.desc || "";
      q("[data-pdp-status]").textContent = sold ? T("app.esgotadomomento","Esgotado no momento") : (p.status === "pronta" ? T("app.pronta","Pronta entrega") : T("app.sobenc","Sob encomenda"));
      q("[data-pdp-prazo]").textContent = p.prazo || "A combinar";
      q("[data-pdp-tamanho]").textContent = p.tamanho || "A combinar";
      q("[data-pdp-person]").textContent = p.personalizavel ? T("app.personaliza","Aceita personalização") : T("app.padrao","Peça padrão");
      const longo = (p.descLonga || p.desc || "").split(/\n+/).filter(Boolean);
      q("[data-pdp-long]").innerHTML = longo.map(t => `<p>${esc(t)}</p>`).join("");

      // galeria com zoom
      const fotos = fotosDe(p);
      const main = q("[data-pdp-main]");
      const thumbs = q("[data-pdp-thumbs]");
      let fotoAtual = 0;
      const showFoto = i => {
        fotoAtual = i;
        main.innerHTML = `<img class="foto" src="${fotoUrl(fotos[i])}" alt="${esc(p.nome)}" data-icon="${iconeDe(p)}">`;
        thumbs.querySelectorAll(".th").forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
      };
      if(fotos.length){
        if(fotos.length > 1){
          thumbs.innerHTML = fotos.map((f, i) =>
            `<button class="th" type="button" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${fotoUrl(f)}" alt=""></button>`).join("");
          thumbs.addEventListener("click", e => { const b = e.target.closest(".th"); if(b) showFoto(Number(b.dataset.i)); });
        }
        showFoto(0);
        main.addEventListener("click", () => {
          const lb = document.createElement("div");
          lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Foto ampliada");
          lb.innerHTML = `<img src="${fotoUrl(fotos[fotoAtual])}" alt="${esc(p.nome)}"><button class="x" type="button" aria-label="Fechar">✕</button>`;
          const close = () => { lb.remove(); document.removeEventListener("keydown", onKey); };
          const onKey = e => { if(e.key === "Escape") close(); };
          lb.addEventListener("click", close); document.addEventListener("keydown", onKey);
          document.body.appendChild(lb);
        });
      }else{
        main.innerHTML = icon(iconeDe(p));
      }

      // favoritar e compartilhar
      const favBtn = q("[data-pdp-fav]");
      if(favBtn){
        favBtn.dataset.fav = p.id; favBtn.dataset.favLabel = "1";
        const on = isFav(p.id);
        favBtn.setAttribute("aria-pressed", String(on));
        favBtn.innerHTML = on ? T("app.nosfav","♥ Nos favoritos") : T("app.favoritar","♡ Favoritar");
      }
      const shareBtn = q("[data-pdp-share]");
      if(shareBtn) shareBtn.addEventListener("click", async () => {
        const url = /^https?:/.test(location.href) ? location.href : "";
        const texto = `Olha que linda essa peça da ${settings.brand}: ${p.nome} (${brl(p.preco)})`;
        try{
          if(navigator.share){ await navigator.share({title: p.nome, text: texto, url}); return; }
        }catch(e){ if(e && e.name === "AbortError") return; }
        window.open(`https://wa.me/?text=${encodeURIComponent(texto + (url ? "\n" + url : ""))}`, "_blank");
      });

      // cor e quantidade
      const cores = p.cores || [];
      let cor = cores[0] || "";
      let qtd = 1;
      const coresWrap = q("[data-pdp-cores-wrap]");
      const qtyWrap = q("[data-pdp-qty-wrap]");
      const wa = q("[data-pdp-wa]");
      const addBtn = q("[data-pdp-add]");
      let atualizaWa = () => {};
      if(cores.length && !sold){
        const box = q("[data-pdp-cores]");
        box.innerHTML = cores.map((c, i) => `<button class="color-chip" type="button" aria-pressed="${i === 0}" data-cor="${esc(c)}">${esc(c)}</button>`).join("");
        box.addEventListener("click", e => {
          const b = e.target.closest(".color-chip"); if(!b) return;
          cor = b.dataset.cor;
          box.querySelectorAll(".color-chip").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          atualizaWa();
        });
      }else{ coresWrap.hidden = true; }

      if(sold){
        qtyWrap.hidden = true; addBtn.hidden = true;
        wa.textContent = "Avise-me quando voltar"; wa.href = waProduto(p);
        const sb = q("[data-pdp-sold]"); if(sb) sb.hidden = false;
      }else{
        const out = q("[data-pdp-qtd]");
        q("[data-pdp-minus]").addEventListener("click", () => { qtd = Math.max(1, qtd - 1); out.textContent = qtd; atualizaWa(); });
        q("[data-pdp-plus]").addEventListener("click", () => { qtd = Math.min(20, qtd + 1); out.textContent = qtd; atualizaWa(); });
        atualizaWa = () => {
          const extra = `${cor ? `\nCor: ${cor}` : ""}\nQuantidade: ${qtd}`;
          wa.href = waLink(settings.whatsapp, `Olá, Mi! Vi o produto ${p.nome} no site ${settings.brand} e gostaria de saber mais sobre ele.${extra}`);
        };
        atualizaWa();
        addBtn.addEventListener("click", () => { addToCart(p.id, cor, qtd); flash(addBtn, T("app.adicionado","Adicionado ✓")); });
      }

      const related = q("[data-pdp-related]");
      const outros = products.filter(x => x.id !== p.id);
      const mesmos = outros.filter(x => x.categoria === p.categoria);
      related.innerHTML = (mesmos.length ? mesmos : outros).slice(0, 4).map(productCard).join("");

      // dados para buscadores
      try{
        const f0 = fotosDe(p)[0];
        const ld = {"@context":"https://schema.org","@type":"Product",name:p.nome,description:p.desc || p.nome,
          brand:{"@type":"Brand",name:settings.brand},
          offers:{"@type":"Offer",priceCurrency:"BRL",price:Number(p.preco).toFixed(2),availability:sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"}};
        if(f0 && /^https?:/.test(location.href)) ld.image = new URL(fotoUrl(f0), location.href).href;
        const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
      }catch(e){}
    }
  }

  // ---- carrinho ----
  const cartRoot = document.querySelector("[data-cart-root]");
  if(cartRoot){
    let cliente = "", obs = "", cupom = null, cepInfo = null;
    const cuponsAtivos = (settings.cupons || []).filter(c => c.ativo !== false && c.codigo);

    const vazio = () => {
      cartRoot.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <h2>${T("app.cartvazio","Seu carrinho está vazio")}</h2>
        <p style="color:var(--plum-soft)">${T("app.cartvazio2","Escolha algumas peças e elas aparecem aqui.")}</p>
        <a class="btn btn-primary" href="catalogo.html">${T("app.vercatalogo","Ver o catálogo")}</a></div>`;
    };
    const linhas = () => readCart().map(i => ({i, p: products.find(x => x.id === i.id && !x.esgotado)})).filter(l => l.p);

    function calcula(ls){
      const subtotal = ls.reduce((s, {i, p}) => s + p.preco * i.qtd, 0);
      let desconto = 0;
      if(cupom){
        desconto = cupom.tipo === "valor" ? Math.min(Number(cupom.valor) || 0, subtotal) : subtotal * (Number(cupom.valor) || 0) / 100;
        desconto = Math.round(desconto * 100) / 100;
      }
      const base = subtotal - desconto;
      let frete = {valor: null, texto: T("app.infocep","Informe o CEP para ver o frete."), cinza: true};
      if(cepInfo){
        const local = norm(cepInfo.cidade) === norm(settings.freteCidadeLocal);
        if(local){
          const v = num(settings.freteValorLocal), gratis = num(settings.freteGratisAcima);
          if(gratis && gratis > 0 && base >= gratis) frete = {valor: 0, texto: `Frete grátis para ${cepInfo.cidade}`};
          else if(v !== null) frete = {valor: v, texto: `Entrega em ${cepInfo.cidade}`};
          else frete = {valor: null, texto: `Entrega em ${cepInfo.cidade}: valor combinado pelo WhatsApp`};
        }else frete = {valor: null, texto: `${cepInfo.cidade}/${cepInfo.uf}: ${settings.freteOutros || "frete combinado pelo WhatsApp."}`};
      }
      const total = base + (frete.valor || 0);
      return {subtotal, desconto, base, frete, total};
    }
    function montaMensagem(ls, c){
      const itens = ls.map(({i, p}) =>
        `• ${i.qtd}x ${p.nome}${i.cor ? ` (${i.cor})` : ""} - ${brl(p.preco * i.qtd)}${p.status === "encomenda" ? ` [sob encomenda, prazo: ${p.prazo || T("app.acombinar","a combinar")}]` : ""}`);
      let m = `Olá, Mi! Quero fazer este pedido pelo site ${settings.brand}:\n\n${itens.join("\n")}\n\nSubtotal: ${brl(c.subtotal)}`;
      if(cupom) m += `\nCupom ${cupom.codigo}: -${brl(c.desconto)}`;
      if(cepInfo) m += `\nEntrega: ${cepInfo.cidade}/${cepInfo.uf}${c.frete.valor !== null ? " - " + (c.frete.valor === 0 ? "frete grátis" : brl(c.frete.valor)) : " (frete a combinar)"}`;
      m += `\nTotal${c.frete.valor === null ? " (sem frete)" : ""}: ${brl(c.total)}`;
      m += `\nPagamento: combinar com você por aqui`;
      if(cliente.trim()) m += `\n\nNome: ${cliente.trim()}`;
      if(obs.trim()) m += `\nObservações: ${obs.trim()}`;
      return m + `\n\nPode confirmar a disponibilidade e a entrega?`;
    }
    function monta(){
      if(!linhas().length){ vazio(); return; }
      cartRoot.innerHTML = `
        <div class="cart-items" data-items></div>
        <aside class="cart-summary" aria-label="Resumo do pedido">
          <h2 style="font-size:1.4rem;margin:0">${T("app.resumo","Resumo")}</h2>
          <div data-totals></div>
          <p class="note" data-sum-enc hidden>${T("app.avisoenc","Peças sob encomenda têm prazo de produção, informado em cada uma.")}</p>
          ${cuponsAtivos.length ? `<div class="box"><h3>${T("app.cupomtit","Cupom de desconto")}</h3>
            <div class="inline-form"><input type="text" id="cupom-in" placeholder="${esc(T("app.cupomph","Digite o código"))}" autocapitalize="characters" autocomplete="off" aria-label="Código do cupom"><button class="btn btn-outline btn-sm" type="button" data-cupom>${T("app.aplicar","Aplicar")}</button></div>
            <p class="msg" data-cupom-msg></p></div>` : ""}
          <div class="box"><h3>${T("app.entrega","Entrega")}</h3>
            <div class="inline-form"><input type="text" id="cep-in" inputmode="numeric" maxlength="9" placeholder="${esc(T("app.cepph","Seu CEP"))}" autocomplete="postal-code" aria-label="CEP"><button class="btn btn-outline btn-sm" type="button" data-cep>${T("app.calcular","Calcular")}</button></div>
            <p class="msg" data-cep-msg></p></div>
          <div class="field"><label for="cli-nome">${T("app.seunome","Seu nome (opcional)")}</label><input type="text" id="cli-nome" autocomplete="name"></div>
          <div class="field"><label for="cli-obs">${T("app.obs","Observações (opcional)")}</label><textarea id="cli-obs" rows="3" placeholder="${esc(T("app.obsph","Cor, data desejada, endereço de entrega..."))}"></textarea></div>
          <a class="btn btn-whats" data-sum-wa target="_blank" rel="noopener">${T("app.enviarpedido","Enviar pedido pelo WhatsApp")}</a>
          <p class="note">${esc(settings.avisoPedido || "Frete, prazo e forma de pagamento são combinados pelo WhatsApp.")}</p>
          <button class="link-btn" type="button" data-clear>${T("app.esvaziar","Esvaziar carrinho")}</button>
        </aside>`;
      desenha();
    }
    function desenha(){
      const ls = linhas();
      if(!ls.length){ vazio(); return; }
      let qtd = 0, enc = false;
      cartRoot.querySelector("[data-items]").innerHTML = ls.map(({i, p}) => {
        const sub = p.preco * i.qtd; qtd += i.qtd; if(p.status === "encomenda") enc = true;
        const key = esc(i.id + "|" + (i.cor || ""));
        return `
        <div class="cart-item">
          <a class="ph" href="produto.html?id=${encodeURIComponent(p.id)}">${thumbHTML(p)}</a>
          <div class="info">
            <a class="nm" href="produto.html?id=${encodeURIComponent(p.id)}">${esc(p.nome)}</a>
            <span class="sub">${i.cor ? esc(i.cor) + " · " : ""}${brl(p.preco)} cada · ${p.status === "pronta" ? T("app.pronta","Pronta entrega") : T("app.sobenc","Sob encomenda")}</span>
            <div class="row2">
              <div class="stepper" role="group" aria-label="Quantidade de ${esc(p.nome)}">
                <button type="button" data-q="-1" data-key="${key}" aria-label="Diminuir">−</button>
                <output>${i.qtd}</output>
                <button type="button" data-q="1" data-key="${key}" aria-label="Aumentar">+</button>
              </div>
              <span class="line-total">${brl(sub)}</span>
            </div>
            <button class="link-btn" type="button" data-remove="${key}" style="align-self:flex-start">${T("app.remover","Remover")}</button>
          </div>
        </div>`;
      }).join("");
      const c = calcula(ls);
      cartRoot.querySelector("[data-totals]").innerHTML = `
        <div class="sum-line"><span>${qtd === 1 ? "1 peça" : qtd + " peças"}</span><span>${brl(c.subtotal)}</span></div>
        ${cupom ? `<div class="sum-line off"><span>Cupom ${esc(cupom.codigo)}</span><span>-${brl(c.desconto)}</span></div>` : ""}
        <div class="sum-line"><span>${T("app.frete","Frete")}</span><span>${c.frete.valor === null ? T("app.acombinar","a combinar") : (c.frete.valor === 0 ? T("app.gratis","grátis") : brl(c.frete.valor))}</span></div>
        <div class="sum-row" style="margin-top:8px"><span>Total${c.frete.valor === null ? " (sem frete)" : ""}</span><span class="total">${brl(c.total)}</span></div>`;
      cartRoot.querySelector("[data-sum-enc]").hidden = !enc;
      cartRoot.querySelector("[data-sum-wa]").href = waLink(settings.whatsapp, montaMensagem(ls, c));
      const cm = cartRoot.querySelector("[data-cep-msg]");
      if(cm && cepInfo) { cm.className = "msg ok"; cm.textContent = c.frete.texto; }
    }
    const achar = (items, key) => items.find(i => (i.id + "|" + (i.cor || "")) === key);
    cartRoot.addEventListener("click", async e => {
      const items = readCart();
      const q = e.target.closest("[data-q]");
      if(q){
        const it = achar(items, q.dataset.key);
        if(it){ it.qtd = Math.max(1, Math.min(99, it.qtd + Number(q.dataset.q))); writeCart(items); desenha(); }
        return;
      }
      const r = e.target.closest("[data-remove]");
      if(r){ writeCart(items.filter(i => (i.id + "|" + (i.cor || "")) !== r.dataset.remove)); desenha(); return; }
      if(e.target.closest("[data-clear]")){ writeCart([]); vazio(); return; }
      if(e.target.closest("[data-cupom]")){
        const msg = cartRoot.querySelector("[data-cupom-msg]");
        const cod = norm(cartRoot.querySelector("#cupom-in").value).replace(/\s/g, "");
        const ok = cuponsAtivos.find(c => norm(c.codigo).replace(/\s/g, "") === cod);
        if(ok){ cupom = ok; msg.className = "msg ok"; msg.textContent = `Cupom ${ok.codigo} aplicado.`; }
        else{ cupom = null; msg.className = "msg err"; msg.textContent = cod ? T("app.cupomerr","Cupom não encontrado ou expirado.") : T("app.cupomvazio","Digite o código do cupom."); }
        desenha(); return;
      }
      if(e.target.closest("[data-cep]")){
        const msg = cartRoot.querySelector("[data-cep-msg]");
        const cep = cartRoot.querySelector("#cep-in").value.replace(/\D/g, "");
        if(cep.length !== 8){ msg.className = "msg err"; msg.textContent = T("app.cepinv","Digite um CEP com 8 números."); return; }
        msg.className = "msg"; msg.textContent = "Buscando...";
        try{
          const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const d = await r.json();
          if(d.erro) throw new Error("cep");
          cepInfo = {cidade: d.localidade, uf: d.uf};
          desenha();
        }catch(err){ cepInfo = null; msg.className = "msg err"; msg.textContent = T("app.cepnao","Não consegui achar esse CEP. A Mi combina o frete com você pelo WhatsApp."); desenha(); }
        return;
      }
    });
    cartRoot.addEventListener("input", e => {
      if(e.target.id === "cli-nome") cliente = e.target.value;
      else if(e.target.id === "cli-obs") obs = e.target.value;
      else if(e.target.id === "cep-in"){ const d = e.target.value.replace(/\D/g, "").slice(0, 8); e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d; return; }
      else return;
      desenha();
    });
    monta();
  }

  // ---- formulário de encomenda personalizada ----
  const orderForm = document.querySelector("[data-order-form]");
  if(orderForm){
    const preSel = new URLSearchParams(QS()).get("produto");
    if(preSel){
      const tipoField = orderForm.querySelector("[name=tipo]");
      if(tipoField) tipoField.value = preSel;
    }
    orderForm.addEventListener("submit", e => {
      e.preventDefault();
      const o = Object.fromEntries(new FormData(orderForm).entries());
      const msg = `Olá, Mi! Quero solicitar um orçamento.\n\nPeça: ${o.tipo}\nCor: ${o.cor}\nTamanho: ${o.tamanho}\nQuantidade: ${o.quantidade}\nData desejada: ${o.data}\nDescrição: ${o.descricao}\nObservações: ${o.observacoes || "-"}\n\nMeu nome: ${o.nome}`;
      window.open(waLink(settings.whatsapp, msg), "_blank");
      orderForm.reset();
      document.querySelector("[data-order-success]").style.display = "block";
    });
  }

  // ---- formulário de contato ----
  const contactForm = document.querySelector("[data-contact-form]");
  if(contactForm){
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const o = Object.fromEntries(new FormData(contactForm).entries());
      const msg = `Olá, Mi! Meu nome é ${o.nome}.\n${o.mensagem}\n\n(Contato: ${o.contato})`;
      window.open(waLink(settings.whatsapp, msg), "_blank");
      contactForm.reset();
    });
  }

  reveal();
});
