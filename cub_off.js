(function () {
    'use strict';

    var PLUGIN_VERSION = 'v1.6 (Stable)';

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

    // 2. ЖЕСТКИЙ CSS (Вернул как было, когда работало)
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, .button--subscribe, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }

            /* Скрываем плеерные оверлеи */
            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"], div[id*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
                width: 0 !important; height: 0 !important;
            }
            
            /* Индикатор версии в настройках */
            .settings-footer-version {
                text-align: center; opacity: 0.3; font-size: 0.8em; margin-top: 20px;
            }
        `;
        document.body.appendChild(style);
    }

    // 3. УМНЫЙ ТАЙМ-КИЛЛЕР (Баланс между скоростью и интерфейсом)
    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // Если есть рекламный слой - ускоряем БЕЗЖАЛОСТНО
            if (document.querySelector('.player-advertising, .layer--advertising, #oframe_player_advertising, div[class*="advertising"]')) {
                 if (delay > 1000 && delay < 20000) {
                     return originalSetTimeout(func, 1);
                 }
            }
            // Если таймер подозрительно похож на рекламный (ровно 5 или 15 сек) - тоже режем
            // (даже если слоя еще нет в DOM, иногда скрипт запускается раньше)
            if (delay === 5000 || delay === 15000 || delay === 10000) {
                 return originalSetTimeout(func, 1);
            }

            return originalSetTimeout(func, delay);
        };
    }

    // 4. СЕТЕВОЙ ПЕРЕХВАТЧИК (Обязателен)
    function startNetworkInterceptor() {
        var blockList = ['vast', 'preroll', 'advertising', 'yandex.ru/ads', 'googleads', 'doubleclick'];
        
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string') {
                for (var i = 0; i < blockList.length; i++) {
                    if (url.indexOf(blockList[i]) !== -1) {
                        this.onerror = function() {}; // Вызываем ошибку сети
                        return originalOpen.call(this, method, 'http://0.0.0.0'); 
                    }
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 5. ИНТЕГРАЦИЯ ВЕРСИИ В НАСТРОЙКИ
    function injectVersionInfo() {
        // Мы используем листенер, чтобы поймать момент открытия настроек
        Lampa.Listener.follow('activity', function (e) {
            if (e.component === 'settings') {
                setTimeout(function() {
                    if (!$('.cub-off-ver').length) {
                        var ver = $('<div class="cub-off-ver">' + PLUGIN_VERSION + '</div>');
                        ver.css({
                            'text-align': 'center',
                            'opacity': '0.3',
                            'font-size': '0.9em',
                            'padding': '10px'
                        });
                        // Добавляем в конец списка настроек
                        $('.settings__content').append(ver);
                    }
                }, 500);
            }
        });
    }

    // ЗАПУСК
    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectCleanerCSS();
        startNetworkInterceptor();
        hackTimeouts(); // <--- Включаем тайм-киллер
        injectVersionInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
