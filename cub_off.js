(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v8.0 (Smart Filter)';

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

    // 3. УМНЫЙ TIME KILLER
    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            
            // ЛОГИКА ФИЛЬТРАЦИИ:
            
            // 1. Если это точное рекламное время (5, 10, 15, 30 сек) -> УБИВАЕМ
            if (delay === 5000 || delay === 10000 || delay === 15000 || delay === 30000) {
                // console.log('[SmartFilter] Killed Ad Timer: ' + delay);
                return originalSetTimeout(func, 1);
            }
            
            // 2. Если это диапазон интерфейса (3-4 сек) -> НЕ ТРОГАЕМ
            if (delay >= 3000 && delay <= 4000) {
                // console.log('[SmartFilter] Saved UI Timer: ' + delay);
                return originalSetTimeout(func, delay);
            }

            // 3. Остальные подозрительные (от 6 до 9 сек) -> УБИВАЕМ (на всякий случай)
            if (delay > 6000 && delay < 9000) {
                 return originalSetTimeout(func, 1);
            }

            // Все остальное - пропускаем
            return originalSetTimeout(func, delay);
        };
    }

    // 4. CLEANER
    function forcePlay() {
        setInterval(function() {
            var adLayer = $('.player-advertising, .layer--advertising');
            if (adLayer.length) {
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                adLayer.remove();
            }
        }, 500);
    }

    // 5. UI
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
        hackTimeouts(); // <--- Умный фильтр
        forcePlay();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
