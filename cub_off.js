(function () {
    'use strict';

    // ========================================================================
    // 1. КОНФИГУРАЦИЯ (Config)
    // ========================================================================
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
            ads: true,         // Главный рубильник
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

    // ========================================================================
    // 2. CSS-БЛОКИРОВКА (Визуальный слой)
    // ========================================================================
    function injectUltimateCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            /* Скрываем всё рекламное */
            .ad-server, .ad-server-resize, [data-component="ad"], .card-promo,
            .button--subscribe, .settings--account-premium, .open--notice,
            .selectbox-item__lock 
            { display: none !important; }

            /* УБИВАЕМ СЕРЫЙ ЭКРАН В ПЛЕЕРЕ */
            /* Блокируем любые оверлеи поверх видео, кроме контролов */
            .player-advertising, 
            #oframe_player_advertising,
            .layer--advertising,
            .ad-preroll-container,
            div[class*="advertising"],
            div[id*="advertising"],
            div[class*="preroll"],
            .vjs-ad-playing, .vjs-ad-loading 
            {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
                z-index: -9999 !important;
            }
            
            /* Если это iframe, делаем его прозрачным для кликов */
            iframe[src*="ad"] { display: none !important; }
        `;
        document.body.appendChild(style);
    }

    // ========================================================================
    // 3. БЛОКИРОВКА НА УРОВНЕ ЯДРА (JS Patch)
    // ========================================================================
    function patchLampaCore() {
        console.log('[AdBlock] Patching Lampa Core...');

        // 1. Отключаем модуль рекламы
        if (Lampa.Ad) {
            Lampa.Ad.launch = function (data) {
                console.log('[AdBlock] Lampa.Ad.launch blocked');
                if (data && data.callback) data.callback(); // Сразу "реклама прошла"
            };
        }

        // 2. Патчим плеер (Если реклама вызывается методами плеера)
        // Перехватываем метод добавления рекламы в плеер
        if (Lampa.Player) {
            var originalCallback = Lampa.Player.callback;
            
            // Если плеер пытается сообщить о событии рекламы - игнорируем
            /*
             Мы не можем легко перехватить внутренние методы плеера, 
             но можем слушать события и убивать их
            */
            Lampa.Player.listener.follow('ad', function(e) {
                console.log('[AdBlock] Event "ad" detected - destroying');
                $('.player-advertising').remove();
                if(Lampa.Player.video && Lampa.Player.video.play) Lampa.Player.video.play();
            });
        }
        
        // 3. Глобальный перехватчик сообщений (postMessage)
        // Часто реклама в iframe общается с основным окном
        window.addEventListener("message", function(event) {
            if (typeof event.data === 'string' && 
               (event.data.includes('ad') || event.data.includes('advertising'))) {
                console.log('[AdBlock] Blocked message:', event.data);
                event.stopImmediatePropagation();
            }
        }, true);
    }

    // ========================================================================
    // 4. МУТАЦИОННЫЙ ЩИТ (DOM Defender)
    // Следит, чтобы рекламный блок не появился в DOM
    // ========================================================================
    function startDomDefender() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        // Если это HTML элемент
                        if (node.nodeType === 1) { 
                            var className = node.className || "";
                            var idName = node.id || "";
                            var textContent = node.textContent || "";
                            
                            // Проверка по классам и ID
                            if (
                                (typeof className === 'string' && className.indexOf('advertising') !== -1) ||
                                (typeof idName === 'string' && idName.indexOf('advertising') !== -1) ||
                                (textContent.trim() === 'Реклама')
                            ) {
                                console.log('[AdBlock] Removing node:', node);
                                node.remove(); // Удаляем элемент мгновенно
                                
                                // Если видео стояло на паузе - запускаем
                                var video = document.querySelector('video');
                                if(video && video.paused) video.play();
                            }
                        }
                    });
                }
            });
        });

        // Следим за всем телом документа
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========================================================================
    // 5. ЗАПУСК
    // ========================================================================
    function startPlugin() {
        // Хак региона
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        
        injectUltimateCSS();
        patchLampaCore();
        startDomDefender();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
