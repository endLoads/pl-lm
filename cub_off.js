(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v4.0 (Hybrid)';

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

    // 2. CSS (Тот самый, который работал)
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, .button--subscribe, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }

            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, div[class*="advertising"]
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
            }
            
            /* Стиль версии */
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px;
                opacity: 0.5; font-size: 1.1em; color: #fff;
                margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. ЗЛОЙ TimeKiller С ТАЙМЕРОМ (Hybrid Logic)
    var isBoostActive = false;
    var boostTimer = null;

    function activateBoost() {
        isBoostActive = true;
        if(boostTimer) clearTimeout(boostTimer); // Сброс таймера
    }

    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // ЛОГИКА ИЗ РАБОЧЕГО СКРИПТА:
            // Если таймер похож на рекламный (2.5 - 7 сек) -> Ускоряем в 1мс
            // НО! Только если isBoostActive == true (первые 6 сек)
            if (isBoostActive && delay > 2500 && delay < 7000) {
                // console.log('[Hybrid] Skip ' + delay + 'ms');
                return originalSetTimeout(func, 1); 
            }
            return originalSetTimeout(func, delay);
        };

        // Логика таймера отключения (через 6 секунд вырубаем "злость")
        activateBoost();
        boostTimer = originalSetTimeout(function() { 
            console.log('[Hybrid] Boost OFF');
            isBoostActive = false; 
        }, 6000);
        
        // Перезапуск таймера при каждом открытии плеера
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start') {
                activateBoost();
                boostTimer = originalSetTimeout(function() { isBoostActive = false; }, 6000);
            }
        });
    }

    // 4. СЕТЕВОЙ ПЕРЕХВАТЧИК (Из той же рабочей версии)
    // Но аккуратный, чтобы не ломать плагины (только для рекламы)
    function startNetworkInterceptor() {
        var blockList = ['vast', 'preroll', 'advertising', 'yandex.ru/ads', 'googleads'];
        
        var originalFetch = window.fetch;
        window.fetch = function(input, init) {
            var url = (typeof input === 'string') ? input : (input.url || '');
            for (var i = 0; i < blockList.length; i++) {
                if (url.indexOf(blockList[i]) !== -1) return Promise.reject('AdBlocked');
            }
            return originalFetch.apply(this, arguments);
        };
        
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string') {
                for (var i = 0; i < blockList.length; i++) {
                    if (url.indexOf(blockList[i]) !== -1) {
                        this.onerror = function() {}; 
                        return originalOpen.call(this, method, 'http://0.0.0.0'); 
                    }
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 5. ПРИНУДИТЕЛЬНАЯ ЧИСТКА (Тоже из рабочей версии)
    function forcePlay() {
        setInterval(function() {
            var adLayer = $('.player-advertising, .layer--advertising');
            if (adLayer.length) {
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                adLayer.remove();
            }
        }, 500);
    }

    // 6. ВСТАВКА ВЕРСИИ (Рабочий метод)
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
        hackTimeouts();          // <--- Злой хак + Таймер
        startNetworkInterceptor();
        forcePlay();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
