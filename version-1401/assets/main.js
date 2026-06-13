(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;
    var show = function (next) {
      index = next;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };
    var start = function () {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show((index + 1) % slides.length);
      }, 5000);
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    start();
  }

  var filterGrids = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid]'));
  filterGrids.forEach(function (grid) {
    var section = grid.closest('section') || document;
    var input = section.querySelector('[data-filter-input]');
    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-filter-field]'));
    var activeField = 'all';
    var activeValue = 'all';
    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var textMatch = !query || haystack.indexOf(query) !== -1;
        var fieldMatch = activeField === 'all' || activeValue === 'all' || (card.getAttribute('data-' + activeField) || '').indexOf(activeValue) !== -1;
        card.style.display = textMatch && fieldMatch ? '' : 'none';
      });
    };
    if (input) {
      input.addEventListener('input', apply);
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        activeField = button.getAttribute('data-filter-field') || 'all';
        activeValue = button.getAttribute('data-filter-value') || 'all';
        apply();
      });
    });
  });
})();
