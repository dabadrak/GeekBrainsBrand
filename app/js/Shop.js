class Shop {
  constructor(source, shopContainerClass) {
    this.source = source;
    this.shopContainerClass = shopContainerClass;
    this.items = []; //const
    this.groups = {};
    this.itemsInCurrentGroup = [];
    this.itemsInCurrentFilter = [];
    this.itemsInCurrentShowing = [];
    this.currenMaxPrice = 500;
    this.currenMinPrice = 0;
    this.currentSizesChecked = [];
    this.currentPage = 0;
    this.currentShowingValue = 0;
    this.cart = null;
    this._init();
  }
  
  _init() {
    this.currentPage = 0;
    this.itemsInCurrentFilter = this.items;
    this.itemsInCurrentGroup = this.items;
    this.cart = new Cart('cart.json', '#cartDroptdown-items-wrap');
    fetch(this.source)
        .then(result => result.json())
        .then(data => {
          data.forEach(e => {
            this.items.push(e);
          });
          this._render(+$showNode.val(), this.itemsInCurrentFilter);
          this._renderGroups();
          $sliderRange.slider('option', 'max', this._getMaxPrice());
          $sliderRange.slider('option', 'min', this._getMinPrice());
          this._initSlider();
        });
    
    //Showing change handler
    let $showNode = $('#show');
    this.currentShowingValue = $showNode.val();
    $showNode.on('change', () => this._render($showNode.val(), this.itemsInCurrentFilter));
  
    //View all handler
    $('#viewAll').click(() => this._showAll($showNode));
  
    //Sort by change handler
    let $sortNode = $('#sort-by');
    $sortNode.on('change', () => this._sortBy($sortNode.val()));
  
    
    //Switch group handler
    let $groupsNode = $('.product-filter-container');
    $groupsNode.on('click', 'li', e => {
      $groupsNode.find('.groupActive')
          .removeClass('groupActive');
      $(e.target).addClass('groupActive');
      this._setGroup(e.target.parentNode.dataset.id, e.target.textContent)});
  
    //Checking size handler
    let $sizeNode = $('#size');
    $sizeNode.on('click', 'input', () => {
      this.currentSizesChecked = [];
      let $checkedSizeInputs = $sizeNode.find(`input:checked`);
      $checkedSizeInputs.each((_, e) => this.currentSizesChecked.push(e.id));
      if (this.currentSizesChecked.length === 0) {
        this.itemsInCurrentFilter = this.itemsInCurrentGroup;
        this._render(this.currentShowingValue, this.itemsInCurrentFilter)
      } else {
        this._addFilters(this.currentSizesChecked, this.currenMinPrice, this.currenMaxPrice)
      }
    });
    
    //Slider-range handler
    let $sliderRange = $("#slider-range");
    $sliderRange.slider({
      range: true,
      values: [ 30, 80 ],
      slide: (event, ui) => {
        $( "#amountMin" ).val( "$" + ui.values[ 0 ]);
        $( "#amountMax" ).val( "$" + ui.values[ 1 ]);
        this.currenMaxPrice = ui.values[1];
        this.currenMinPrice = ui.values[0];
        this._addFilters(this.currentSizesChecked, this.currenMinPrice, this.currenMaxPrice)
      },
      stop: (event, ui) => {
      }
    });
    $( "#amountMin" ).val( "$" + $sliderRange.slider( "values", 0 ));
    $( "#amountMax" ).val( "$" + $sliderRange.slider( "values", 1 ));
  }
  
  _renderGroups() {
    $('.product-filter-container').find('details')
        .each((_, detailsElem) => {
          this.groups[detailsElem.id] = {};
          let groupsContents = [];
          this.items.forEach(item => {
            if (!groupsContents.includes(item[detailsElem.id])) {
              groupsContents.push(item[detailsElem.id]);
            }
          });
          let $ul = $('<ul/>', {
            class: 'product-filter-inner',
            'data-id': detailsElem.id
          });
          $ul.append('<li class="showAll">all</li>');
          groupsContents.forEach(e => {
            $(`<li>${e}</li>`).appendTo($ul)
          });
          $(detailsElem).append($(`<summary>${[detailsElem.id]}</summary>`));
          $(detailsElem).append($ul);
        });
  }
  
  _render(showValue, items) {
    const $pagination = $('#pagination');
    const $viewAllButton = $('#viewAll');
    $(this.shopContainerClass).empty();
    if (items.length === 0) {
      $(this.shopContainerClass).append('<h3>Nothing founded</h3>');
      $pagination.empty();
      $viewAllButton.hide();
      return;
    }
    this.currentShowingValue = +showValue;
    this.itemsInCurrentShowing = this._getItemsInCurrentShowing(items, +showValue);
    if (showValue === 'all' || +showValue >= items.length || Number.isNaN(showValue)) {
      $pagination.empty();
      $viewAllButton.hide();
      this.itemsInCurrentShowing = this._getItemsInCurrentShowing(items, items.length);
      this.currentPage = 0;
      this._renderPage(this.currentPage)
    } else {
      this.currentPage = 0;
      this._renderPage(this.currentPage);
      this._renderPagination(+showValue);
      $viewAllButton.show()
    }
  }
  
  _getItemsInCurrentShowing(items, showValue) {
    return items.map((_, i, a) => a.slice(i * showValue, i * showValue + showValue))
        .filter((el) => el.length);
  }
  
  _showAll(select) {
    this.currentPage = 0;
    this._render('all', this.itemsInCurrentFilter);
    select.val('all');
    console.log(this._getMaxPrice());
  }
  
  _renderItem(e) {
    new ShopItem(e.id, e.imgURL, e.name, e.size, e.color, e.designer, e.brand, e.category,
        e.sex, e.date, e.relativity, e.price, e.liked, this.shopContainerClass, '.product product__product-shop');
  }
  
  _renderPage(pageNumber) {
    $(this.shopContainerClass).empty();
    this.currentPage = pageNumber;
    this.itemsInCurrentShowing[pageNumber].forEach(e => {
      this._renderItem(e);
    });
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
  
  _renderPagination(showValue) {
    new Pagination('#pagination', showValue, this.itemsInCurrentFilter.length);
    $('.paginationPage').click(e => {
      this._switchPage(+e.target.dataset.page, this.currentPage)
    });
    $('#paginationPrevious').click(() => {
      if (this.currentPage !== 0) {
        this._switchPage(this.currentPage - 1, this.currentPage)
      }
    });
    $('#paginationNext').click(() => {
      if (this.currentPage !== this.itemsInCurrentShowing.length - 1) {
        this._switchPage(this.currentPage + 1, this.currentPage)
      }
    })
  }
  
  _switchPage(nextPage) {
    this._renderPage(nextPage);
    let $pagination = $('.pagination');
    $pagination.find('.active').removeClass('active');
    $pagination.find(`.paginationPage[data-page=${this.currentPage}]`).addClass('active');
  }
  
  _setGroup(groupName, value) {
    this._initSlider();
    $('#size input').prop('checked', false);
    this.currentPage = 0;
    this.itemsInCurrentGroup = [];
    this.items.forEach(item => {
      if (item[groupName] === value) {
        this.itemsInCurrentGroup.push(item)
      }
    });
    if (this.itemsInCurrentGroup.length === 0) {
      this.itemsInCurrentGroup = this.items
    }
    this.itemsInCurrentFilter = this.itemsInCurrentGroup;
    this._render(this.currentShowingValue, this.itemsInCurrentFilter)
  }
  
  _sortBy(parameter) {
    this.itemsInCurrentFilter.sort((a, b) => {
      if (a[parameter] > b[parameter]) {return 1}
      if (a[parameter] < b[parameter]) {return -1}
      return 0;
    });
    this._render(this.currentShowingValue, this.itemsInCurrentFilter);
  }
  
  _addFilters(sizeValues, min, max) {
    let arr =[];
    this.itemsInCurrentFilter = [];
    if (sizeValues.length !== 0) {
      this.itemsInCurrentGroup.forEach((item) => {
        sizeValues.forEach(e => {
          if (item['size'] === e) {
            arr.push(item)
          }
        })
      })
    } else {arr = this.itemsInCurrentGroup}
    
    arr.forEach(item => {
      if (item.price >= min && item.price <= max) {
        this.itemsInCurrentFilter.push(item)
      }
    });
    this._render(this.currentShowingValue, this.itemsInCurrentFilter);
  }
  
  _getMaxPrice() {
    let maxPrice = 0;
    this.items.forEach(item => {if (item.price > maxPrice) {maxPrice = item.price}});
    return maxPrice
  }
  
  _getMinPrice() {
    let minPrice = Infinity;
    this.items.forEach(item => {if (item.price < minPrice) {minPrice = item.price}});
    return minPrice
  }
  
  _initSlider (){
    let $sliderRange = $('#slider-range');
    $sliderRange.slider('option', 'values', [this._getMinPrice(), this._getMaxPrice()]);
    $( "#amountMin" ).val( "$" + $sliderRange.slider( "values", 0 ));
    $( "#amountMax" ).val( "$" + $sliderRange.slider( "values", 1 ));
  }
}

// TODO jsDoc
