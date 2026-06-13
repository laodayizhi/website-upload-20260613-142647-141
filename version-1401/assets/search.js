(function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var category = document.querySelector('[data-search-category]');
  var results = document.querySelector('[data-search-results]');
  var catalog = typeof MovieCatalog !== 'undefined' ? MovieCatalog : [];

  if (!form || !input || !results) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  input.value = params.get('q') || '';
  if (category) {
    category.value = params.get('category') || '';
  }

  var card = function (movie) {
    return '<article class="movie-card" data-movie-card>' +
      '<a class="poster-link" href="' + movie.href + '" aria-label="观看' + escapeHtml(movie.title) + '">' +
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="rating-badge">' + movie.rating.toFixed(1) + '</span>' +
      '<span class="poster-play">▶</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<h3><a href="' + movie.href + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p class="movie-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</p>' +
      '<p class="movie-desc">' + escapeHtml(movie.oneLine) + '</p>' +
      '</div>' +
      '</article>';
  };

  var render = function () {
    var query = input.value.trim().toLowerCase();
    var categoryName = category ? category.value : '';
    var matched = catalog.filter(function (movie) {
      var haystack = [movie.title, movie.region, movie.type, movie.year, movie.category, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
      var textMatch = !query || haystack.indexOf(query) !== -1;
      var categoryMatch = !categoryName || movie.category === categoryName;
      return textMatch && categoryMatch;
    }).slice(0, 120);
    if (!matched.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配影片，请更换关键词。</div>';
      return;
    }
    results.innerHTML = matched.map(card).join('');
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var params = new URLSearchParams();
    if (input.value.trim()) {
      params.set('q', input.value.trim());
    }
    if (category && category.value) {
      params.set('category', category.value);
    }
    var nextUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', nextUrl);
    render();
  });

  input.addEventListener('input', render);
  if (category) {
    category.addEventListener('change', render);
  }
  render();

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
