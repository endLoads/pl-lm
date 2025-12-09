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

    // 2. CSS
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

    // 3. УМНЫЙ ВЗЛОМ ВРЕМЕНИ (Smart Time Killer)
    // Ускоряет таймеры ТОЛЬКО если реклама активна
    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // Проверяем, есть ли сейчас на экране признаки рекламы
            // (даже скрытой через CSS)
            var adExists = document.querySelector('.player-advertising, .layer--advertising, #oframe_player_advertising');
            
            // Ускоряем ТОЛЬКО если есть реклама И задержка похожа на рекламную (3-15 сек)
            if (adExists && delay > 2000 && delay < 16000) {
                console.log('[TimeKiller] Реклама обнаружена! Ускоряем таймер ' + delay + 'ms -> 1ms');
                return originalSetTimeout(func, 1);
            }
            
            // В остальных случаях (интерфейс плеера) - работаем штатно
            return originalSetTimeout(func, delay);
        };
    }

    // 4. СЕТЬ
    function startNetworkInterceptor() {
        var blockList = ['vast', 'preroll', 'advertising', 'yandex.ru/ads', 'googleads'];
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string') {
                for (var i = 0; i < blockList.length; i++) {
                    if (url.indexOf(blockList[i]) !== -1) {
                        this.onerror = function() {}; 
                        return originalOpen.call(this, method, 'http://0.0.0.0'); 
                    }
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 5. ПРИНУДИТЕЛЬНЫЙ ПУСК (Более аккуратный)
    function forcePlay() {
        // Проверяем раз в секунду, не зависло ли всё на рекламе
        setInterval(function() {
            var adLayer = $('.player-advertising, .layer--advertising');
            if (adLayer.length) {
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                adLayer.remove();
            }
            
            // НЕ трогаем video.play(), если пользователь сам нажал паузу
            // (определяем это: если нет рекламного слоя, то не вмешиваемся)
        }, 1000); 
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectCleanerCSS();
        hackTimeouts();
        startNetworkInterceptor();
        forcePlay();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
