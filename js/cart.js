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
