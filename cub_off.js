(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v10.0 (God Mode)';

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

    // 3. GOD MODE TIME KILLER
    var isGodMode = false;      // Если true - ускоряем ВСЕГДА (игнорируем паузу)
    var isKillerPaused = false; // Если true - не ускоряем (если не GodMode)
    var pauseTimer = null;
    var godTimer = null;

    function activateGodMode() {
        // console.log('[GodMode] ON (2 sec)');
        isGodMode = true;
        
        if (godTimer) clearTimeout(godTimer);
        
        // Через 3 секунды выключаем GodMode
        // Используем originalSetTimeout из замыкания ниже, но тут нужен трюк
    }

    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;

        // Таймер для выключения GodMode
        var stopGodMode = function() {
            if (godTimer) clearTimeout(godTimer);
            godTimer = originalSetTimeout(function() {
                // console.log('[GodMode] OFF -> Interactive Mode');
                isGodMode = false;
            }, 3000); // 3 секунды жесткого ускорения
        };

        // Таймер для паузы от кликов
        var startPauseTimer = function() {
            if (pauseTimer) clearTimeout(pauseTimer);
            pauseTimer = originalSetTimeout(function() {
                isKillerPaused = false;
            }, 6000);
        };

        // Перехват кликов
        var userAction = function() {
            // Если включен GodMode - игнорируем клики пользователя!
            if (isGodMode) return;
            
            // Иначе - ставим на паузу
            isKillerPaused = true;
            startPauseTimer();
        };

        // Хакнутый таймер
        window.setTimeout = function(func, delay) {
            // ЛОГИКА:
            // 1. Если GodMode -> УСКОРЯЕМ (реклама при старте)
            // 2. Иначе, если НЕ Пауза И задержка > 2500 -> УСКОРЯЕМ (реклама посреди фильма)
            
            if (isGodMode && delay > 1000) {
                 return originalSetTimeout(func, 1);
            }
            
            if (!isGodMode && !isKillerPaused && delay > 2500 && delay < 9000) {
                 return originalSetTimeout(func, 1);
            }
            
            return originalSetTimeout(func, delay);
        };

        // Слушатели
        window.addEventListener('keydown', userAction, true);
        window.addEventListener('click', userAction, true);
        
        // Слушаем старт плеера -> ВКЛЮЧАЕМ GOD MODE
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start' || e.type === 'play') {
                activateGodMode();
                stopGodMode(); // Запускаем таймер отключения
            }
        });
        
        // На всякий случай ловим событие рекламы
        Lampa.Listener.follow('ad', function() {
            activateGodMode();
            stopGodMode();
        });
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
        hackTimeouts(); 
        forcePlay();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
