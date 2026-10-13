/* ==========================================================================
   Artesanatos da Mi — dados da vitrine
   Estes dados também são usados pelo painel admin (localStorage).
   Para editar produtos sem mexer em código, use o painel /admin/produtos.html
   ========================================================================== */

const STORE_SETTINGS_DEFAULT = {
  brand: "Artesanatos da Mi",
  slogan: "Crochê com carinho em cada detalhe.",
  whatsapp: "5566999999999",
  instagram: "artesanatosdami",
  email: "contato@artesanatosdami.com.br",
  cidade: "Sinop - MT",
  horario: "Seg a sáb, 9h às 18h",
  whatsappMsgPadrao: "Olá, Mi! Gostaria de saber mais sobre os seus trabalhos de crochê."
};

const CATEGORIES_DEFAULT = [
  { id: "bolsas", nome: "Bolsas", icon: "bag" },
  { id: "amigurumis", nome: "Amigurumis", icon: "bear" },
  { id: "chaveiros", nome: "Chaveiros", icon: "key" },
  { id: "tapetes", nome: "Tapetes", icon: "rug" },
  { id: "sousplats", nome: "Sousplats", icon: "plate" },
  { id: "decoracao", nome: "Decoração", icon: "flower" },
  { id: "presentes", nome: "Presentes", icon: "gift" },
  { id: "personalizados", nome: "Personalizados", icon: "heart" },
  { id: "infantil", nome: "Infantil", icon: "bear" },
  { id: "utilidades", nome: "Utilidades", icon: "plate" }
];

const PRODUCTS_DEFAULT = [
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

// ---- helpers de acesso (com fallback para localStorage, usado pelo admin) ----
function getSettings(){
  try{
    const s = localStorage.getItem("adm_settings");
    return s ? JSON.parse(s) : STORE_SETTINGS_DEFAULT;
  }catch(e){ return STORE_SETTINGS_DEFAULT; }
}
function getCategories(){
  try{
    const c = localStorage.getItem("adm_categories");
    return c ? JSON.parse(c) : CATEGORIES_DEFAULT;
  }catch(e){ return CATEGORIES_DEFAULT; }
}
function getProducts(){
  try{
    const p = localStorage.getItem("adm_products");
    return p ? JSON.parse(p) : PRODUCTS_DEFAULT;
  }catch(e){ return PRODUCTS_DEFAULT; }
}
function waLink(number, message){
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
