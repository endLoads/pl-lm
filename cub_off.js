(function () {
    'use strict';

    // 1. КОНФИГУРАЦИЯ
    var _cleanSettings = {
        lang: 'ru',
        lang_use: true,
        read_only: false,
        account_use: true,
        account_sync: true,
        socket_use: true,
        plugins_use: true,
        plugins_store: true,
        torrents_use: true,
        iptv: false,
        feed: false,
        push_state: true,
        white_use: false,
        dcma: false,
        developer: { fps: false, log: false, status: false, active: false },
        disable_features: {
            dmca: true,
            ads: true,
            trailers: false,
            reactions: false,
            discuss: false,
            ai: true,
            subscribe: true,
            blacklist: true,
            persons: true
        }
    };
    window.lampa_settings = _cleanSettings;

    // 2. ВИЗУАЛЬНАЯ БЛОКИРОВКА (CSS)
    function injectUltimateCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, .ad-server-resize, [data-component="ad"], .card-promo,
            .button--subscribe, .settings--account-premium, .open--notice,
            .selectbox-item__lock 
            { display: none !important; }

            /* Скрываем рекламу, НО оставляем ее в DOM, чтобы JS мог ее "перемотать" */
            .player-advertising, 
            #oframe_player_advertising,
            .layer--advertising,
            .ad-preroll-container,
            div[class*="advertising"],
            div[id*="advertising"],
            div[class*="preroll"]
            {
                opacity: 0 !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                /* Не используем display:none для плеера, иначе он может встать на паузу */
                visibility: hidden !important; 
            }
        `;
        document.body.appendChild(style);
    }

    // 3. УСКОРИТЕЛЬ (Speed Hack) - Решает проблему задержки
    function startSpeedHack() {
        setInterval(function() {
            // Ищем признаки рекламы
            var adLayers = document.querySelectorAll('.player-advertising, .layer--advertising, #oframe_player_advertising, .ad-preroll-container');
            var isAdPresent = false;
            
            // Проверяем, есть ли хоть один рекламный слой
            if (adLayers.length > 0) isAdPresent = true;
            
            // Также ищем по ключевым словам в классах body или плеера
            if ($('body').hasClass('ad-playing') || $('.vjs-ad-playing').length) isAdPresent = true;

            var video = document.querySelector('video');

            if (video && isAdPresent) {
                // Если реклама есть - УСКОРЯЕМ
                console.log('[AdBlock] Ускоряем скрытую рекламу (x16)...');
                
                if (video.playbackRate !== 16) video.playbackRate = 16;
                if (!video.muted) video.muted = true; // Глушим звук
                
                // Если видео стоит на паузе (иногда реклама ждет клика) - принудительно пускаем
                if (video.paused) {
                    try { video.play(); } catch(e) {}
                }
            } else if (video && !isAdPresent) {
                // Если рекламы нет (фильм) - возвращаем норму
                // Но только если скорость была изменена нами (чтобы не ломать перемотку пользователя)
                if (video.playbackRate === 16) {
                    console.log('[AdBlock] Реклама кончилась, возврат скорости (x1)');
                    video.playbackRate = 1;
                    video.muted = false; // Включаем звук обратно
                }
            }
        }, 500); // Проверка каждые полсекунды
    }

    // 4. БЛОКИРОВКА НА УРОВНЕ ЯДРА
    function patchLampaCore() {
        if (Lampa.Ad) {
            Lampa.Ad.launch = function (data) {
                if (data && data.callback) data.callback();
            };
        }
    }

    // 5. DOM ОЧИСТКА (Вспомогательная)
    function startDomDefender() {
        // Удаляем только статические баннеры, не трогаем плеер (его ускоряет SpeedHack)
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                             // Удаляем текстовые надписи "Реклама", которые не видео
                             if (node.textContent.trim() === 'Реклама' && node.tagName !== 'VIDEO') {
                                 node.remove();
                             }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ЗАПУСК
    function startPlugin() {
        var time = new Date().getTime();
        localStorage.setItem("region", JSON.stringify({code: "uk", time: time}));
        
        injectUltimateCSS();
        patchLampaCore();
        startSpeedHack(); // <-- Запуск ускорения
        startDomDefender();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
