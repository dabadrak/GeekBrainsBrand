class Checkout {
  constructor (items, total, containerId){
  this.items = items;
  this.total = total;
  this.containerId = containerId;
  this._init();
  }

_init(){
  this.render();
}

renderTotal() {
  $('#subtotal').text(`$${this.total}`);
  $('#total').text(`$${this.total}`)
}

changeItemQuantity(id) {
  let $itemContainer = this._getItemContainerById(id);
  const price = $itemContainer.data('price');
  const quantity = $itemContainer.find(`input#${id}`).val();
  const subTotal =  price * quantity;
  $itemContainer.find('.itemSubtotal').text(`$${subTotal}`);
  this.renderTotal()
}

render() {
  $(this.containerId).empty();
  if (this.items.length !== 0) {
    this.items.forEach(item => {
    this._renderItem(item)
    })
  } else {
    $(this.containerId).append('<h3>Nothing here yet</h3>')
  }
  this.renderTotal()
}

_getItemContainerById(id) {
    return $(this.containerId).find(`#${id}`)
}

_renderItem(item){
  let $itemContainer = $(`<div id="${item.id}" class="cartItem-container" data-price="${item.price}"></div>`);
  let $imgInner = $('<div class="cartItem-container-inner"/>');
  let $imgA = $('<a href="single-page.html"/>');
  let $img = $('<img/>', {
    src: item.imgURL,
    alt: 'product',
    width: 100,
    height: 115
  });
  let $textInner = $('<div class="cartItem-container-inner"/>');
  let $heading = $(`<a href="single-page.html"><h2>${item.name}</h2></a>`);
  let $paramContainer = $('<div/>');
  let $colorContainer = $(`<p>Color: <span class="color">${item.color}</span></p>`);
  let $sizeContainer = $(`<p>Size: <span class="size">${item.size}</span></p>`);
  let $priceInner = $(`<div class="cartItem-container-inner itemPrice">$${item.price}</div>`);
  let $quntityInner = $(`<div class="cartItem-container-inner"><label><input id="${item.id}" class="quantitySelector" type="number"
min="1"
value="${item.quantity}"></label></div>`);
  let $shippingInner = $('<div class="cartItem-container-inner">FREE</div>');
  let $totalInner = $(`<div class="cartItem-container-inner itemSubtotal">$${item.quantity * item.price}</div>`);
  let $delBtnInner = $(`<div class="cartItem-container-inner"><i id="${item.id}" class="fas fa-times-circle checkoutDelBtn"></i></div>`);

  $img.appendTo($imgA);
  $imgA.appendTo($imgInner);
  $imgInner.appendTo($itemContainer);
  $heading.appendTo($textInner);
  $colorContainer.appendTo($paramContainer);
  $sizeContainer.appendTo($paramContainer);
  $paramContainer.appendTo($textInner);
  $textInner.appendTo($itemContainer);
  $priceInner.appendTo($itemContainer);
  $quntityInner.appendTo($itemContainer);
  $shippingInner.appendTo($itemContainer);
  $totalInner.appendTo($itemContainer);
  $delBtnInner.appendTo($itemContainer);
  $(this.containerId).append($itemContainer);
  }
}