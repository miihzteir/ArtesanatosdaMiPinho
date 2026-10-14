/* ==========================================================================
   Artesanatos da Mi Pinho — dados da vitrine
   Estes dados também são usados pelo painel admin (localStorage).
   Para editar produtos sem mexer em código, use o painel /admin/produtos.html
   ========================================================================== */

let STORE_SETTINGS_DEFAULT = {
  brand: "Artesanatos da Mi Pinho",
  slogan: "Crochê com carinho em cada detalhe.",
  whatsapp: "5566999999999",
  instagram: "artesanatosdami",
  email: "contato@artesanatosdami.com.br",
  cidade: "Sinop - MT",
  horario: "Seg a sáb, 9h às 18h",
  whatsappMsgPadrao: "Olá, Mi! Gostaria de saber mais sobre os seus trabalhos de crochê.",
  avisoPedido: "Frete, prazo e forma de pagamento são combinados com a Mi pelo WhatsApp.",
  faixaAtiva: true,
  faixaTexto: "Peças feitas à mão com carinho · Encomendas abertas",
  faixaLink: "catalogo.html",
  freteCidadeLocal: "Sinop",
  freteValorLocal: "",
  freteGratisAcima: "",
  freteOutros: "Para outras cidades, o frete é combinado pelo WhatsApp (Correios ou transportadora).",
  videoUrl: "",
  fotoMi: "",
  galeria: [],
  cupons: [
    { codigo: "BEMVINDA10", tipo: "percent", valor: 10, ativo: false }
  ],
  colecoes: [
    { id: "natal", nome: "Coleção de Natal", descricao: "Presentes e decoração feitos à mão para a época mais bonita do ano.", ativa: true }
  ],
  textos: {},
  passos: [
    {
      "titulo": "Escolha",
      "texto": "Navegue pelo catálogo ou peça algo do seu jeito."
    },
    {
      "titulo": "Contato",
      "texto": "Fale com a Mi pelo WhatsApp."
    },
    {
      "titulo": "Combine",
      "texto": "Alinhe cor, tamanho e prazo."
    },
    {
      "titulo": "Produção",
      "texto": "Sua peça é feita à mão com cuidado."
    },
    {
      "titulo": "Receba",
      "texto": "Combine a entrega e aproveite!"
    }
  ],
  faq: [
    {
      "pergunta": "Faz encomenda personalizada?",
      "resposta": "Sim! A maioria das peças pode ser personalizada em cor, tamanho e detalhes. É só falar com a Mi."
    },
    {
      "pergunta": "Qual o prazo de produção?",
      "resposta": "Varia conforme a peça, entre 2 e 15 dias úteis. O prazo exato aparece na página de cada produto."
    },
    {
      "pergunta": "Entrega para outras cidades?",
      "resposta": "Sim, envio para todo o Brasil via transportadora ou Correios."
    },
    {
      "pergunta": "Quais formas de pagamento?",
      "resposta": "O pagamento é combinado direto com a Mi pelo WhatsApp, na hora de fechar o pedido."
    },
    {
      "pergunta": "Posso escolher a cor?",
      "resposta": "Sim, a maioria das peças tem opções de cor — combine direto com a Mi."
    },
    {
      "pergunta": "Como faço para pedir orçamento?",
      "resposta": "Preencha o formulário de [encomenda personalizada](encomenda.html) ou chame no WhatsApp."
    }
  ],
  depoimentos: [
    { nome: "Ana Paula", texto: "A bolsa ficou ainda mais linda do que eu imaginei, e o cuidado no acabamento é impressionante.", estrelas: 5 },
    { nome: "Rafaela", texto: "Encomendei um amigurumi para o aniversário da minha filha, chegou no prazo e com muito carinho.", estrelas: 5 },
    { nome: "Camila", texto: "Atendimento super atencioso, tirou todas as minhas dúvidas antes de fechar o pedido.", estrelas: 5 }
  ]
};

let CATEGORIES_DEFAULT = [
  { id: "bolsas", nome: "Bolsas", icon: "bag" },
  { id: "amigurumis", nome: "Amigurumis", icon: "bear" },
  { id: "chaveiros", nome: "Chaveiros", icon: "key" },
  { id: "tapetes", nome: "Tapetes", icon: "rug" },
  { id: "sousplats", nome: "Sousplats", icon: "plate" },
  { id: "decoracao", nome: "Decoração", icon: "flower" },
  { id: "presentes", nome: "Presentes", icon: "gift" },
  { id: "personalizados", nome: "Personalizados", icon: "heart" },
  { id: "infantil", nome: "Infantil", icon: "sapatinho" },
  { id: "utilidades", nome: "Utilidades", icon: "cesto" }
];

