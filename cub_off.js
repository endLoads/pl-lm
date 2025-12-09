(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v5.0 (Direct Kill)';

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

    // 2. CSS (Скрываем визуально)
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
            .button--subscribe { display: none !important; }

            /* Делаем рекламу невидимой, но оставляем в потоке, чтобы JS её нашел */
            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
            }
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px;
                opacity: 0.5; font-size: 1.1em; color: #fff;
                margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. БЛОКИРОВКА НА УРОВНЕ ЯДРА (Без таймеров)
    function patchLampaCore() {
        // Подмена модуля рекламы
        if (Lampa.Ad) {
            Lampa.Ad.launch = function (data) {
                // Сразу говорим "реклама прошла"
                if (data && data.callback) data.callback();
            };
        }
    }

    // 4. АГРЕССИВНЫЙ КИЛЛЕР ПРИ СТАРТЕ
    function setupKiller() {
        // Слушаем запуск плеера
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start' || e.type === 'play') {
                // Запускаем "бешеный" цикл на 5 секунд
                var attempts = 0;
                var interval = setInterval(function() {
                    attempts++;
                    
                    // 1. Ищем рекламные слои
                    var ads = $('.player-advertising, .layer--advertising, #oframe_player_advertising');
                    
                    if (ads.length > 0) {
                        // Нашли! Удаляем!
                        ads.remove();
                        // Сообщаем плееру, что всё ок
                        if (Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                        
                        // Если видео стоит на паузе (из-за рекламы) - включаем
                        var video = $('video')[0];
                        if (video && video.paused) {
                            try { video.play(); } catch(err){}
                        }
                    }

                    // 2. Ищем кнопки "Пропустить"
                    $('.skip-button, .ad-skip-button').click();

                    // Останавливаем через 500 попыток (около 5 сек)
                    if (attempts > 500) clearInterval(interval);
                    
                }, 10); // Проверка каждые 10мс (очень быстро)
            }
        });
    }

    // 5. СЕТЕВОЙ ПЕРЕХВАТЧИК (Для надежности)
    function startNetworkInterceptor() {
        var blockList = ['vast', 'preroll', 'advertising', 'yandex.ru/ads', 'googleads'];
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string') {
                for (var i = 0; i < blockList.length; i++) {
                    if (url.indexOf(blockList[i]) !== -1) {
                        this.onerror = function() {}; 
                        return originalOpen.call(this, method, 'about:blank'); 
                    }
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 6. UI
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
        patchLampaCore();        // <--- Патч ядра вместо таймеров
        setupKiller();           // <--- Быстрый киллер при старте
        startNetworkInterceptor();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
