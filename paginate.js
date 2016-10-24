//paginate.js
//usage: Paginate(el, [options])

(function(exports) {
  'use strict';
  let Paginate = function(el, {
    pageNumbers,
    // `Must be an even number greater than or equal to 6 such as ${6,8,10...}`
    pageVisible = 6,
    pageCallback = function() {}
  } = {}) {
    let pageStart = 1,
      pageIndex = 1,
      minValue = 6,
      hasGap = true,
      pageHalf = Math.ceil(pageVisible / 2 + (pageVisible % 2 ? 0 : 1)),
      pageLimit = pageVisible;
      
    function paginate() {
      if (pageNumbers < pageVisible) return false;
      if(pageVisible % 2 || pageVisible < minValue) return false;
      if (pageNumbers - pageVisible < pageHalf) hasGap = false;
      
      render(pageVisible);
      el.addEventListener('click', pageClickHandler);
    }

    function render(limit) {
      var html = '',
        pages = pageStart,
        data = [];
      if (pageNumbers >= pageVisible) {
        if (pageIndex === 1) html += '<span class="prev disabled">Previous</span>';
        else html += '<a href="#" class="prev">Previous</a>';
      }
      if (hasGap && pageIndex > pageHalf) {
        html += '<a href="#" class="first">1</a>';
        html += '<span class="gap">...</span>';
      }
      for (pages; pages <= limit; pages++) {
        if (pages == pageIndex) {
          html += `<span class="page-item current">${pages}</span>`;
        } else html += `<a href="#" class="page-item">${pages}</a>`;
        data.push(pages);
      }
      if (hasGap && pages <= pageNumbers - 1) {
        html += '<span class="gap">...</span>';
        html += `<a href="#" class="last">${pageNumbers}</a>`;
      }
      if (pageNumbers >= pageVisible) {
        if (pageIndex === pageNumbers) html += '<span class="disabled">Next</span>';
        else html += '<a href="#" class="next">Next</a>';
      }
      el.innerHTML = html;
      getPageKeys(el, data);
      pageCallback.call(this, el, pageIndex);
    }

    function getPageKeys(el, data) {
      var child = el.querySelectorAll('.page-item');
      for (var i = 0, len = child.length; i < len; i++) 
        child[i].key = data[i];
      return;
    }

    function viewPageNumbers() {
      if (pageIndex <= pageHalf) {
        pageStart = 1;
        pageLimit = pageVisible;
      } else {
        var diff = pageIndex - pageHalf;
        if (hasGap) {
          pageStart = Math.min(diff + 2, pageNumbers - pageVisible + 1);
          if (pageNumbers - pageIndex < pageHalf) pageLimit = pageNumbers;
          else pageLimit = pageStart + pageVisible - 2;
        } else {
          pageStart = Math.min(diff + 1, pageNumbers - pageVisible + 1);
          pageLimit = Math.min(pageStart + pageVisible - 1, pageNumbers);
        }
      }
      render(pageLimit);
    }

    function pageClickHandler(e) {
      e.preventDefault();
      var target = e.target;
      if (target.nodeName !== 'A') {
        return false;
      }
      switch (target.className) {
        case 'page-item':
          pageIndex = target.key;
          break;
        case 'last':
          pageIndex = pageNumbers;
          break;
        case 'first':
          pageIndex = 1;
          break;
        case 'next':
          pageIndex = Math.min(pageIndex += 1, pageNumbers);
          break;
        case 'prev':
          pageIndex = Math.max(pageIndex -= 1, 1);
          break;
        default:
      }
      viewPageNumbers();
    }
    return paginate();
  }
  exports.Paginate = Paginate;
})(window);
