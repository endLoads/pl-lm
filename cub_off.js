(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v3.0 (Boost)';

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
    function injectSafeCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
            .button--subscribe { display: none !important; }

            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
            }
            .cub-off-badge {
                display: inline-block; padding: 0.5em 1em;
                background: rgba(255,255,255,0.1); border-radius: 4px;
                font-size: 0.8em; color: #888; margin-top: 10px;
                border: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. ВРЕМЕННЫЙ УСКОРИТЕЛЬ (Timed Boost)
    var isBoostActive = false; // Флаг: включено ускорение или нет

    function activateBoost() {
        console.log('[Boost] Активация ускорения на 6 секунд...');
        isBoostActive = true;
        
        // Через 6 секунд выключаем магию
        // Используем нативный setTimeout, который мы сохраним ниже
        // (но так как мы хакаем глобальный, тут нужен хитрый ход)
    }

    function setupTimeHack() {
        var originalSetTimeout = window.setTimeout;
        
        // Наш взломанный таймер
        window.setTimeout = function(func, delay) {
            // Если ускорение АКТИВНО И задержка похожа на рекламную (3-10 сек)
            if (isBoostActive && delay > 2500 && delay < 11000) {
                // console.log('[Boost] Skip ' + delay + 'ms');
                return originalSetTimeout(func, 1); // Ускоряем
            }
            return originalSetTimeout(func, delay); // Обычный режим
        };

        // Запускаем таймер отключения буста
        // Мы используем originalSetTimeout, чтобы наш хак не ускорил сам себя
        activateBoost();
        originalSetTimeout(function() {
            console.log('[Boost] Ускорение отключено. Интерфейс в норме.');
            isBoostActive = false;
        }, 6000); // 6 секунд
        
        // Также включаем буст каждый раз, когда открывается плеер
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start') {
                activateBoost();
                originalSetTimeout(function() { isBoostActive = false; }, 6000);
            }
        });
    }

    // 4. UI ИНДИКАТОР
    function injectInfo() {
        Lampa.Listener.follow('activity', function (e) {
            if (e.component === 'settings') {
                setTimeout(function() {
                    if (!$('.cub-off-badge').length) {
                        $('.settings__header').append('<div class="cub-off-badge">' + PLUGIN_VERSION + '</div>');
                    }
                }, 300);
            }
        });
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectSafeCSS();
        setupTimeHack(); // <--- Запуск системы с бустом
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
