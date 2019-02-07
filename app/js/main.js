$(document).ready(() => {
  if (document.title !== 'Cart' || 'Home')
    new Cart('../json/cart.json', '#cartDroptdown-items-wrap');

  if (document.title === 'Product') {$(document).ready(() => {
    new Shop('../json/allGoods.json', '.product-shop');
  })}
  
  if (document.title === 'Home') {$(document).ready(() => {
    new MiniShop('../json/allGoods.json', '.mini-shop-container', 8)
  })}

  if (document.title === 'Cart') {$(document).ready(() => {
    let cart = new Cart('../json/cart.json', '#cartDroptdown-items-wrap');
    cart.createCheckout();
    $('.checkoutDelBtn').click(e => {
      cart.removeItem(+e.target.id, true);
      cart.checkout.renderTotal();
    });
    $('.quantitySelector').change(e => {
      cart.changeItemQuantity(e.target.id, e.target.value);
      cart.checkout.changeItemQuantity(e.target.id);
    });
    
    $('#emptyCart').click(() => {
      if (cart.items.length !== 0) {
        cart.items = [];
        cart.checkout.items = [];
        cart.render();
        cart.checkout.render();
      }
    })
  })}
});