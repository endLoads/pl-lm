(function () {
    'use strict';

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

    function injectUltimateCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, .ad-server-resize, [data-component="ad"], .card-promo,
            .button--subscribe, .settings--account-premium, .open--notice,
            .selectbox-item__lock { display: none !important; }

            /* Делаем рекламу невидимой, но доступной для кликов скрипта */
            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"], div[id*="advertising"],
            div[class*="preroll"] {
                opacity: 0 !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                visibility: hidden !important; 
            }
        `;
        document.body.appendChild(style);
    }

    // --- ГЛАВНАЯ ФИШКА: МГНОВЕННЫЙ ПРОПУСК ---
    function startInstantSkip() {
        // Таймер, который молотит очень часто (раз в 100мс)
        setInterval(function() {
            // 1. Ищем и жмем кнопку "Пропустить" (skip button)
            var skipButtons = $('.skip-button, .ad-skip-button, .videoAdUiSkipButton, [class*="skip"]');
            if (skipButtons.length) {
                console.log('[AdSkip] Нажимаем кнопку пропуска');
                skipButtons.click();
            }

            // 2. Ищем слой рекламы
            var adLayer = $('.player-advertising, .layer--advertising, #oframe_player_advertising, .ad-preroll-container');
            
            if (adLayer.length) {
                console.log('[AdSkip] Найден слой рекламы, пытаемся убить...');
                
                // А. Пытаемся удалить слой (жестко)
                adLayer.remove();
                
                // Б. Пытаемся пнуть видео
                var video = $('video')[0];
                if (video) {
                    // Если это рекламное видео (короткое) - ставим в конец
                    if (video.duration < 60) {
                        video.currentTime = video.duration;
                    }
                    // Если видео на паузе - запускаем
                    if (video.paused) video.play();
                }
                
                // В. Сообщаем Лампе, что реклама всё (если есть такой метод)
                if (Lampa.Player && Lampa.Player.trigger) {
                     Lampa.Player.trigger('ad_end'); 
                }
            }

        }, 100); 
    }

    function patchLampaCore() {
        if (Lampa.Ad) {
            Lampa.Ad.launch = function (data) {
                if (data && data.callback) data.callback();
            };
        }
        // Перехватываем создание таймера рекламы
        var originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            // Если функция похожа на рекламную задержку (обычно 5000мс или 15000мс)
            if (delay === 5000 || delay === 15000 || delay === 10000) {
                // Пытаемся понять контекст (сложно, но можно попробовать просто сократить)
                // Рискованно: может сломать интерфейс.
                // return originalSetTimeout(func, 100); // Сокращаем до 0.1с
            }
            return originalSetTimeout(func, delay);
        };
    }

    function startPlugin() {
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectUltimateCSS();
        patchLampaCore();
        startInstantSkip(); // Запуск "кликера"
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
