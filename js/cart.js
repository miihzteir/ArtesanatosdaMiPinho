/* ==========================================================================
   Carrinho de compras (fica guardado no celular/computador de quem visita)
   ========================================================================== */
const CART_KEY = "mipinho-cart-v1";
let _memCart = [];

function readCart(){
  try{
    const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(c) ? c : [];
  }catch(e){ return _memCart.slice(); }
}
function writeCart(items){
  _memCart = items.slice();
  try{ localStorage.setItem(CART_KEY, JSON.stringify(items)); }catch(e){}
  updateCartBadge();
}
function addToCart(id, cor, qtd){
  const items = readCart();
  const n = Math.max(1, Math.min(99, parseInt(qtd, 10) || 1));
  const found = items.find(i => i.id === id && (i.cor || "") === (cor || ""));
  if(found) found.qtd = Math.min(99, found.qtd + n);
  else items.push({id, cor: cor || "", qtd: n});
  writeCart(items);
  document.querySelectorAll(".cart-link").forEach(el => {
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  });
}
function cartCount(){ return readCart().reduce((s, i) => s + (i.qtd || 0), 0); }
function updateCartBadge(){
  const n = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = n > 99 ? "99+" : String(n);
    el.hidden = n === 0;
  });
}

/* ==========================================================================
   Favoritos (lista de desejos, fica guardada no aparelho)
   ========================================================================== */
const FAV_KEY = "mipinho-fav-v1";
let _memFav = [];
function readFavs(){
  try{ const f = JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); return Array.isArray(f) ? f : []; }
  catch(e){ return _memFav.slice(); }
}
function writeFavs(list){
  _memFav = list.slice();
  try{ localStorage.setItem(FAV_KEY, JSON.stringify(list)); }catch(e){}
  updateFavBadge();
}
function isFav(id){ return readFavs().includes(id); }
function toggleFav(id){
  const l = readFavs(); const i = l.indexOf(id);
  if(i >= 0) l.splice(i, 1); else l.push(id);
  writeFavs(l);
  return i < 0;
}
function updateFavBadge(){
  const n = readFavs().length;
  document.querySelectorAll("[data-fav-count]").forEach(el => { el.textContent = String(n); el.hidden = n === 0; });
}

/* ==========================================================================
   Pix "copia e cola" (BR Code estático, padrão do Banco Central)
   ========================================================================== */
function _crc16(str){
  let crc = 0xFFFF;
  for(let i = 0; i < str.length; i++){
    crc ^= str.charCodeAt(i) << 8;
    for(let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function _tlv(id, value){ return id + String(value.length).padStart(2, "0") + value; }
function _limpa(s, max){
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").trim().toUpperCase().slice(0, max);
}
function pixPayload(chave, nome, cidade, valor){
  const conta = _tlv("00", "br.gov.bcb.pix") + _tlv("01", String(chave).trim());
  let p = _tlv("00", "01") + _tlv("26", conta) + _tlv("52", "0000") + _tlv("53", "986");
  if(valor > 0) p += _tlv("54", Number(valor).toFixed(2));
  p += _tlv("58", "BR") + _tlv("59", _limpa(nome, 25) || "LOJA") + _tlv("60", _limpa(cidade, 15) || "BRASIL") + _tlv("62", _tlv("05", "***"));
  p += "6304";
  return p + _crc16(p);
}
