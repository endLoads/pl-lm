(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v4.1 (Event Boost)';

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
            .ad-server, [data-component="ad"], .card-promo, .button--subscribe, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
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

    // 3. УСКОРИТЕЛЬ ПО СОБЫТИЯМ (Event-based Boost)
    var isBoostActive = false; // По умолчанию ВЫКЛЮЧЕН
    var boostTimer = null;

    function activateBoost() {
        // console.log('[Boost] АКТИВИРОВАН на 15 сек');
        isBoostActive = true;
        
        if(boostTimer) clearTimeout(boostTimer);
        
        // Выключаем через 15 секунд (с запасом)
        // Используем хакнутый setTimeout, но он сам себя не ускорит, т.к. задержка 15000 (а мы хакаем < 7000)
        // На всякий случай используем нестандартное число 15500
        var originalSetTimeout = window.setTimeout; // Берем оригинал, если он еще доступен в замыкании
        
        boostTimer = originalSetTimeout(function() { 
            // console.log('[Boost] ОТКЛЮЧЕН');
            isBoostActive = false; 
        }, 15500);
    }

    function hackTimeouts() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // УСЛОВИЕ:
            // 1. Ускоритель включен (мы нажали плей недавно)
            // 2. Задержка похожа на рекламную (от 2 до 8 секунд)
            if (isBoostActive && delay > 2000 && delay < 8000) {
                // console.log('[Boost] Skip ' + delay + 'ms');
                return originalSetTimeout(func, 1); 
            }
            return originalSetTimeout(func, delay);
        };

        // Слушаем старт плеера, чтобы включить буст
        Lampa.Listener.follow('player', function(e) {
            if(e.type === 'start' || e.type === 'play') {
                activateBoost();
            }
        });
        
        // Также слушаем событие "реклама", если оно проскочит
        Lampa.Listener.follow('ad', function(e) {
             activateBoost();
        });
    }

    // 4. СЕТЕВОЙ ПЕРЕХВАТЧИК
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

    // 5. DOM CLEANER
    function forcePlay() {
        setInterval(function() {
            var adLayer = $('.player-advertising, .layer--advertising');
            if (adLayer.length) {
                if (Lampa.Player && Lampa.Player.trigger) Lampa.Player.trigger('ad_end');
                adLayer.remove();
            }
        }, 500);
    }

    // 6. VERSION UI
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
        startNetworkInterceptor();
        forcePlay();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
