(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v9.0 (Interactive)';

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

    // 3. ИНТЕРАКТИВНЫЙ TIME KILLER
    var isKillerPaused = false;
    var pauseTimer = null;

    // Функция "Пауза убийцы" (вызывается при действиях пользователя)
    function pauseKiller() {
        // console.log('[Interactive] Пользователь активен -> Пауза ускорения');
        isKillerPaused = true;
        
        if (pauseTimer) clearTimeout(pauseTimer);
        
        // Возвращаем режим убийцы через 6 секунд бездействия
        // Используем originalSetTimeout (который мы сохраним ниже)
    }

    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        // Переопределяем паузу, чтобы использовать оригинал
        var startPauseTimer = function() {
            if (pauseTimer) clearTimeout(pauseTimer);
            pauseTimer = originalSetTimeout(function() {
                // console.log('[Interactive] Бездействие -> Включаем ускорение');
                isKillerPaused = false;
            }, 6000);
        };

        // Хакнутый таймер
        window.setTimeout = function(func, delay) {
            // Если режим НЕ на паузе И задержка похожа на рекламную (2.5 - 9 сек)
            if (!isKillerPaused && delay > 2500 && delay < 9000) {
                return originalSetTimeout(func, 1); // Ускоряем
            }
            return originalSetTimeout(func, delay);
        };

        // СЛУШАТЕЛИ АКТИВНОСТИ (Самое важное!)
        // Ловим любые нажатия на пульте или экране
        window.addEventListener('keydown', function() {
            pauseKiller();
            startPauseTimer();
        }, true);
        
        window.addEventListener('click', function() {
            pauseKiller();
            startPauseTimer();
        }, true);
        
        window.addEventListener('mousemove', function() {
             // Можно добавить и мышь, но осторожно (будет постоянно парить)
             // Лучше только клики
        }, true);
        
        // Также слушаем события Лампы (появление контроллера)
        Lampa.Listener.follow('toggle', function(e) {
            if(e.name === 'select' || e.name === 'enter') {
                pauseKiller();
                startPauseTimer();
            }
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
        hackTimeouts(); // <--- Интерактивный режим
        forcePlay();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
