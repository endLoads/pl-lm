(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v17.0 (Stable)';
    // console.log('[CUB OFF] Started:', PLUGIN_VERSION);

    // 1. ПЕРЕХВАТЧИК Object.defineProperty (Взлом защиты hasPremium)
    // Делаем это первым делом, чтобы Лампа не успела защитить объект
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

    // 2. БЕЗОПАСНЫЙ CSS + СТИЛИ БЕЙДЖИКА
    function injectSafeCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            /* Скрываем рекламу, но оставляем в DOM (чтобы не было script error) */
            .ad-server, .ad-preroll, .player-advertising, .layer--advertising {
                opacity: 0 !important;
                visibility: hidden !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                position: absolute !important;
                top: -9999px !important;
            }
            /* Убираем лишнее */
            .button--subscribe, .card-promo, .settings--account-premium {
                display: none !important;
            }
            /* Стиль для бейджика версии */
            .cub-off-badge {
                width: 100%;
                text-align: center;
                padding: 15px 0;
                opacity: 0.6;
                font-size: 1em;
                color: #aaaaaa;
                margin-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                pointer-events: none;
            }
            .cub-off-badge span {
                color: #4bbc16; /* Зеленый цвет для "Active" */
                font-weight: bold;
            }
        `;
        document.body.appendChild(style);
    }

    // 3. УМНЫЙ ПЕРЕХВАТ ТАЙМЕРОВ (Ускоряем рекламу до 1мс)
    function patchTimers() {
        var originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            // Если это таймер рекламы (3500ms) -> делаем его мгновенным
            if (delay === 3500 || (delay > 3400 && delay < 3600)) {
                return originalSetTimeout(func, 1);
            }
            return originalSetTimeout(func, delay);
        };
    }

    // 4. ВНЕДРЕНИЕ ИНТЕРФЕЙСА (Вернул эту часть из v15)
    function injectInfo() {
        // Следим за изменениями в DOM, чтобы поймать момент открытия настроек
        var observer = new MutationObserver(function(mutations) {
            var settingsBox = document.querySelector('.settings__content');
            
            // Если настройки открыты, и нашего бейджика там еще нет
            if (settingsBox && !settingsBox.querySelector('.cub-off-badge')) {
                var badge = document.createElement('div');
                badge.className = 'cub-off-badge';
                badge.innerHTML = PLUGIN_VERSION + '<br>Status: <span>Active & Safe</span>';
                settingsBox.appendChild(badge);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // 5. НАСТРОЙКИ ЛАМПЫ
    window.lampa_settings = window.lampa_settings || {};
    window.lampa_settings.account_use = true;
    window.lampa_settings.disable_features = { 
        dmca: true, ads: true, trailers: false, 
        reactions: false, discuss: false, ai: true 
    };

    // 6. ЗАПУСК
    function init() {
        injectSafeCSS();
        patchTimers();
        injectInfo(); // <-- Вернул вызов функции UI
        
        // Добиваем премиум, если вдруг defineProperty не сработал
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
