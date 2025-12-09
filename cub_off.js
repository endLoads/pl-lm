(function () {
    'use strict';

    var PLUGIN_VERSION = 'CUB OFF v13.0 (Premium Fake)';

    // 1. КОНФИГУРАЦИЯ
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
            .cub-off-badge {
                width: 100%; text-align: center; padding: 15px; opacity: 0.5; 
                font-size: 1.1em; color: #fff; margin-top: 20px; 
                border-top: 1px solid rgba(255,255,255,0.1);
            }
        `;
        document.body.appendChild(style);
    }

    // 3. ПРЕМИУМ-ВЗЛОМ (Самое важное)
    function mockPremium() {
        // Ждем, пока загрузится Account класс
        var attempt = 0;
        var interval = setInterval(function() {
            if (typeof Account !== 'undefined' || typeof Lampa.Account !== 'undefined') {
                
                console.log('[CUB OFF] Взламываем Account...');
                
                // Функция-обманка
                var fakePremium = function() { return true; };
                
                // Пробуем все варианты, где может лежать аккаунт
                if (window.Account) window.Account.hasPremium = fakePremium;
                if (window.Account1) window.Account1.hasPremium = fakePremium; // В min файле он Account1
                if (Lampa.Account) Lampa.Account.hasPremium = fakePremium;
                
                // Также ломаем Personal.confirm (на всякий случай)
                if (window.Personal) window.Personal.confirm = fakePremium;
                if (Lampa.Personal) Lampa.Personal.confirm = fakePremium;

                // Также ставим флаг в профиле
                if (Lampa.Storage) {
                    var profile = Lampa.Storage.get('account', {});
                    if (!profile.premium) {
                        profile.premium = true; // Виртуально ставим премиум
                        // Не сохраняем в Storage.set, чтобы не портить реальные данные на сервере,
                        // но в памяти держим
                    }
                }

                clearInterval(interval);
            }
            
            attempt++;
            if (attempt > 100) clearInterval(interval); // 10 секунд ожидания
        }, 100);
    }
    
    // 4. ЗАПАСНОЙ ПЛАН (Перехват таймеров) - ЕСЛИ ПРЕМИУМ НЕ СРАБОТАЕТ
    // Но теперь мы точно знаем, что задержка 3500мс
    function killPrerollTimer() {
        var originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            // Если таймер 3500ms (это точно преролл из app.min.js)
            if (delay === 3500 || delay === 3600) {
                 // console.log('[CUB OFF] Убит таймер преролла 3500ms');
                 return originalSetTimeout(func, 1);
            }
            return originalSetTimeout(func, delay);
        };
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
        localStorage.setItem("region", JSON.stringify({code: "uk", time: new Date().getTime()}));
        injectCleanerCSS();
        killPrerollTimer(); // <--- Убиваем конкретный таймер 3500
        mockPremium();      // <--- Подделываем премиум
        injectInfo();
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