let PRODUCTS_DEFAULT = [
  {
    id: "p01", nome: "Bolsa Rosê Trançada", categoria: "bolsas", preco: 189.9,
    status: "pronta", prazo: "Envio em até 2 dias úteis", cores: ["Rosé", "Off-white"],
    tamanho: "30x24cm", personalizavel: false, destaque: true, lancamento: false, maisVendido: true,
    desc: "Bolsa de mão trançada em fio egípcio, forro interno e alça dupla. Um clássico atemporal feito ponto a ponto."
  },
  {
    id: "p02", nome: "Ursinha Amigurumi Flor", categoria: "amigurumis", preco: 79.9,
    status: "encomenda", prazo: "7 a 10 dias úteis", cores: ["Bege", "Rosa claro", "Marrom"],
    tamanho: "22cm de altura", personalizavel: true, destaque: true, lancamento: true, maisVendido: false,
    desc: "Amigurumi macio com detalhe floral na orelha, ideal para presentear ou decorar o quarto do bebê."
  },
  {
    id: "p03", nome: "Chaveiro Coração de Fio", categoria: "chaveiros", preco: 24.9,
    status: "pronta", prazo: "Envio imediato", cores: ["Rosa", "Vermelho", "Bege"],
    tamanho: "6cm", personalizavel: false, destaque: false, lancamento: false, maisVendido: true,
    desc: "Mimo delicado em formato de coração, perfeito para lembrancinhas."
  },
  {
    id: "p04", nome: "Tapete Oval Terracota", categoria: "tapetes", preco: 259.0,
    status: "encomenda", prazo: "15 dias úteis", cores: ["Terracota", "Off-white", "Verde sálvia"],
    tamanho: "1,20 x 0,80m", personalizavel: true, destaque: true, lancamento: false, maisVendido: false,
    desc: "Tapete artesanal em fio de malha, macio e resistente, feito sob medida para o seu cantinho."
  },
  {
    id: "p05", nome: "Sousplat Trigo", categoria: "sousplats", preco: 39.9,
    status: "pronta", prazo: "Envio em até 2 dias úteis", cores: ["Cru", "Bege"],
    tamanho: "35cm de diâmetro", personalizavel: false, destaque: false, lancamento: false, maisVendido: false,
    desc: "Jogo de sousplat em ponto vazado, dá um toque acolhedor à mesa posta."
  },
  {
    id: "p06", nome: "Guirlanda Florzinhas", categoria: "decoracao", preco: 119.9,
    status: "encomenda", prazo: "10 dias úteis", cores: ["Rosé + Verde sálvia"],
    tamanho: "40cm", personalizavel: true, destaque: false, lancamento: true, maisVendido: false,
    desc: "Guirlanda com florzinhas de crochê, perfeita para porta ou parede da sala."
  },
  {
    id: "p07", nome: "Kit Maternidade Nuvem", categoria: "presentes", preco: 149.9,
    status: "encomenda", prazo: "12 dias úteis", cores: ["Branco", "Rosa bebê", "Azul serenity"],
    tamanho: "Único", personalizavel: true, destaque: true, lancamento: false, maisVendido: true,
    desc: "Kit com manta mini, sapatinho e chocalho em crochê — presente perfeito para chá de bebê."
  },
  {
    id: "p08", nome: "Bolsa Personalizada com Nome", categoria: "personalizados", preco: 219.9,
    status: "encomenda", prazo: "10 a 15 dias úteis", cores: ["A combinar"],
    tamanho: "A combinar", personalizavel: true, destaque: false, lancamento: false, maisVendido: false,
    desc: "Sua bolsa exclusiva, com nome ou iniciais bordadas em fio contrastante."
  },
  {
    id: "p09", nome: "Móbile Nuvem e Estrelas", categoria: "infantil", preco: 99.9,
    status: "encomenda", prazo: "8 dias úteis", cores: ["Rosa", "Amarelo", "Cinza"],
    tamanho: "50cm", personalizavel: true, destaque: false, lancamento: false, maisVendido: false,
    desc: "Móbile suave para o berço, feito com fios atóxicos e acabamento cuidadoso."
  },
  {
    id: "p10", nome: "Porta-treco Redondo", categoria: "utilidades", preco: 34.9,
    status: "pronta", prazo: "Envio em até 2 dias úteis", cores: ["Rosa queimado", "Creme"],
    tamanho: "12cm", personalizavel: false, destaque: false, lancamento: false, maisVendido: false,
    desc: "Cestinha para guardar miudezas na penteadeira ou mesa de trabalho."
  }
];

// ---- dados.json ----
// Se existir um arquivo dados.json na mesma pasta do site, ele substitui os dados acima.
// E o arquivo gerado pelo Editor do site. Se nao existir, vale o que esta neste arquivo.
async function carregarDados(){
  if(window.__PREVIEW_DATA){ const d = window.__PREVIEW_DATA; STORE_SETTINGS_DEFAULT = d.settings; CATEGORIES_DEFAULT = d.categories; PRODUCTS_DEFAULT = d.products; return; }
  try{
    const r = await fetch("dados.json", {cache:"no-cache"});
    if(!r.ok) return;
    const d = await r.json();
    if(d.settings) STORE_SETTINGS_DEFAULT = d.settings;
    if(Array.isArray(d.categories)) CATEGORIES_DEFAULT = d.categories;
    if(Array.isArray(d.products)) PRODUCTS_DEFAULT = d.products;
  }catch(e){ /* sem dados.json: usa os dados deste arquivo */ }
}

// ---- helpers de acesso ----
// O site publico le SEMPRE os dados deste arquivo (data.js).
// Apenas o painel interno (admin) liga window.USE_LOCAL_DATA para usar dados locais.
function _local(key, fallback){
  if(!window.USE_LOCAL_DATA) return fallback;
  try{
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  }catch(e){ return fallback; }
}
function getSettings(){ return _local("adm_settings", STORE_SETTINGS_DEFAULT); }
function getCategories(){ return _local("adm_categories", CATEGORIES_DEFAULT); }
function getProducts(){ return _local("adm_products", PRODUCTS_DEFAULT); }
function waLink(number, message){
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
