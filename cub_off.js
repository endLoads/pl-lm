(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v16.0 (Safe Mode)';
    console.log('[CUB OFF] Started:', PLUGIN_VERSION);

    // 1. ПЕРЕХВАТЧИК Object.defineProperty (Взлом защиты hasPremium)
    // Это нужно сделать ПЕРВЫМ делом, до того как Лампа создаст объект Account
    try {
        var originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            // Если Лампа пытается защитить hasPremium
            if (prop === 'hasPremium') {
                // console.log('[CUB OFF] Patching hasPremium...');
                // Принудительно ставим true и разрешаем перезапись
                descriptor.value = function() { return true; };
                descriptor.writable = true; 
                descriptor.configurable = true;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
    } catch(e) {
        console.warn('[CUB OFF] defineProperty patch failed', e);
    }

    // 2. БЕЗОПАСНЫЙ CSS (Скрываем, но оставляем в DOM)
    // Мы не удаляем элементы (remove), чтобы скрипт Лампы не выдавал ошибку "null is not an object"
    function injectSafeCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            /* Скрываем визуально, но оставляем в DOM для скриптов */
            .ad-server, .ad-preroll, .player-advertising, .layer--advertising {
                opacity: 0 !important;
                visibility: hidden !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                position: absolute !important;
                top: -9999px !important;
            }
            /* Убираем лишние кнопки */
            .button--subscribe, .card-promo, .settings--account-premium {
                display: none !important;
            }
            .cub-off-badge {
                opacity: 0.3; font-size: 10px; color: #fff; 
                position: absolute; bottom: 5px; right: 5px;
            }
        `;
        document.body.appendChild(style);
    }

    // 3. УМНЫЙ ПЕРЕХВАТ ТАЙМЕРОВ
    function patchTimers() {
        var originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            // Если таймер похож на рекламный (3500ms)
            // Мы не отменяем его, а ускоряем до 1ms!
            // Так код "думает", что прошло 3.5 секунды.
            if (delay === 3500 || (delay > 3400 && delay < 3600)) {
                // console.log('[CUB OFF] Fast-forwarding ad timer');
                return originalSetTimeout(func, 1);
            }
            return originalSetTimeout(func, delay);
        };
    }
    
    // 4. КОНФИГУРАЦИЯ
    window.lampa_settings = window.lampa_settings || {};
    window.lampa_settings.account_use = true;
    window.lampa_settings.disable_features = { 
        dmca: true, ads: true, trailers: false, 
        reactions: false, discuss: false, ai: true 
    };

    // 5. ИНИЦИАЛИЗАЦИЯ
    function init() {
        injectSafeCSS();
        patchTimers();
        
        // Фейковый премиум для визуальной части
        if (typeof Lampa !== 'undefined' && Lampa.Account) {
            try {
                 Lampa.Account.hasPremium = function() { return true; };
            } catch(e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
