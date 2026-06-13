function setupMoviePlayer(source) {
  var shell = document.querySelector('[data-player]');
  if (!shell) {
    return;
  }
  var video = shell.querySelector('video');
  var overlay = shell.querySelector('.player-overlay');
  var prepared = false;
  var hls = null;
  var attach = function () {
    if (prepared || !video || !source) {
      return;
    }
    prepared = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };
  var start = function () {
    attach();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    video.setAttribute('controls', 'controls');
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        video.setAttribute('controls', 'controls');
      });
    }
  };
  if (overlay) {
    overlay.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
