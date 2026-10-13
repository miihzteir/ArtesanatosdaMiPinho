/* ==========================================================================
   Artesanatos da Mi — interações da área pública
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const settings = getSettings();
  const cats = getCategories();
  const products = getProducts();

  // ---- header dinâmico (whatsapp / instagram) ----
  document.querySelectorAll("[data-wa-float]").forEach(el=>{
    el.href = waLink(settings.whatsapp, settings.whatsappMsgPadrao);
  });
  document.querySelectorAll("[data-wa-generic]").forEach(el=>{
    el.href = waLink(settings.whatsapp, settings.whatsappMsgPadrao);
  });
  document.querySelectorAll("[data-insta-link]").forEach(el=>{
    el.href = `https://instagram.com/${settings.instagram}`;
  });
  document.querySelectorAll("[data-insta-handle]").forEach(el=>{
    el.textContent = "@" + settings.instagram;
  });
  document.querySelectorAll("[data-brand-name]").forEach(el=> el.textContent = settings.brand);
  document.querySelectorAll("[data-brand-slogan]").forEach(el=> el.textContent = settings.slogan);
  document.querySelectorAll("[data-store-email]").forEach(el=> el.textContent = settings.email);
  document.querySelectorAll("[data-store-cidade]").forEach(el=> el.textContent = settings.cidade);
  document.querySelectorAll("[data-store-horario]").forEach(el=> el.textContent = settings.horario);

  // ---- menu mobile ----
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.main-nav");
  if(toggle && nav){
    toggle.addEventListener("click", ()=> nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=> nav.classList.remove("open")));
  }

  // ---- categorias (home) ----
  const catGrid = document.querySelector("[data-cat-grid]");
  if(catGrid){
    const colorClasses = ["c1","c2","c3"];
    catGrid.innerHTML = cats.slice(0,10).map((c,i) => `
      <a class="cat-bubble" href="catalogo.html?categoria=${c.id}">
        <div class="blob-ico ${colorClasses[i%3]}">${icon(c.icon)}</div>
        <span>${c.nome}</span>
      </a>`).join("");
  }

  // ---- cartão de produto (reutilizado) ----
  function productCard(p){
    const badge = p.lancamento ? '<span class="tag">Lançamento</span>'
                : p.maisVendido ? '<span class="tag alt">Mais vendido</span>'
                : p.destaque ? '<span class="tag">Destaque</span>' : '';
    const statusLabel = p.status === "pronta" ? "Pronta entrega" : "Sob encomenda";
    return `
    <div class="product-card">
      <a class="thumb" href="produto.html?id=${p.id}">
        ${badge}
        ${icon(cats.find(c=>c.id===p.categoria)?.icon || "flower")}
      </a>
      <div class="body">
        <span class="cat">${cats.find(c=>c.id===p.categoria)?.nome || p.categoria}</span>
        <h4><a href="produto.html?id=${p.id}">${p.nome}</a></h4>
        <span class="price">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
        <span class="status">${statusLabel}</span>
        <div class="actions">
          <a class="btn btn-outline btn-sm" href="produto.html?id=${p.id}">Ver peça</a>
          <a class="btn btn-whats btn-sm" target="_blank" rel="noopener"
             href="${waLink(settings.whatsapp, `Olá, Mi! Vi o produto ${p.nome} no site ${settings.brand} e gostaria de saber mais sobre ele.`)}">
            WhatsApp
          </a>
        </div>
      </div>
    </div>`;
  }

  // ---- produtos em destaque (home) ----
  const featGrid = document.querySelector("[data-featured-grid]");
  if(featGrid){
    featGrid.innerHTML = products.filter(p=>p.destaque).slice(0,6).map(productCard).join("");
  }

  // ---- catálogo completo com filtros ----
  const catalogGrid = document.querySelector("[data-catalog-grid]");
  if(catalogGrid){
    const params = new URLSearchParams(location.search);
    let activeCat = params.get("categoria") || "todas";

    const filterBar = document.querySelector("[data-filters]");
    function renderFilters(){
      const chips = [{id:"todas", nome:"Todas"}, ...cats];
      filterBar.innerHTML = chips.map(c => `
        <button class="chip ${c.id===activeCat?'active':''}" data-filter="${c.id}">${c.nome}</button>
      `).join("");
      filterBar.querySelectorAll(".chip").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          activeCat = btn.dataset.filter;
          renderFilters();
          renderGrid();
        });
      });
    }
    function renderGrid(){
      const list = activeCat === "todas" ? products : products.filter(p=>p.categoria===activeCat);
      catalogGrid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p style="grid-column:1/-1;text-align:center;color:var(--brown-soft)">Nenhuma peça nessa categoria no momento — fale com a Mi, ela pode fazer sob encomenda!</p>`;
    }
    if(filterBar) renderFilters();
    renderGrid();
  }

  // ---- página de produto ----
  const pdp = document.querySelector("[data-pdp]");
  if(pdp){
    const id = new URLSearchParams(location.search).get("id");
    const p = products.find(x=>x.id===id) || products[0];
    const catNome = cats.find(c=>c.id===p.categoria)?.nome || p.categoria;

    document.title = `${p.nome} · ${settings.brand}`;
    document.querySelector("[data-pdp-crumb]").innerHTML =
      `<a href="index.html">Início</a> / <a href="catalogo.html">Catálogo</a> / ${p.nome}`;
    document.querySelector("[data-pdp-icon]").innerHTML = icon(cats.find(c=>c.id===p.categoria)?.icon || "flower");
    document.querySelector("[data-pdp-cat]").textContent = catNome;
    document.querySelector("[data-pdp-nome]").textContent = p.nome;
    document.querySelector("[data-pdp-preco]").textContent = "R$ " + p.preco.toFixed(2).replace(".", ",");
    document.querySelector("[data-pdp-desc]").textContent = p.desc;
    document.querySelector("[data-pdp-status]").textContent = p.status === "pronta" ? "Pronta entrega" : "Sob encomenda";
    document.querySelector("[data-pdp-prazo]").textContent = p.prazo;
    document.querySelector("[data-pdp-cores]").textContent = p.cores.join(", ");
    document.querySelector("[data-pdp-tamanho]").textContent = p.tamanho;
    document.querySelector("[data-pdp-person]").textContent = p.personalizavel ? "Sim, aceita personalização" : "Peça padrão";

    const waMsg = `Olá, Mi! Vi o produto ${p.nome} no site ${settings.brand} e gostaria de saber mais sobre ele.`;
    document.querySelector("[data-pdp-wa]").href = waLink(settings.whatsapp, waMsg);
    document.querySelector("[data-pdp-encomendar]").href = `encomenda.html?produto=${encodeURIComponent(p.nome)}`;

    const related = document.querySelector("[data-pdp-related]");
    if(related){
      related.innerHTML = products.filter(x=>x.categoria===p.categoria && x.id!==p.id).slice(0,3).map(productCard).join("")
        || products.filter(x=>x.id!==p.id).slice(0,3).map(productCard).join("");
    }
  }

  // ---- formulário de encomenda personalizada ----
  const orderForm = document.querySelector("[data-order-form]");
  if(orderForm){
    const preSel = new URLSearchParams(location.search).get("produto");
    if(preSel){
      const tipoField = orderForm.querySelector("[name=tipo]");
      if(tipoField) tipoField.value = preSel;
    }
    orderForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(orderForm);
      const o = Object.fromEntries(fd.entries());

      // salva no "banco" local para aparecer no painel da Mi
      const orders = JSON.parse(localStorage.getItem("adm_orders") || "[]");
      orders.unshift({
        id: "enc" + Date.now(),
        cliente: o.nome, whatsapp: o.whatsapp, produto: o.tipo, categoria: "",
        personalizacao: o.descricao, cor: o.cor, tamanho: o.tamanho, quantidade: o.quantidade || 1,
        valor: 0, sinal: 0, restante: 0,
        dataPedido: new Date().toISOString().slice(0,10), prazoEntrega: o.data || "",
        observacoes: o.observacoes || "", status: "Novo pedido"
      });
      localStorage.setItem("adm_orders", JSON.stringify(orders));

      const msg = `Olá, Mi! Quero solicitar um orçamento.\n\nPeça: ${o.tipo}\nCor: ${o.cor}\nTamanho: ${o.tamanho}\nQuantidade: ${o.quantidade}\nData desejada: ${o.data}\nDescrição: ${o.descricao}\nObservações: ${o.observacoes || "-"}\n\nMeu nome: ${o.nome}`;
      window.open(waLink(settings.whatsapp, msg), "_blank");

      orderForm.reset();
      document.querySelector("[data-order-success]").style.display = "block";
    });
  }

  // ---- formulário de contato (simples) ----
  const contactForm = document.querySelector("[data-contact-form]");
  if(contactForm){
    contactForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(contactForm);
      const o = Object.fromEntries(fd.entries());
      const msg = `Olá, Mi! Meu nome é ${o.nome}.\n${o.mensagem}\n\n(Contato: ${o.contato})`;
      window.open(waLink(settings.whatsapp, msg), "_blank");
      contactForm.reset();
    });
  }
});
