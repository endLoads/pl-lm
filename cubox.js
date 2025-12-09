(function () {
    'use strict';
    // Настройки
    var GITHUB_USER = 'endLoads'; 
    var GITHUB_REPO = 'pl-lm'; 
    var BRANCH = 'main';
    var FOLDER_PATH = 'Cubox'; 
    
    var STORAGE_KEY = 'cubox_plugins_state';
    var MANIFEST_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/' + BRANCH + '/' + FOLDER_PATH + '/plugins.json';
    var CDN_BASE = 'https://cdn.jsdelivr.net/gh/' + GITHUB_USER + '/' + GITHUB_REPO + '@' + BRANCH + '/' + FOLDER_PATH + '/';
    var enabledPlugins = Lampa.Storage.get(STORAGE_KEY, '{}');
    var needReload = false; 

    // Загрузка плагина
    function loadPlugin(filename) {
        var url = CDN_BASE + filename + '?t=' + Date.now();
        var script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.body.appendChild(script);
    }
    
    // Старт
    function startPlugins() {
        Object.keys(enabledPlugins).forEach(function(file) {
            if (enabledPlugins[file]) loadPlugin(file);
        });
    }

    // Чтение JSON
    function fetchManifest(callback) {
        // Timestamp чтобы не кэшировался JSON
        Lampa.Network.silent(MANIFEST_URL + '?t=' + Date.now(), function(data) {
            try {
                var json = (typeof data === 'string') ? JSON.parse(data) : data;
                callback(json);
            } catch (e) { Lampa.Noty.show('Ошибка JSON Store'); }
        });
    }

    // Меню
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
                var timer = setInterval(function() {
                    var scrollLayer = $('.settings__content .scroll__content');
                    if (scrollLayer.length) {
                        clearInterval(timer);
                        var first = scrollLayer.find('.settings-folder').first();
                        if (first.length) first.before(field);
                        else scrollLayer.append(field);
                        field.on('hover:enter', openStore);
                    }
                }, 50);
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
                items.push({
                    title: p.name,
                    subtitle: '<span style="opacity:0.7;font-size:0.9em">v' + p.version + '</span> — ' + p.description,
                    icon: isEnabled ? '<div style="width:20px;height:20px;background:#4bbc16;border-radius:50%"></div>' : '<div style="width:20px;height:20px;border:2px solid #fff;border-radius:50%"></div>',
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
                    setTimeout(openStore, 50);
                },
                onBack: function() {
                    if (needReload) {
                        Lampa.Noty.show('Перезагрузка...');
                        setTimeout(function(){ window.location.reload(); }, 1000);
                    } else Lampa.Controller.toggle('settings_component');
                }
            });
        });
    }

    if (window.appready) { addMenu(); startPlugins(); }
    else { Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') { addMenu(); startPlugins(); } }); }
})();
