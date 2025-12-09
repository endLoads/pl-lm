(function () {
    'use strict';

    // ==========================================
    // НАСТРОЙКИ (ЗАПОЛНИ ЭТО!)
    // ==========================================
    var GITHUB_USER = 'endLoads'; 
    var GITHUB_REPO = 'pl-lm'; 
    var FOLDER_PATH = 'Cubox'; // Папка, где лежат плагины
    // ==========================================

    var STORAGE_KEY = 'my_custom_plugins_state';
    var API_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + GITHUB_REPO + '/contents/' + FOLDER_PATH;
    var RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/main/' + FOLDER_PATH + '/';

    // 1. Загрузка сохраненных состояний
    var enabledPlugins = Lampa.Storage.get(STORAGE_KEY, '{}');
    
    // 2. Функция загрузки JS файла
    function loadScript(filename) {
        var timestamp = new Date().getTime();
        var url = RAW_URL + filename + '?t=' + timestamp;
        var script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.body.appendChild(script);
        console.log('[MyPlugins] Loaded:', filename);
    }

    // 3. Загружаем включенные плагины при старте
    function loadEnabledPlugins() {
        var list = Object.keys(enabledPlugins);
        list.forEach(function(file) {
            if (enabledPlugins[file]) {
                loadScript(file);
            }
        });
    }

    // 4. Получение списка файлов с GitHub
    function fetchFileList(callback) {
        Lampa.Network.silent(API_URL, function(data) {
            if (Array.isArray(data)) {
                var files = data
                    .filter(function(f) { return f.name.endsWith('.js'); })
                    .map(function(f) { return f.name; });
                callback(files);
            } else {
                Lampa.Noty.show('Ошибка загрузки списка');
            }
        }, function(a, c) {
            Lampa.Noty.show('GitHub Error: ' + c);
        });
    }

    // 5. Создание пункта в ГЛАВНОМ меню настроек
    function addRootSetting() {
        var field = $(`
            <div class="settings-folder selector" data-component="plugins_repo">
                <div class="settings-folder__icon">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="settings-folder__name">Мои Плагины</div>
                <div class="settings-folder__descr">GitHub Репозиторий</div>
            </div>
        `);
        
        // Вставляем сразу после пункта "Плагины" или в конец, если не найдем
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'main') {
                var container = $('.settings__content');
                // Ищем стандартный пункт "Плагины"
                var pluginsItem = container.find('[data-component="plugins"]');
                
                if (pluginsItem.length) {
                    pluginsItem.after(field); // Вставляем ПОСЛЕ стандартных плагинов
                } else {
                    container.append(field); // Или просто в конец
                }
                
                field.on('hover:enter', function () {
                    openPluginsMenu();
                });
            }
        });
    }

    // 6. Отрисовка списка
    function openPluginsMenu() {
        Lampa.Loading.start(function () {
            Lampa.Loading.stop();
            Lampa.Settings.create('main'); // Возврат назад в главное меню
        });

        fetchFileList(function(files) {
            Lampa.Loading.stop();
            
            var items = [];
            
            files.forEach(function(filename) {
                var isEnabled = enabledPlugins[filename] === true;
                var color = isEnabled ? '4bbc16' : 'ffffff';
                var icon = isEnabled ? 
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4bbc16" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : 
                    '<div style="width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,0.3)"></div>';

                items.push({
                    title: filename,
                    subtitle: isEnabled ? 'Активен' : 'Отключен',
                    icon: icon, // Кастомная иконка галочки
                    file: filename,
                    enabled: isEnabled,
                    style: isEnabled ? 'color:#4bbc16' : ''
                });
            });

            Lampa.Select.show({
                title: 'Мои Плагины',
                items: items,
                onSelect: function(item) {
                    enabledPlugins[item.file] = !item.enabled;
                    Lampa.Storage.set(STORAGE_KEY, enabledPlugins);
                    
                    if (!item.enabled) { 
                        loadScript(item.file);
                        Lampa.Noty.show('Плагин ' + item.file + ' запущен');
                    } else {
                        Lampa.Noty.show('Отключено (нужен перезапуск)');
                    }
                    
                    setTimeout(openPluginsMenu, 50); // Мгновенное обновление меню
                },
                onBack: function() {
                    Lampa.Settings.create('main');
                }
            });
        });
    }

    // ЗАПУСК
    if (window.appready) {
        addRootSetting();
        loadEnabledPlugins();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                addRootSetting();
                loadEnabledPlugins();
            }
        });
    }

})();
