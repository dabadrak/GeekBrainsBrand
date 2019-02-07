class MiniShop {
  constructor (source, containerId, itemsQuantity, property, propertyValue) {
    this.source = source;
    this.containerId = containerId;
    this.itemsQuantity = itemsQuantity;
    this.property = property;
    this.propertyValue = propertyValue;
    this.items = [];
    this.cart = new Cart('../json/cart.json', '#cartDroptdown-items-wrap');
    this._init();
  }
  
  _init() {
    fetch(this.source)
        .then(result => {return result.json()})
        .then(data => {
          if (this.propertyValue) {
            data.forEach(item => {
              if (item[this.property] === this.propertyValue) {this.items.push(item)
              }
            })
          } else {
            console.log('MiniShop shows from all products');
            this.items = data
          }
        this._render(this.items, this.itemsQuantity)
        });
  }
  
  _render(items, quantity) {
    for (let i = 0; i < quantity; i++) {
      if (items[i]) {this._renderItem(items[i])}
      else {break}
    }
    $('.addToCart').click((e) => {
      const cartItem =
          {
            "id": +e.target.dataset.id,
            "name": e.target.dataset.name,
            "size": e.target.dataset.size,
            "color": e.target.dataset.color,
            "imgURL": e.target.dataset.imgurl,
            "price": +e.target.dataset.price,
            "quantity": 1
          };
      this.cart.addItem(cartItem)
    })
  }
  
  _renderItem(e) {
    new ShopItem(e.id, e.imgURL, e.name, e.size, e.color, e.designer, e.brand, e.category,
        e.sex, e.date, e.relativity, e.price, e.liked, this.containerId, '.product product__product-mini-shop');
  }
}