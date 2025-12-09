(function () {
    'use strict';

    console.log('[Cubox] Store v2.0 (JSON based) started');

    // ==========================================
    // НАСТРОЙКИ
    // ==========================================
    var GITHUB_USER = 'endLoads'; 
    var GITHUB_REPO = 'pl-lm'; 
    var BRANCH = 'main';
    var FOLDER_PATH = 'Cubox'; 
    // ==========================================

    var STORAGE_KEY = 'cubox_plugins_state';
    // Ссылка на JSON манифест
    var MANIFEST_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/' + BRANCH + '/' + FOLDER_PATH + '/plugins.json';
    // База для загрузки самих скриптов
    var CDN_BASE = 'https://cdn.jsdelivr.net/gh/' + GITHUB_USER + '/' + GITHUB_REPO + '@' + BRANCH + '/' + FOLDER_PATH + '/';

    var enabledPlugins = Lampa.Storage.get(STORAGE_KEY, '{}');
    var needReload = false; 

    // --- Загрузка плагина ---
    function loadPlugin(filename) {
        var url = CDN_BASE + filename + '?t=' + Date.now();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        document.body.appendChild(script);
    }

    // --- Старт при запуске ---
    function startPlugins() {
        var list = Object.keys(enabledPlugins);
        list.forEach(function(file) {
            if (enabledPlugins[file]) loadPlugin(file);
        });
    }

    // --- Получение списка (теперь читаем JSON) ---
    function fetchManifest(callback) {
        // Добавляем timestamp, чтобы не кэшировался JSON
        var url = MANIFEST_URL + '?t=' + Date.now();
        
        Lampa.Network.silent(url, function(data) {
            try {
                // Если пришел строкой - парсим, если объектом - оставляем
                var json = (typeof data === 'string') ? JSON.parse(data) : data;
                callback(json);
            } catch (e) {
                Lampa.Noty.show('Cubox: Ошибка JSON манифеста');
                console.error(e);
            }
        }, function(a, c) {
            Lampa.Noty.show('Ошибка загрузки каталога');
        });
    }

    // --- Меню в настройках (Твоя рабочая версия 3) ---
    function addMenu() {
        var field = $(`
            <div class="settings-folder selector" data-component="cubox_core">
                <div class="settings-folder__icon">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="settings-folder__name">Cubox</div>
                <div class="settings-folder__descr">Store</div>
            </div>
        `);
        
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'main') {
                setTimeout(function() {
                    var container = $('.settings__content .settings__layer');
                    if (!container.length) container = $('.settings__content');
                    var firstItem = container.find('.settings-folder').first();
                    
                    if (firstItem.length) firstItem.before(field);
                    else container.prepend(field);
                    
                    field.on('hover:enter', function () {
                        openStore();
                    });
                }, 10);
            }
        });
    }

        function openStore() {
        Lampa.Loading.start(function(){ Lampa.Loading.stop(); });
        fetchManifest(function(plugins) {
            Lampa.Loading.stop();
            var items = [];
            
            plugins.forEach(function(p) {
                var isEnabled = enabledPlugins[p.file] === true;
                
                // Формируем подзаголовок с явным статусом
                var statusText = isEnabled ? '<span style="color:#4bbc16;font-weight:bold">ВКЛЮЧЕНО</span>' : '<span style="color:#aaa">Выключено</span>';
                var versionInfo = '<span style="opacity:0.7"> • v' + p.version + '</span>';
                var descInfo = '<div style="opacity:0.6;font-size:0.9em;margin-top:2px">' + p.description + '</div>';

                // Иконка: Зеленый шар или Пустое кольцо
                var iconHtml = isEnabled ? 
                    '<div style="width:16px;height:16px;background:#4bbc16;border-radius:50%;box-shadow:0 0 10px #4bbc16"></div>' : 
                    '<div style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-radius:50%"></div>';

                items.push({
                    title: p.name,
                    // Subtitle теперь содержит статус, версию и описание
                    subtitle: statusText + versionInfo + descInfo,
                    icon: iconHtml,
                    file: p.file,
                    enabled: isEnabled
                });
            });

            Lampa.Select.show({
                title: 'Cubox Store',
                items: items,
                onSelect: function(item) {
                    enabledPlugins[item.file] = !item.enabled;
                    Lampa.Storage.set(STORAGE_KEY, enabledPlugins);
                    needReload = true;
                    setTimeout(openStore, 50); // Мгновенное обновление UI
                },
                onBack: function() {
                    if (needReload) {
                        Lampa.Noty.show('Перезагрузка...');
                        setTimeout(function(){ window.location.reload(); }, 1000);
                    } else {
                        Lampa.Controller.toggle('settings_component');
                    }
                }
            });
        });
    }

    if (window.appready) { addMenu(); startPlugins(); }
    else { Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') { addMenu(); startPlugins(); } }); }
})();
