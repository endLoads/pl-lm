(function () {
    'use strict';

    // 1. КОНФИГУРАЦИЯ
    var _cleanSettings = {
        lang: 'ru', lang_use: true, read_only: false,
        account_use: true, account_sync: true, socket_use: true,
        plugins_use: true, plugins_store: true, torrents_use: true,
        iptv: false, feed: false, push_state: true,
        white_use: false, dcma: false,
        developer: { fps: false, log: false, status: false, active: false },
        disable_features: { dmca: true, ads: true, trailers: false, reactions: false, discuss: false, ai: true, subscribe: true, blacklist: true, persons: true }
    };
    window.lampa_settings = _cleanSettings;

    // 2. CSS (Скрываем визуально)
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, .button--subscribe, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }

            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
            }
        `;
        document.body.appendChild(style);
    }

    // 3. ВЗЛОМ ТАЙМЕРОВ (TIME KILLER) - ГЛАВНОЕ ИСПРАВЛЕНИЕ
    function hackTimeouts() {
        console.log('[TimeKiller] Перехват таймеров запущен');
        
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // Если таймер ставится на 3-7 секунд (типичное ожидание рекламы)
            if (delay > 2500 && delay < 7000) {
                console.log('[TimeKiller] Найден подозрительный таймер (' + delay + 'ms) -> Ускоряем до 1ms');
                // Заменяем задержку на 1 миллисекунду (мгновенно)
                return originalSetTimeout(func, 1); 
            }
            // Все остальные таймеры работают как обычно
            return originalSetTimeout(func, delay);
        };
    }

    // 4. СЕТЕВОЙ БЛОК (Чтобы реклама падала в ошибку сразу)
    function startNetworkInterceptor() {
        var blockList = ['vast', 'preroll', 'advertising', 'yandex.ru/ads', 'googleads'];
        
        var originalFetch = window.fetch;
        window.fetch = function(input, init) {
            var url = (typeof input === 'string') ? input : (input.url || '');
            for (var i = 0; i < blockList.length; i++) {
                if (url.indexOf(blockList[i]) !== -1) return Promise.reject('AdBlocked');
            }
            return originalFetch.apply(this, arguments);
        };
        
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string') {
                for (var i = 0; i < blockList.length; i++) {
                    if (url.indexOf(blockList[i]) !== -1) {
                        // Важно: не просто блокируем, а вызываем ошибку, чтобы сработал таймер восстановления
                        this.onerror = function() {}; 
                        return originalOpen.call(this, method, 'http://0.0.0.0'); 
                    }
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 5. ПРИНУДИТЕЛЬНЫЙ СТАРТ ПЛЕЕРА
    function forcePlay() {
        setInterval(function() {
            // Если видим слой рекламы
            if ($('.player-advertising, .layer--advertising').length) {
                // Пытаемся сообщить Лампе, что реклама кончилась
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                
                // Удаляем слой
                $('.player-advertising, .layer--advertising').remove();
            }
            
            // Если видео есть, но стоит на паузе в начале (0 сек)
            var video = $('video')[0];
            if (video && video.paused && video.currentTime < 1) {
                // Проверяем, не нажимал ли пользователь паузу сам. 
                // Обычно реклама блокирует воспроизведение. Пытаемся пустить.
                video.play().catch(function(e){});
            }
        }, 500);
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectCleanerCSS();
        hackTimeouts();          // <--- Включаем перехват времени
        startNetworkInterceptor();
        forcePlay();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
