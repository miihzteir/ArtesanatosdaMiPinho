/* ==========================================================================
   Artesanatos da Mi Pinho — interações da área pública (loja)
   ========================================================================== */

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl = n => "R$ " + Number(n || 0).toFixed(2).replace(".", ",");
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const fotosDe = p => Array.isArray(p.fotos) && p.fotos.length ? p.fotos : (p.foto ? [p.foto] : []);
const QS = () => (typeof window.__SEARCH === "string" ? window.__SEARCH : location.search);
const fotoUrl = f => (window.__FOTO && window.__FOTO[f]) || ("img/" + encodeURIComponent(f));

// foto que nao carrega (ainda nao foi enviada ao GitHub): volta para o icone
document.addEventListener("error", e => {
  const t = e.target;
  if(t && t.tagName === "IMG" && t.classList.contains("foto")){
    const holder = t.parentElement;
    t.remove();
    if(holder && !holder.querySelector("svg")) holder.insertAdjacentHTML("beforeend", icon(t.dataset.icon || "flower"));
  }
}, true);

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  const settings = getSettings();
  const cats = getCategories();
  const products = getProducts();
  updateCartBadge();

  const catDe = p => cats.find(c => c.id === p.categoria);
  const iconeDe = p => (catDe(p) || {}).icon || "flower";
  const thumbHTML = p => {
    const f = fotosDe(p)[0];
    return f
      ? `<img class="foto" src="${fotoUrl(f)}" alt="${esc(p.nome)}" loading="lazy" data-icon="${iconeDe(p)}">`
      : icon(iconeDe(p));
  };

  // ---- textos e links que vêm das configurações ----
  document.querySelectorAll("[data-wa-float],[data-wa-generic]").forEach(el => { el.href = waLink(settings.whatsapp, settings.whatsappMsgPadrao); });
  document.querySelectorAll("[data-insta-link]").forEach(el => { el.href = `https://instagram.com/${settings.instagram}`; });
  document.querySelectorAll("[data-insta-handle]").forEach(el => { el.textContent = "@" + settings.instagram; });
  document.querySelectorAll("[data-brand-name]").forEach(el => { el.textContent = settings.brand; });
  document.querySelectorAll("[data-brand-slogan]").forEach(el => { el.textContent = settings.slogan; });
  document.querySelectorAll("[data-store-email]").forEach(el => { el.textContent = settings.email; });
  document.querySelectorAll("[data-store-cidade]").forEach(el => { el.textContent = settings.cidade; });
  document.querySelectorAll("[data-store-horario]").forEach(el => { el.textContent = settings.horario; });

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
    const badge = p.lancamento ? '<span class="tag">Lançamento</span>'
                : p.maisVendido ? '<span class="tag alt">Mais vendido</span>'
                : p.destaque ? '<span class="tag">Destaque</span>' : "";
    const statusLabel = p.status === "pronta" ? "Pronta entrega" : "Sob encomenda";
    const varias = (p.cores || []).length > 1;
    const addBtn = varias
      ? `<a class="btn btn-primary btn-sm" href="produto.html?id=${encodeURIComponent(p.id)}">Escolher cor</a>`
      : `<button class="btn btn-primary btn-sm" type="button" data-add="${esc(p.id)}" data-cor="${esc((p.cores || [])[0] || "")}">Adicionar</button>`;
    return `
    <article class="product-card">
      <a class="thumb" href="produto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${esc(p.nome)}">${badge}${thumbHTML(p)}</a>
      <div class="body">
        <span class="cat">${esc((catDe(p) || {}).nome || p.categoria)}</span>
        <h4><a href="produto.html?id=${encodeURIComponent(p.id)}">${esc(p.nome)}</a></h4>
        <div class="price-row"><span class="price">${brl(p.preco)}</span><span class="status">${statusLabel}</span></div>
        <div class="actions">
          <a class="btn btn-outline btn-sm view" href="produto.html?id=${encodeURIComponent(p.id)}">Ver peça</a>
          ${addBtn}
        </div>
      </div>
    </article>`;
  }

  // botão "Adicionar" dos cards
  function flash(btn, texto){
    if(!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.textContent = texto || "Adicionado ✓";
    btn.classList.add("done");
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove("done"); }, 1500);
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-add]");
    if(!b) return;
    addToCart(b.dataset.add, b.dataset.cor || "", 1);
    flash(b);
  });

  // ---- destaques (home) ----
  const featGrid = document.querySelector("[data-featured-grid]");
  if(featGrid) featGrid.innerHTML = products.filter(p => p.destaque).slice(0, 6).map(productCard).join("");

  // ---- catálogo: filtro por categoria, busca e ordem ----
  const catalogGrid = document.querySelector("[data-catalog-grid]");
  if(catalogGrid){
    let activeCat = new URLSearchParams(QS()).get("categoria") || "todas";
    const filterBar = document.querySelector("[data-filters]");
    const search = document.querySelector("[data-search]");
    const sort = document.querySelector("[data-sort]");
    const count = document.querySelector("[data-count]");

    function renderFilters(){
      const chips = [{id: "todas", nome: "Todas"}, ...cats];
      filterBar.innerHTML = chips.map(c =>
        `<button class="chip ${c.id === activeCat ? "active" : ""}" type="button" data-filter="${esc(c.id)}">${esc(c.nome)}</button>`).join("");
      filterBar.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
        activeCat = btn.dataset.filter; renderFilters(); renderGrid();
      }));
    }
    function renderGrid(){
      let list = activeCat === "todas" ? products.slice() : products.filter(p => p.categoria === activeCat);
      const q = norm(search ? search.value : "").trim();
      if(q) list = list.filter(p => norm(`${p.nome} ${p.desc} ${(catDe(p) || {}).nome || ""}`).includes(q));
      const ord = sort ? sort.value : "";
      if(ord === "menor") list.sort((a, b) => a.preco - b.preco);
      else if(ord === "maior") list.sort((a, b) => b.preco - a.preco);
      else if(ord === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      if(count) count.textContent = list.length === 1 ? "1 peça" : `${list.length} peças`;
      catalogGrid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p style="grid-column:1/-1;text-align:center;color:var(--plum-soft)">Nenhuma peça encontrada. Fale com a Mi, ela pode fazer sob encomenda.</p>`;
    }
    if(filterBar) renderFilters();
    if(search) search.addEventListener("input", renderGrid);
    if(sort) sort.addEventListener("change", renderGrid);
    renderGrid();
  }

  // ---- página de produto ----
  const pdp = document.querySelector("[data-pdp]");
  if(pdp){
    const id = new URLSearchParams(QS()).get("id");
    const p = products.find(x => x.id === id);
    const root = document.querySelector("[data-pdp-root]");
    if(!p){
      root.innerHTML = `<div class="empty-state"><h2>Peça não encontrada</h2><p>Ela pode ter saído do catálogo.</p><a class="btn btn-primary" href="catalogo.html">Ver o catálogo</a></div>`;
    }else{
      const q = sel => document.querySelector(sel);
      document.title = `${p.nome} · ${settings.brand}`;
      q("[data-pdp-crumb]").innerHTML = `<a href="index.html">Início</a> / <a href="catalogo.html">Catálogo</a> / ${esc(p.nome)}`;
      q("[data-pdp-cat]").textContent = (catDe(p) || {}).nome || p.categoria;
      q("[data-pdp-nome]").textContent = p.nome;
      q("[data-pdp-preco]").textContent = brl(p.preco);
      q("[data-pdp-desc]").textContent = p.desc || "";
      q("[data-pdp-status]").textContent = p.status === "pronta" ? "Pronta entrega" : "Sob encomenda";
      q("[data-pdp-prazo]").textContent = p.prazo || "A combinar";
      q("[data-pdp-tamanho]").textContent = p.tamanho || "A combinar";
      q("[data-pdp-person]").textContent = p.personalizavel ? "Aceita personalização" : "Peça padrão";
      const longo = (p.descLonga || p.desc || "").split(/\n+/).filter(Boolean);
      q("[data-pdp-long]").innerHTML = longo.map(t => `<p>${esc(t)}</p>`).join("");

      // galeria
      const fotos = fotosDe(p);
      const main = q("[data-pdp-main]");
      const thumbs = q("[data-pdp-thumbs]");
      const showFoto = i => {
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
      }else{
        main.innerHTML = icon(iconeDe(p));
      }

      // cor e quantidade
      const cores = p.cores || [];
      let cor = cores[0] || "";
      let qtd = 1;
      const coresWrap = q("[data-pdp-cores-wrap]");
      if(cores.length){
        const box = q("[data-pdp-cores]");
        box.innerHTML = cores.map((c, i) => `<button class="color-chip" type="button" aria-pressed="${i === 0}" data-cor="${esc(c)}">${esc(c)}</button>`).join("");
        box.addEventListener("click", e => {
          const b = e.target.closest(".color-chip"); if(!b) return;
          cor = b.dataset.cor;
          box.querySelectorAll(".color-chip").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          atualizaWa();
        });
      }else{ coresWrap.hidden = true; }

      const out = q("[data-pdp-qtd]");
      q("[data-pdp-minus]").addEventListener("click", () => { qtd = Math.max(1, qtd - 1); out.textContent = qtd; atualizaWa(); });
      q("[data-pdp-plus]").addEventListener("click", () => { qtd = Math.min(20, qtd + 1); out.textContent = qtd; atualizaWa(); });

      const wa = q("[data-pdp-wa]");
      function atualizaWa(){
        const extra = `${cor ? `\nCor: ${cor}` : ""}\nQuantidade: ${qtd}`;
        wa.href = waLink(settings.whatsapp, `Olá, Mi! Vi o produto ${p.nome} no site ${settings.brand} e gostaria de saber mais sobre ele.${extra}`);
      }
      atualizaWa();

      const addBtn = q("[data-pdp-add]");
      addBtn.addEventListener("click", () => { addToCart(p.id, cor, qtd); flash(addBtn, "Adicionado ✓"); });

      const related = q("[data-pdp-related]");
      const outros = products.filter(x => x.id !== p.id);
      const mesmos = outros.filter(x => x.categoria === p.categoria);
      related.innerHTML = (mesmos.length ? mesmos : outros).slice(0, 4).map(productCard).join("");
    }
  }

  // ---- carrinho ----
  const cartRoot = document.querySelector("[data-cart-root]");
  if(cartRoot){
    let cliente = "", obs = "";
    const vazio = () => {
      cartRoot.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <h2>Seu carrinho está vazio</h2>
        <p style="color:var(--plum-soft)">Escolha algumas peças e elas aparecem aqui.</p>
        <a class="btn btn-primary" href="catalogo.html">Ver o catálogo</a></div>`;
    };
    function linhas(){
      return readCart().map(i => ({i, p: products.find(x => x.id === i.id)})).filter(l => l.p);
    }
    function montaMensagem(ls, total){
      const itens = ls.map(({i, p}) =>
        `• ${i.qtd}x ${p.nome}${i.cor ? ` (${i.cor})` : ""} - ${brl(p.preco * i.qtd)}${p.status === "encomenda" ? ` [sob encomenda, prazo: ${p.prazo || "a combinar"}]` : ""}`);
      return `Olá, Mi! Quero fazer este pedido pelo site ${settings.brand}:\n\n${itens.join("\n")}\n\nTotal: ${brl(total)}`
        + (cliente.trim() ? `\n\nNome: ${cliente.trim()}` : "")
        + (obs.trim() ? `\nObservações: ${obs.trim()}` : "")
        + `\n\nPode confirmar a disponibilidade, o pagamento e a entrega?`;
    }
    function monta(){
      const ls = linhas();
      if(ls.length !== readCart().length) writeCart(ls.map(l => l.i));
      if(!ls.length){ vazio(); return; }
      cartRoot.innerHTML = `
        <div class="cart-items" data-items></div>
        <aside class="cart-summary" aria-label="Resumo do pedido">
          <h2 style="font-size:1.4rem;margin:0">Resumo</h2>
          <div class="sum-row"><span data-sum-qtd></span><span class="total" data-sum-total></span></div>
          <p class="note" data-sum-enc hidden>Peças sob encomenda têm prazo de produção, informado em cada uma.</p>
          <div class="field"><label for="cli-nome">Seu nome (opcional)</label><input type="text" id="cli-nome" autocomplete="name"></div>
          <div class="field"><label for="cli-obs">Observações (opcional)</label><textarea id="cli-obs" rows="3" placeholder="Cor, data desejada, endereço de entrega..."></textarea></div>
          <a class="btn btn-whats" data-sum-wa target="_blank" rel="noopener">Enviar pedido pelo WhatsApp</a>
          <p class="note">${esc(settings.avisoPedido || "Frete e prazo de entrega são combinados pelo WhatsApp.")}</p>
          <button class="link-btn" type="button" data-clear>Esvaziar carrinho</button>
        </aside>`;
      cartRoot.querySelector("#cli-nome").value = cliente;
      cartRoot.querySelector("#cli-obs").value = obs;
      desenha();
    }
    function desenha(){
      const ls = linhas();
      if(!ls.length){ vazio(); return; }
      let total = 0, qtd = 0, enc = false;
      cartRoot.querySelector("[data-items]").innerHTML = ls.map(({i, p}) => {
        const sub = p.preco * i.qtd; total += sub; qtd += i.qtd; if(p.status === "encomenda") enc = true;
        const key = esc(i.id + "|" + (i.cor || ""));
        return `
        <div class="cart-item">
          <a class="ph" href="produto.html?id=${encodeURIComponent(p.id)}">${thumbHTML(p)}</a>
          <div class="info">
            <a class="nm" href="produto.html?id=${encodeURIComponent(p.id)}">${esc(p.nome)}</a>
            <span class="sub">${i.cor ? esc(i.cor) + " · " : ""}${brl(p.preco)} cada · ${p.status === "pronta" ? "Pronta entrega" : "Sob encomenda"}</span>
            <div class="row2">
              <div class="stepper" role="group" aria-label="Quantidade de ${esc(p.nome)}">
                <button type="button" data-q="-1" data-key="${key}" aria-label="Diminuir">−</button>
                <output>${i.qtd}</output>
                <button type="button" data-q="1" data-key="${key}" aria-label="Aumentar">+</button>
              </div>
              <span class="line-total">${brl(sub)}</span>
            </div>
            <button class="link-btn" type="button" data-remove="${key}" style="align-self:flex-start">Remover</button>
          </div>
        </div>`;
      }).join("");
      cartRoot.querySelector("[data-sum-qtd]").textContent = qtd === 1 ? "1 peça" : `${qtd} peças`;
      cartRoot.querySelector("[data-sum-total]").textContent = brl(total);
      cartRoot.querySelector("[data-sum-enc]").hidden = !enc;
      cartRoot.querySelector("[data-sum-wa]").href = waLink(settings.whatsapp, montaMensagem(ls, total));
    }
    const achar = (items, key) => items.find(i => (i.id + "|" + (i.cor || "")) === key);
    cartRoot.addEventListener("click", e => {
      const items = readCart();
      const q = e.target.closest("[data-q]");
      if(q){
        const it = achar(items, q.dataset.key);
        if(it){ it.qtd = Math.max(1, Math.min(99, it.qtd + Number(q.dataset.q))); writeCart(items); desenha(); }
        return;
      }
      const r = e.target.closest("[data-remove]");
      if(r){ writeCart(items.filter(i => (i.id + "|" + (i.cor || "")) !== r.dataset.remove)); desenha(); return; }
      if(e.target.closest("[data-clear]")){ writeCart([]); vazio(); }
    });
    cartRoot.addEventListener("input", e => {
      if(e.target.id === "cli-nome") cliente = e.target.value;
      else if(e.target.id === "cli-obs") obs = e.target.value;
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
});
