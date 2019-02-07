class ShopItem {
  constructor(id, imgURL, name, size, color, designer, brand, category, sex, date, relativity, price, liked, containerClass, itemClass) {
    this.id = id;
    this.imgURL = imgURL;
    this.name = name;
    this.size = size;
    this.color = color;
    this.designer = designer;
    this.brand = brand;
    this.category = category;
    this.sex = sex;
    this.date = date;
    this.relativity = relativity;
    this.price = price;
    this.liked = liked;
    this.itemClass = itemClass;
    this._render(containerClass);
  }
  
  _render(containerClass) {
    let $wrapper = $('<article/>', {
      class: `product ${this.itemClass}`
    });
    let $articleA = $('<a/>', {
      href: 'single-page.html'
    });
    let $articleADiv = $('<div/>', {
      class: 'product-img-container product-img-container',
      css: {
        backgroundImage: `url("${this.imgURL}")`,
      }
    });
    let $articleAH2 = $('<h2/>', {
      text: this.name
    });
    let $articleAH3 = $('<h3/>', {
      text: `$${this.price}`
    });
    let $divAddToCart = $('<div/>', {
      class: 'add-to-cart'
    });
    let $divAddToCartACart = $('<a/>', {
      class: 'addToCart',
      html: '<img src="img/cart-icon-white.svg" alt="cart"> Add to cart',
      "data-id": this.id,
      "data-imgURL": this.imgURL,
      "data-name": this.name,
      "data-size": this.size,
      "data-color": this.color,
      "data-price": this.price
    });
    let $divAddToCartAFeed = $('<a/>', {
      href: 'https://twitter.com/'
    });
    let $divAddToCartAFeedI = $('<i/>', {
      class: 'fas fa-retweet fa-lg'
    });
    let $divAddToCartALike = $('<a/>', {
      href: 'shoping-cart.html'
    });
    let $divAddToCartALikeI = $('<i/>', {
      class: 'far fa-heart'
    });
    
    $articleADiv.appendTo($articleA);
    $articleAH2.appendTo($articleA);
    $articleAH3.appendTo($articleA);
    $articleA.appendTo($wrapper);
    $divAddToCartACart.appendTo($divAddToCart);
    $divAddToCartAFeedI.appendTo($divAddToCartAFeed);
    $divAddToCartAFeed.appendTo($divAddToCart);
    $divAddToCartALikeI.appendTo($divAddToCartALike);
    $divAddToCartALike.appendTo($divAddToCart);
    $divAddToCart.appendTo($wrapper);
    $(containerClass).append($wrapper);
  }
}