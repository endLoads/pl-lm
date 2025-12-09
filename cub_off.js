(function () {
    'use strict';
    
    var PLUGIN_VERSION = 'CUB OFF v11.0 (Logic Hack)';

    // 1. ПОДМЕНА ХРАНИЛИЩА (Главная фишка)
    function hackStorage() {
        // Перехватываем метод получения данных
        var originalGet = Lampa.Storage.get;
        
        Lampa.Storage.get = function(name, def) {
            // Если Лампа спрашивает "когда была реклама?" (ad_timer, advertising_last_time)
            if (name === 'ad_timer' || name === 'advertising_last_time' || name === 'ad_view_time') {
                // Отвечаем: "Только что!" (Текущее время)
                return new Date().getTime();
            }
            
            // Если спрашивает "показывать рекламу?"
            if (name === 'ad_server' || name === 'advertising') {
                return false;
            }

            return originalGet.call(this, name, def);
        };
        
        // На всякий случай пишем в localStorage
        setInterval(function() {
            var time = new Date().getTime();
            localStorage.setItem('ad_timer', time);
            localStorage.setItem('advertising_last_time', time);
            // Lampa.Storage.set('ad_timer', time); // Дублируем через API
        }, 5000);
    }

    // 2. CONFIG (Стандарт)
    var _cleanSettings = {
        lang: 'ru', lang_use: true,
        account_use: true, account_sync: true, socket_use: true,
        plugins_use: true, plugins_store: true, torrents_use: true,
        iptv: false, feed: false, push_state: true,
        white_use: false, dcma: false,
        developer: { fps: false, log: false, status: false, active: false },
        disable_features: { dmca: true, ads: true, subscribe: true, blacklist: true }
    };
    window.lampa_settings = _cleanSettings;

    // 3. CSS (Убираем визуальный мусор)
    function injectCleanerCSS() {
        var style = document.createElement("style");
        style.innerHTML = `
            .ad-server, [data-component="ad"], .card-promo, 
            .settings--account-premium, .open--notice, .selectbox-item__lock 
            { display: none !important; }
            .button--subscribe { display: none !important; }
            .player-advertising, #oframe_player_advertising { display: none !important; }
            
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px;
                opacity: 0.5; font-size: 1.1em; color: #fff;
                margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }
    
    // 4. ПОДМЕНА МОДУЛЯ РЕКЛАМЫ (Если Storage Hack не сработает)
    function patchAdModule() {
        if (Lampa.Ad) {
             // Полностью ломаем логику запуска
             Lampa.Ad.launch = function(data) {
                 console.log('Ad blocked by Logic Hack');
                 if(data.callback) data.callback();
             }
        }
    }

    // 5. UI
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
        injectCleanerCSS();
        hackStorage();    // <--- Логический взлом
        patchAdModule();
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
