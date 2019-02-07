class Pagination {
  constructor(containerID, showValue, total) {
    this.container = containerID;
    this.showValue = showValue;
    this.total = total;
    this._render();
  }
  
  _render() {
    let $ul = $('<ul/>', {
      class: 'pagination'
    });
    let $left = $('<li/>', {
      id: 'paginationPrevious',
      html: '<i class="fas fa-chevron-left"></i>',
    });
    let $right = $('<li/>', {
      id: 'paginationNext',
      html: '<i class="fas fa-chevron-right"></i>',
    });
    
    $(this.container).empty();
    $left.appendTo($ul);
    for (let i = 0; i < this.total / this.showValue; i++) {
      if (i === 0) {
        $ul.append(`<li class="paginationPage active" data-page="${i}">${i + 1}</li>`)
      } else {
      $ul.append(`<li class="paginationPage" data-page="${i}">${i + 1}</li>`)
      }
    }
    $right.appendTo($ul);
    $(this.container).append($ul);
  }
}