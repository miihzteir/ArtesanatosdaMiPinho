/* ==========================================================================
   Artesanatos da Mi — núcleo do painel admin
   Autenticação simples via localStorage (não é segurança real — ver nota
   no configuracoes.html). Dados guardados em localStorage por enquanto;
   dá pra evoluir para Firebase depois (ver README).
   ========================================================================== */

const ADMIN_PASSWORD_KEY = "adm_password";
const ADMIN_SESSION_KEY = "adm_session";

function ensureSeed(){
  if(!localStorage.getItem("adm_products")) localStorage.setItem("adm_products", JSON.stringify(PRODUCTS_DEFAULT));
  if(!localStorage.getItem("adm_categories")) localStorage.setItem("adm_categories", JSON.stringify(CATEGORIES_DEFAULT));
  if(!localStorage.getItem("adm_settings")) localStorage.setItem("adm_settings", JSON.stringify(STORE_SETTINGS_DEFAULT));
  if(!localStorage.getItem(ADMIN_PASSWORD_KEY)) localStorage.setItem(ADMIN_PASSWORD_KEY, "mi2026");
  if(!localStorage.getItem("adm_orders")){
    localStorage.setItem("adm_orders", JSON.stringify([
      {id:"enc1", cliente:"Ana Paula", whatsapp:"66999990001", produto:"Bolsa Rosê Trançada", categoria:"bolsas",
       personalizacao:"", cor:"Rosé", tamanho:"30x24cm", quantidade:1, valor:189.9, sinal:100, restante:89.9,
       dataPedido:"2026-08-20", prazoEntrega:"2026-09-05", observacoes:"", status:"Em produção"},
      {id:"enc2", cliente:"Rafaela Souza", whatsapp:"66999990002", produto:"Ursinha Amigurumi Flor", categoria:"amigurumis",
       personalizacao:"Nome bordado", cor:"Bege", tamanho:"22cm", quantidade:1, valor:79.9, sinal:79.9, restante:0,
       dataPedido:"2026-08-18", prazoEntrega:"2026-08-30", observacoes:"", status:"Pronto"},
      {id:"enc3", cliente:"Camila Duarte", whatsapp:"66999990003", produto:"Kit Maternidade Nuvem", categoria:"presentes",
       personalizacao:"", cor:"Branco", tamanho:"Único", quantidade:1, valor:149.9, sinal:0, restante:149.9,
       dataPedido:"2026-09-01", prazoEntrega:"2026-09-15", observacoes:"Entregar para chá de bebê", status:"Novo pedido"}
    ]));
  }
  if(!localStorage.getItem("adm_customers")){
    localStorage.setItem("adm_customers", JSON.stringify([
      {id:"c1", nome:"Ana Paula", whatsapp:"66999990001", cidade:"Sinop-MT", obs:"Cliente fiel, gosta de tons rosé"},
      {id:"c2", nome:"Rafaela Souza", whatsapp:"66999990002", cidade:"Sinop-MT", obs:""},
      {id:"c3", nome:"Camila Duarte", whatsapp:"66999990003", cidade:"Sorriso-MT", obs:"Indicou 2 amigas"}
    ]));
  }
  if(!localStorage.getItem("adm_stock")){
    localStorage.setItem("adm_stock", JSON.stringify([
      {id:"m1", nome:"Fio egípcio rosé", categoria:"Fios", quantidade:8, unidade:"novelos", custo:14.9, min:5, obs:""},
      {id:"m2", nome:"Fio de malha terracota", categoria:"Fios", quantidade:3, unidade:"rolos", custo:22, min:4, obs:""},
      {id:"m3", nome:"Enchimento fiberfill", categoria:"Enchimento", quantidade:2, unidade:"kg", custo:38, min:1, obs:""},
      {id:"m4", nome:"Olhos de amigurumi 10mm", categoria:"Acessórios", quantidade:40, unidade:"pares", custo:1.2, min:10, obs:""},
      {id:"m5", nome:"Etiquetas costuradas", categoria:"Embalagem", quantidade:15, unidade:"un", custo:0.9, min:20, obs:"Estoque baixo — repor"}
    ]));
  }
  if(!localStorage.getItem("adm_expenses")){
    localStorage.setItem("adm_expenses", JSON.stringify([
      {id:"d1", desc:"Compra de fios", valor:180, data:"2026-08-10"},
      {id:"d2", desc:"Embalagens personalizadas", valor:65, data:"2026-08-15"}
    ]));
  }
}

function checkAuth(){
  if(localStorage.getItem(ADMIN_SESSION_KEY) !== "true"){
    location.href = "login.html";
  }
}
function logout(){
  localStorage.removeItem(ADMIN_SESSION_KEY);
  location.href = "login.html";
}

function store(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ return JSON.parse(localStorage.getItem(key) || "[]"); }
function uid(prefix){ return prefix + Date.now() + Math.floor(Math.random()*999); }
function money(n){ return "R$ " + Number(n||0).toFixed(2).replace(".", ","); }
function statusClass(s){
  const map = {
    "Novo pedido":"novo","Aguardando confirmação":"aguardando","Aguardando pagamento":"aguardando",
    "Confirmado":"confirmado","Em produção":"producao","Finalizando":"producao","Pronto":"pronto",
    "Entregue":"entregue","Cancelado":"cancelado"
  };
  return map[s] || "novo";
}
const ORDER_STATUSES = ["Novo pedido","Aguardando confirmação","Aguardando pagamento","Confirmado","Em produção","Finalizando","Pronto","Entregue","Cancelado"];

function renderSidebar(active){
  const s = getSettings();
  document.querySelector("[data-sidebar]").innerHTML = `
    <div class="brand">🧶 ${s.brand}<small>PAINEL DA ARTESÃ</small></div>
    <a href="dashboard.html" class="${active==='dashboard'?'active':''}">📊 Dashboard</a>
    <a href="produtos.html" class="${active==='produtos'?'active':''}">🧵 Produtos</a>
    <a href="encomendas.html" class="${active==='encomendas'?'active':''}">📦 Encomendas</a>
    <a href="clientes.html" class="${active==='clientes'?'active':''}">💌 Clientes</a>
    <a href="conteudo.html" class="${active==='conteudo'?'active':''}">📱 Conteúdo</a>
    <a href="estoque.html" class="${active==='estoque'?'active':''}">🧶 Estoque</a>
    <a href="financeiro.html" class="${active==='financeiro'?'active':''}">💰 Financeiro</a>
    <a href="calculadora.html" class="${active==='calculadora'?'active':''}">🧮 Calculadora</a>
    <a href="configuracoes.html" class="${active==='configuracoes'?'active':''}">⚙️ Configurações</a>
    <a href="../index.html" target="_blank">🌐 Ver site</a>
    <a href="#" class="logout" onclick="logout();return false;">Sair</a>
  `;
}
