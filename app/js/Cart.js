class Cart {
  constructor (source, containerId) {
    this.source = source;
    this.containerId = containerId;
    this.items = [];
    this.total = [];
    this.currentScrollValue = 0;
    this.checkout = null;
    this._init();
  }
  
  _init() {
    if (!localStorage.getItem('cart')) {
      fetch(this.source)
          .then(result => result.json())
          .then(data => {
            data.forEach(e => {this.items.push(e)}); //Copying to items array
            localStorage.setItem('cart', JSON.stringify(this.items));
            this._renderPage(this.items, this.currentScrollValue);
            this.total[0] = this._getTotal(this.items);
            this._renderTotal();
          });
    } else {
      this.items = JSON.parse(localStorage.getItem('cart'));
      this._renderPage(this.items, this.currentScrollValue);
      this.total[0] = this._getTotal(this.items);
      this._renderTotal();
    }
    this._initScrolling();
  }
  
  addItem(item) {
    const find = this.items.find(e => e.id === item.id);
    if (find) {
      find.quantity++;
    } else {
      if (!item.id) {return}
      this.items.push(item);
      this.currentScrollValue = this.items.length - 2;
      $('#cartPageSwitchDown').removeClass('cartPageSwitch_active');
      if (this.items.length > 2) {$('#cartPageSwitchUp').addClass('cartPageSwitch_active')}
    }
    this._renderPage(this.items, this.currentScrollValue);
    this.total[0] = this._getTotal(this.items);
    this._renderTotal();
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  removeItem(id, destroy) {
    const find = this.items.find(e => e.id === +id);
    if (find.quantity === 1 || destroy) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === find.id) {
          this.items.splice(i, 1);
          break;
        }
      }
      if (this.currentScrollValue !== 0) {this.currentScrollValue--}
    } else {
      find.quantity--;
    }
    this.render();
    if (this.checkout) {
      this.checkout.render();
      $('.checkoutDelBtn').click(e => {
        this.removeItem(+e.target.id, true);
        this.checkout.renderTotal();
      });
      $('.quantitySelector').change(e => {
        this.changeItemQuantity(e.target.id, +e.target.value);
        this.checkout.changeItemQuantity(e.target.id);
      })
    }
  }
  
  changeItemQuantity(id, value) {
    this.items.find(e => e.id === +id).quantity = value;
    this.render()
  }
  
  render() {
    this._renderPage(this.items, this.currentScrollValue);
    this.total[0] = this._getTotal(this.items);
    this._renderTotal();
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  _getTotal(items) {
    let total = 0;
    items.forEach(e => {total += e.price * e.quantity});
    return total;
  }
  
  _renderTotal() {
    $('#cartTotal').text(`$${this.total[0]}`)
  }
  
  _renderPage(items, page) {
    let $pageSwitchers = $('.cartPageSwitch');
    if (items.length === 0) {
      $(this.containerId).text('Nothing here yet');
      $pageSwitchers.hide();
      return
    }
    let currentPage = items.slice(page, page + 2);
    if (items.length > 1 && currentPage.length < 2) {return}
    $(this.containerId).empty();
    
    items.length <= 2 ? $pageSwitchers.hide() : $pageSwitchers.show();
    currentPage.forEach(e => this._renderItem(e));
  }
  
  _renderItem(item) {
    let $itemContainer = $('<div/>', {
      class: 'cartDropdown-item',
    });
    let $itemImg = $('<img/>', {
      src: item.imgURL,
      alt: 'product',
      height: 82,
      width: 72
    });
    let $textWrap = $('<div/>', {
      class: 'cartDropdown-item-text'
    });
    let $name = $('<h3/>', {
      id: 'cartItemName',
      text: item.name
    });
    let $raiting = $('<img/>', {
      src: "img/rait-stars.png",
      alt: 'raiting',
      height: 12,
      width: 56
    });
    let $totalWrap = $(`<p><span id="cartItemQuantity">${item.quantity}</span> x $<span id="cartItemPrice">${item.price}</span></p>`);
    let $cartDelBtnWrap = $('<div class="cartDropdown-detBtn-wrap"/>');
    let $cartDelBtn =$('<i/>', {
      id: item.id,
      class: 'fas fa-times-circle'
    });
    
    $itemImg.appendTo($itemContainer);
    $name.appendTo($textWrap);
    $raiting.appendTo($textWrap);
    $totalWrap.appendTo($textWrap);
    $textWrap.appendTo($itemContainer);
    $cartDelBtn.appendTo($cartDelBtnWrap);
    $cartDelBtnWrap.appendTo($itemContainer);
    $(this.containerId).append($itemContainer);
    $cartDelBtn.click(e => this.removeItem(e.target.id))
  }
  
  _initScrolling() {
    let $cartScrollUp = $('#cartPageSwitchUp');
    let $cartScrollDown = $('#cartPageSwitchDown');
    $cartScrollUp.click(() => {
      if (this.currentScrollValue !== 0) {
        $cartScrollDown.addClass('cartPageSwitch_active');
        this.currentScrollValue--;
        this._renderPage(this.items, this.currentScrollValue)
      }
      if (this.currentScrollValue === 0) {
        $cartScrollUp.removeClass('cartPageSwitch_active')
      }
    });
    $cartScrollDown.click(() => {
      $cartScrollUp.addClass('cartPageSwitch_active');
      if (this.currentScrollValue < this.items.length - 2) {
        this.currentScrollValue++;
        this._renderPage(this.items, this.currentScrollValue)
      }
      if (this.currentScrollValue === this.items.length - 2) {
        $cartScrollDown.removeClass('cartPageSwitch_active')
      }
    });
  }
  
  createCheckout() {
    this.checkout = new Checkout(this.items, this.total, '#items-wrap');
  }
}