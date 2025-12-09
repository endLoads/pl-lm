(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v6.0 (Sniper)';

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

    // 2. CSS (Только визуал)
    function injectCleanerCSS() {
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
                width: 0 !important; height: 0 !important;
            }
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px;
                opacity: 0.5; font-size: 1.1em; color: #fff;
                margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. SNIPER TIME HACK (Точечное ускорение)
    var isSniperActive = false;
    var sniperTimer = null;
    var originalSetTimeout = window.setTimeout; // Сохраняем чистый таймер

    function activateSniper() {
        // console.log('[Sniper] ON');
        isSniperActive = true;
        
        if (sniperTimer) clearTimeout(sniperTimer);
        
        // Выключаем снайпера через 4 секунды.
        // Используем originalSetTimeout, чтобы хак не ускорил сам себя!
        sniperTimer = originalSetTimeout(function() {
            // console.log('[Sniper] OFF');
            isSniperActive = false;
        }, 4000);
    }

    function setupTimeHack() {
        // Переопределяем глобальный таймер
        window.setTimeout = function(func, delay) {
            
            // ЛОГИКА:
            // Ускоряем ТОЛЬКО если активен снайпер И задержка > 2000мс (реклама)
            if (isSniperActive && delay > 2000 && delay < 9000) {
                return originalSetTimeout(func, 1); // Мгновенно!
            }
            
            // Иначе (интерфейс плеера, системные задержки) - работаем как обычно
            return originalSetTimeout(func, delay);
        };

        // СЛУШАТЕЛЬ ЗАПУСКА
        // Как только Lampa хочет открыть плеер -> ВРУБАЕМ СНАЙПЕРА
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start' || e.type === 'play') {
                activateSniper();
            }
        });
        
        // На случай, если событие 'ad' пролетит отдельно
        Lampa.Listener.follow('ad', function(e) {
            activateSniper();
        });
    }

    // 4. UI ИНДИКАТОР
    function injectInfo() {
        var observer = new MutationObserver(function(mutations) {
            var settingsBox = document.querySelector('.settings__content');
            if (settingsBox && !document.querySelector('.cub-off-badge')) {
                var badge = document.createElement('div');
                badge.className = 'cub-off-badge';
                badge.innerText = PLUGIN_VERSION;
                settingsBox.appendChild(badge);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectCleanerCSS();
        setupTimeHack(); // <--- Запуск системы снайпера
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
