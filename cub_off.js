(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v2.0';

    // 1. КОНФИГУРАЦИЯ (Безопасная)
    var _cleanSettings = {
        lang: 'ru', lang_use: true, read_only: false,
        account_use: true, account_sync: true, socket_use: true,
        plugins_use: true, plugins_store: true, torrents_use: true,
        iptv: false, feed: false, push_state: true,
        white_use: false, dcma: false,
        developer: { fps: false, log: false, status: false, active: false },
        disable_features: { 
            dmca: true, ads: true, trailers: false, reactions: false, 
            discuss: false, ai: true, subscribe: true, blacklist: true, persons: true 
        }
    };
    window.lampa_settings = _cleanSettings;

    // 2. CSS ОЧИСТКА (Безопасная, не ломает плеер)
    function injectSafeCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            /* Скрываем мусор */
            .ad-server, [data-component="ad"], .card-promo, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
            
            /* Скрываем кнопку подписки, чтобы заменить её */
            .button--subscribe { display: none !important; }

            /* Скрываем рекламные слои плеера (визуально) */
            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
                width: 0 !important; height: 0 !important;
            }
            
            /* Стили для нашей плашки версии */
            .cub-off-badge {
                display: inline-block;
                padding: 0.5em 1em;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                font-size: 0.9em;
                color: #aaa;
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin-left: 10px;
            }
        `;
        document.body.appendChild(style);
    }

    // 3. ЗАМЕНА РЕКЛАМЫ НА ИНФО (Inject UI)
    function injectInfo() {
        // Мы ищем место, где была кнопка подписки или профиль
        Lampa.Listener.follow('activity', function (e) {
            if (e.component === 'settings') {
                setTimeout(function() {
                    // Ищем контейнер с кнопками (обычно там кнопка CUB Premium)
                    var container = $('.settings__header .settings__params'); 
                    
                    // Если не нашли, ищем просто в хедере
                    if (!container.length) container = $('.settings__header');

                    // Проверяем, чтобы не добавить 10 раз
                    if (!$('.cub-off-badge').length) {
                        var badge = $('<div class="cub-off-badge">' + PLUGIN_VERSION + '</div>');
                        container.append(badge);
                    }
                }, 300);
            }
            
            // Также пробуем вставить в меню слева (вместо рекламы)
            if (e.component === 'head') {
                 setTimeout(function() {
                     $('.open--notice').replaceWith('<div class="cub-off-badge" style="margin: 10px">' + PLUGIN_VERSION + '</div>');
                 }, 500);
            }
        });
    }

    // 4. ПРОСТОЙ УСКОРИТЕЛЬ (Безопасный)
    // Без взлома таймеров, просто удаляет слой рекламы если он появился
    function simpleAdKiller() {
        setInterval(function() {
            var ad = document.querySelector('.player-advertising, .layer--advertising');
            if (ad) {
                ad.remove();
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
            }
        }, 800);
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectSafeCSS();
        injectInfo();      // Вставляет версию
        simpleAdKiller();  // Удаляет рекламу
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
