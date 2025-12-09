(function () {
    'use strict';

    console.log('[Cubox] Core v1.0 started');

    // ==========================================
    // НАСТРОЙКИ РЕПОЗИТОРИЯ
    // ==========================================
    var GITHUB_USER = 'endLoads'; 
    var GITHUB_REPO = 'pl-lm'; 
    var FOLDER_PATH = 'Cubox'; 
    // ==========================================

    var STORAGE_KEY = 'cubox_plugins_state';
    var API_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + GITHUB_REPO + '/contents/' + FOLDER_PATH;
    var RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/main/' + FOLDER_PATH + '/';

    var enabledPlugins = Lampa.Storage.get(STORAGE_KEY, '{}');
    
    // Функция загрузки плагина (через network silent для скорости)
    function loadPlugin(filename) {
        var timestamp = new Date().getTime();
        var url = RAW_URL + filename + '?t=' + timestamp;
        
        Lampa.Network.silent(url, function(code) {
            try {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = code;
                document.body.appendChild(script);
                console.log('[Cubox] Plugin loaded:', filename);
            } catch(e) {
                console.error('[Cubox] Plugin error:', filename, e);
            }
        });
    }

    // Запуск включенных плагинов
    function startPlugins() {
        var list = Object.keys(enabledPlugins);
        list.forEach(function(file) {
            if (enabledPlugins[file]) {
                loadPlugin(file);
            }
        });
    }

    // Получение списка файлов
    function fetchFileList(callback) {
        Lampa.Network.silent(API_URL, function(data) {
            if (Array.isArray(data)) {
                var files = data
                    .filter(function(f) { return f.name.endsWith('.js'); })
                    .map(function(f) { return f.name; });
                callback(files);
            } else {
                Lampa.Noty.show('Cubox: Ошибка API');
            }
        });
    }

    // Меню настроек
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
                var container = $('.settings__content');
                var pluginsItem = container.find('[data-component="plugins"]');
                if (pluginsItem.length) pluginsItem.after(field);
                else container.append(field);
                
                field.on('hover:enter', function () {
                    openStore();
                });
            }
        });
    }

    // Отрисовка магазина
    function openStore() {
        fetchFileList(function(files) {
            var items = [];
            files.forEach(function(filename) {
                var isEnabled = enabledPlugins[filename] === true;
                items.push({
                    title: filename,
                    subtitle: isEnabled ? 'Включен' : 'Выключен',
                    icon: isEnabled ? '<div style="color:#4bbc16">●</div>' : '<div>○</div>',
                    file: filename,
                    enabled: isEnabled
                });
            });

            Lampa.Select.show({
                title: 'Cubox Store',
                items: items,
                onSelect: function(item) {
                    enabledPlugins[item.file] = !item.enabled;
                    Lampa.Storage.set(STORAGE_KEY, enabledPlugins);
                    setTimeout(openStore, 50); // Обновляем UI
                },
                onBack: function() {
                    window.location.reload(); // Перезагрузка для применения изменений
                }
            });
        });
    }

    // Инициализация
    if (window.appready) {
        addMenu();
        startPlugins();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                addMenu();
                startPlugins();
            }
        });
    }
})();
