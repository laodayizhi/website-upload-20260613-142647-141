(function () {
    var mobileToggle = document.querySelector('.mobile-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function () {
            var opened = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', String(!opened));
            mobilePanel.hidden = opened;
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var year = scope.querySelector('[data-year-filter]');
        var status = scope.querySelector('[data-filter-status]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .list-card'));
        var queryKey = scope.getAttribute('data-query-from-url');

        if (queryKey && input) {
            var params = new URLSearchParams(window.location.search);
            var queryValue = params.get(queryKey) || '';
            input.value = queryValue;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function filterCards() {
            var keyword = normalize(input ? input.value : '');
            var selectedYear = year ? year.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var yearMatched = !selectedYear || card.getAttribute('data-year') === selectedYear;
                var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
                var matched = yearMatched && keywordMatched;
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (status) {
                status.textContent = visible > 0 ? '匹配内容已更新' : '没有匹配内容';
            }
        }

        if (input) {
            input.addEventListener('input', filterCards);
        }
        if (year) {
            year.addEventListener('change', filterCards);
        }
        filterCards();
    });

    document.querySelectorAll('.player-card').forEach(function (card) {
        var video = card.querySelector('video');
        var button = card.querySelector('[data-video]');
        var hlsInstance = null;

        if (!video || !button) {
            return;
        }

        function startVideo() {
            var source = button.getAttribute('data-video');
            if (!source || button.dataset.started === '1') {
                video.play().catch(function () {});
                return;
            }

            button.dataset.started = '1';
            button.classList.add('is-hidden');

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {});
                }, { once: true });
            } else {
                video.src = source;
                video.play().catch(function () {});
            }
        }

        button.addEventListener('click', startVideo);
        video.addEventListener('click', function () {
            if (!button.dataset.started) {
                startVideo();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    });
})();
