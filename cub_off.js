(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v18.0 (Ghost Mode)';

    // 1. ПЕРЕХВАТЧИК Object.defineProperty (Fake Premium)
    try {
        var originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === 'hasPremium') {
                descriptor.value = function() { return true; };
                descriptor.writable = true; 
                descriptor.configurable = true;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
    } catch(e) {}

    // 2. БЕЗОПАСНЫЙ CSS
    function injectSafeCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, .ad-preroll, .player-advertising, .layer--advertising {
                opacity: 0 !important; visibility: hidden !important;
                z-index: -9999 !important; pointer-events: none !important;
                position: absolute !important; top: -9999px !important;
            }
            .button--subscribe, .card-promo, .settings--account-premium {
                display: none !important;
            }
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px 0;
                opacity: 0.6; font-size: 1em; color: #aaaaaa;
                margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
                pointer-events: none;
            }
            .cub-off-badge span { color: #b66ee8; font-weight: bold; } /* Фиолетовый Ghost */
        `;
        document.body.appendChild(style);
    }

    // 3. УМНЫЙ ПЕРЕХВАТ ТАЙМЕРОВ
    function patchTimers() {
        var originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            if (delay === 3500 || (delay > 3400 && delay < 3600)) {
                return originalSetTimeout(func, 1);
            }
            return originalSetTimeout(func, delay);
        };
    }

    // 4. БЛОКИРОВЩИК ШПИОНОВ (НОВОЕ!)
    function killSpyware() {
        // Очищаем локальные метки рекламы
        try {
            localStorage.removeItem('metric_ad_view');
            localStorage.removeItem('vast_device_uid');
            localStorage.removeItem('vast_device_guid');
        } catch(e) {}

        // Перехватываем запросы, если Lampa уже загружена
        var interval = setInterval(function() {
            if (typeof Lampa !== 'undefined') {
                // Глушим метрику CUB
                if (Lampa.ServiceMetric) {
                    Lampa.ServiceMetric.counter = function() { /* shhh... */ };
                    Lampa.ServiceMetric.histogram = function() { /* silence */ };
                }
                // Глушим статистику рекламы (если модуль доступен глобально)
                if (window.stat1launch) window.stat1launch = function() {};
                if (window.stat1error) window.stat1error = function() {};
                
                // Чистим настройки разработчика, чтобы не спамил в консоль
                if (Lampa.Settings && Lampa.Settings.developer) {
                    Lampa.Settings.developer.log = false;
                    Lampa.Settings.developer.active = false;
                }
                
                clearInterval(interval);
            }
        }, 1000);
        
        // Останавливаем через 30 секунд, чтобы не висел вечно
        setTimeout(function() { clearInterval(interval); }, 30000);
    }

    // 5. UI
    function injectInfo() {
        var observer = new MutationObserver(function(mutations) {
            var settingsBox = document.querySelector('.settings__content');
            if (settingsBox && !settingsBox.querySelector('.cub-off-badge')) {
                var badge = document.createElement('div');
                badge.className = 'cub-off-badge';
                // Меняем надпись на Ghost Mode
                badge.innerHTML = PLUGIN_VERSION + '<br>Status: <span>Ghost Mode</span>';
                settingsBox.appendChild(badge);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // 6. НАСТРОЙКИ ЛАМПЫ
    window.lampa_settings = window.lampa_settings || {};
    window.lampa_settings.account_use = true;
    window.lampa_settings.disable_features = { 
        dmca: true, ads: true, trailers: false, 
        reactions: false, discuss: false, ai: true,
        blacklist: true // Отключаем черный список (еще больше контента)
    };

    // 7. ЗАПУСК
    function init() {
        injectSafeCSS();
        patchTimers();
        killSpyware(); // <-- Запуск анти-шпиона
        injectInfo();
        
        if (typeof Lampa !== 'undefined' && Lampa.Account) {
            try { Lampa.Account.hasPremium = function() { return true; }; } catch(e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
