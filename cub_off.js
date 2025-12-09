(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v15.0 (Anti-Freeze)';

    // 1. CONFIG
    window.lampa_settings = {
        lang: 'ru', lang_use: true, read_only: false,
        account_use: true, account_sync: true, socket_use: true,
        plugins_use: true, plugins_store: true, torrents_use: true,
        iptv: false, feed: false, push_state: true,
        white_use: false, dcma: false,
        developer: { fps: false, log: false, status: false, active: false },
        disable_features: { dmca: true, ads: true, trailers: false, reactions: false, discuss: false, ai: true, subscribe: true, blacklist: true, persons: true }
    };

    // 2. CSS
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
            .button--subscribe { display: none !important; }
            .player-advertising, #oframe_player_advertising, .layer--advertising,
            .ad-preroll-container, .ad-preroll
            {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
                width: 0 !important; height: 0 !important;
            }
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px; opacity: 0.5; 
                font-size: 1.1em; color: #fff; margin-top: 20px; 
                border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. УБИЙЦА ТАЙМЕРОВ (Усиленный)
    function killPrerollTimers() {
        var originalSetTimeout = window.setTimeout;
        
        window.setTimeout = function(func, delay) {
            // В коде задержка ровно 3500.
            // Но мы берем диапазон на случай микро-изменений
            if (delay >= 3400 && delay <= 3600) {
                 // console.log('[CUB OFF] Killed 3.5s timer');
                 return originalSetTimeout(func, 1);
            }
            // Также убиваем 5000 (на всякий случай)
            if (delay === 5000) {
                 return originalSetTimeout(func, 1);
            }
            return originalSetTimeout(func, delay);
        };
    }
    
    // 4. ВЗЛОМ АККАУНТА (НОВЫЙ МЕТОД)
    // Мы переопределяем defineProperty, чтобы Лампа не могла заблокировать hasPremium
    function preventAccountFreeze() {
        var originalDefineProperty = Object.defineProperty;
        
        Object.defineProperty = function(obj, prop, descriptor) {
            // Если Лампа пытается заморозить hasPremium
            if (prop === 'hasPremium') {
                // console.log('[CUB OFF] Prevented hasPremium freeze');
                descriptor.value = function() { return true; }; // Наша функция
                descriptor.writable = true; // Разрешаем перезапись
                descriptor.configurable = true;
            }
            return originalDefineProperty(obj, prop, descriptor);
        };
    }
    
    // 5. ОЧИСТКА DOM
    function forceCleaner() {
        setInterval(function() {
            var ads = document.querySelectorAll('.ad-preroll, .player-advertising');
            for(var i=0; i<ads.length; i++) {
                ads[i].remove();
            }
        }, 500);
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
        try {
            var time = new Date().getTime();
            localStorage.setItem("region", JSON.stringify({code: "uk", time: time}));
        } catch(e) {}
        
        preventAccountFreeze(); // <--- Запускаем перехватчик защиты
        injectCleanerCSS();
        killPrerollTimers();
        forceCleaner();
        injectInfo();
    }

    // Запускаем как можно раньше!
    startPlugin(); 

})();
