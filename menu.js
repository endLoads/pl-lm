(function() {
    'use strict';

    // Универсальный логгер (работает даже если console отключён)
    function safeLog() {
        try { if (window.console && console.log) console.log.apply(console, arguments); } catch(e) {}
    }

    safeLog('[menu.js] Скрипт загружен');
    if (window.Lampa && Lampa.Platform && Lampa.Platform.tv) {
        Lampa.Platform.tv();
        safeLog('[menu.js] После Lampa.Platform.tv()');
    }

    // Универсальный addParam (SettingsApi или Settings)
    function addParamUniversal(param) {
        if (window.Lampa) {
            if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addParam === 'function') {
                Lampa.SettingsApi.addParam(param);
            } else if (Lampa.Settings && typeof Lampa.Settings.addParam === 'function') {
                Lampa.Settings.addParam(param);
            } else {
                safeLog('[menu.js] Нет подходящего метода addParam');
            }
        }
    }

    function initMenu() {
        safeLog('[menu.js] Вызван initMenu');

        // Константы для пунктов меню
        const EXIT_MENU = 'Выход ';
        const REBOOT_MENU = 'Перезагрузить';
        const SWITCH_SERVER = 'Сменить сервер';
        const CLEAR_CACHE = 'Очистить кэш';
        const YOUTUBE = 'YouTube';
        const RUTUBE = 'RuTube';
        const DRM_PLAY = 'DRM Play';
        const TWITCH = 'Twitch';
        const FORK_PLAYER = 'ForkPlayer';
        const SPEED_TEST = 'Speed Test';

        // Настройки хранилища
        if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
            safeLog('[menu.js] Lampa.Storage.listener.follow');
            Lampa.Storage.listener.follow('change', function() {});
        }

        // Обработчик настроек
        if (Lampa.Settings && Lampa.Settings.listener && Lampa.Settings.listener.follow) {
            safeLog('[menu.js] Lampa.Settings.listener.follow');
            Lampa.Settings.listener.follow('back_menu', function(event) {
                if (event.name == 'back_menu' && Lampa.Settings && Lampa.Settings.create) {
                    Lampa.Settings.create({'component': 'BackMenu', 'name': 'BackMenu'});
                    setTimeout(function() {
                        if (window.$) {
                            $('div[data-component="back_menu"]').remove();
                        }
                    }, 0);
                }
            });
        }

        // Добавление параметров настроек
        safeLog('[menu.js] addParamUniversal (back_menu)');
        addParamUniversal({
            'component': 'back_menu',
            'param': {
                'name': 'back_menu',
                'type': 'select',
                'default': true
            },
            'field': {
                'name': 'Меню Выход',
                'description': 'Настройки отображения пунктов меню'
            },
            'onRender': function(field) {
                if (field && field.on && Lampa.Settings && Lampa.Settings.create && Lampa.Controller && Lampa.Controller.toggle) {
                    field.on('hover:enter', function() {
                        Lampa.Settings.create('back_menu');
                        var ctrl = Lampa.Controller.toggle();
                        if (ctrl && ctrl.name) ctrl.name.back = function() {
                            if (Lampa.Settings && Lampa.Settings.hide) Lampa.Settings.hide('back_menu');
                        };
                    });
                }
            }
        });

        // Универсальная функция для добавления пунктов меню
        function addMenuParam(name, title, def) {
            addParamUniversal({
                'component': 'back_menu',
                'param': {
                    'name': name,
                    'type': 'select',
                    'values': { 1: 'Скрыть', 2: 'Отобразить' },
                    'default': def
                },
                'field': {
                    'name': title,
                    'description': 'Нажмите для выбора'
                }
            });
        }
        addMenuParam('exit', 'Закрыть приложение', '2');
        addMenuParam('reboot', 'Перезагрузить', '2');
        addMenuParam('switch_server', 'Сменить сервер', '2');
        addMenuParam('clear_cache', 'Очистить кэш', '2');
        addMenuParam('youtube', 'YouTube', '1');
        addMenuParam('rutube', 'RuTube', '1');
        addMenuParam('drm_play', 'DRM Play', '1');
        addMenuParam('twitch', 'Twitch', '1');
        addMenuParam('fork_player', 'ForkPlayer', '1');
        addMenuParam('speedtest', 'Speed Test', '1');

        // Инициализация при готовности Lampa
        var initInterval = setInterval(function() {
            if (typeof Lampa !== 'undefined' && Lampa.Storage && Lampa.Storage.get) {
                clearInterval(initInterval);
                if (!Lampa.Storage.get('back_menu', 'false')) {
                    initializeDefaultSettings();
                }
            }
        }, 200);

        function initializeDefaultSettings() {
            if (Lampa.Storage && Lampa.Storage.set) {
                Lampa.Storage.set('back_menu', true);
                Lampa.Storage.set('exit', '2');
                Lampa.Storage.set('reboot', '2');
                Lampa.Storage.set('switch_server', '2');
                Lampa.Storage.set('clear_cache', '2');
                Lampa.Storage.set('youtube', '1');
                Lampa.Storage.set('rutube', '1');
                Lampa.Storage.set('drm_play', '1');
                Lampa.Storage.set('twitch', '1');
                Lampa.Storage.set('fork_player', '1');
                Lampa.Storage.set('speedtest', '1');
            }
        }

        // Функция для открытия Speed Test
        function openSpeedTest() {
            if (!window.$ || !Lampa.Modal) return;
            var speedTestHtml = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
            Lampa.Modal.show({
                'title': '',
                'html': speedTestHtml,
                'size': 'medium',
                'mask': true,
                'onBack': function() {
                    if (Lampa.Modal && Lampa.Modal.close) Lampa.Modal.close();
                    if (Lampa.Controller && Lampa.Controller.toggle) Lampa.Controller.toggle('content');
                },
                'onSelect': function() {}
            });
            var iframe = document.getElementById('speedtest-iframe');
            if (iframe) iframe.src = 'http://speedtest.vokino.tv/?R=3';
        }

        // Функция для очистки кэша
        function clearCache() {
            if (Lampa.Storage && Lampa.Storage.clear) Lampa.Storage.clear();
        }

        // Определение протокола
        var protocol = location.protocol === 'https:' ? 'https://' : 'http://';

        // Функция для смены сервера
        function switchServer() {
            if (!Lampa.Input || !Lampa.Input.create) return;
            Lampa.Input.create({
                'title': 'Укажите cервер',
                'value': '',
                'free': true
            }, function(server) {
                if (server !== '') {
                    window.location.href = protocol + server;
                } else {
                    showMenu();
                }
            });
        }

        // Функция для выхода из приложения
        function exitApplication() {
            if (!Lampa.Platform || !Lampa.Platform.is) return;
            if (Lampa.Platform.is('webos')) {
                window.location.assign('exit://exit');
            }
            if (Lampa.Platform.is('tizen') && window.tizen && tizen.application) {
                tizen.application.getCurrentApplication().exit();
            }
            if (Lampa.Platform.is('android')) {
                if (window.close) window.close();
                if (Lampa.Android && Lampa.Android.exit) Lampa.Android.exit();
            }
            if (Lampa.Platform.is('orsay') && Lampa.Orsay && Lampa.Orsay.exit) {
                Lampa.Orsay.exit();
            }
            if (Lampa.Platform.is('netcast') && window.NetCastBack) {
                window.NetCastBack();
            }
            if (Lampa.Platform.is('browser')) {
                if (window.history && window.history.back) window.history.back();
                if (window.close) window.close();
            }
            if (Lampa.Platform.is('nw') && window.nw && nw.Window && nw.Window.get) {
                nw.Window.get().close();
            }
        }

        // Основная функция показа меню
        function showMenu() {
            safeLog('[menu.js] showMenu вызван');
            var currentApp = (Lampa.Controller && Lampa.Controller.toggle) ? Lampa.Controller.toggle().name : {};
            var menuItems = [];
            function getLS(key) { try { return localStorage.getItem(key); } catch(e) { return null; } }
            if (getLS('exit') !== '1') menuItems.push({'title': EXIT_MENU});
            if (getLS('reboot') !== '1') menuItems.push({'title': REBOOT_MENU});
            if (getLS('switch_server') !== '1') menuItems.push({'title': SWITCH_SERVER});
            if (getLS('clear_cache') !== '1') menuItems.push({'title': CLEAR_CACHE});
            if (getLS('youtube') !== '1') menuItems.push({'title': YOUTUBE});
            if (getLS('rutube') !== '1') menuItems.push({'title': RUTUBE});
            if (getLS('drm_play') !== '1') menuItems.push({'title': DRM_PLAY});
            if (getLS('twitch') !== '1') menuItems.push({'title': TWITCH});
            if (getLS('fork_player') !== '1') menuItems.push({'title': FORK_PLAYER});
            if (getLS('speedtest') !== '1') menuItems.push({'title': SPEED_TEST});

            if (Lampa.Noty && Lampa.Noty.show) {
                Lampa.Noty.show({
                    'title': 'Меню Выход',
                    'items': menuItems,
                    'onBack': function() {
                        if (Lampa.Controller && Lampa.Controller.toggle) Lampa.Controller.toggle('content');
                    },
                    'onSelect': function(item) {
                        safeLog('[menu.js] onSelect', item);
                        if (item.title == EXIT_MENU) exitApplication();
                        if (item.title == REBOOT_MENU) location.reload();
                        if (item.title == SWITCH_SERVER) switchServer();
                        if (item.title == CLEAR_CACHE) clearCache();
                        if (item.title == YOUTUBE) window.location.href = 'https://youtube.com/tv';
                        if (item.title == RUTUBE) window.location.href = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
                        if (item.title == DRM_PLAY) window.location.href = 'https://ott.drm-play.com';
                        if (item.title == TWITCH) window.location.href = 'https://webos.tv.twitch.tv';
                        if (item.title == FORK_PLAYER) window.location.href = 'http://browser.appfxml.com';
                        if (item.title == SPEED_TEST) openSpeedTest();
                    }
                });
            }
        }

        // Обработчик событий контроллера
        if (Lampa.Controller && Lampa.Controller.listener && Lampa.Controller.listener.follow) {
            Lampa.Controller.listener.follow('content', function(event) {
                safeLog('[menu.js] Controller.listener content', event);
                var showText = 'Отобразить';
                if (Lampa.Lang && Lampa.Lang.translate) {
                    try { showText = Lampa.Lang.translate('Отобразить'); } catch(e) {}
                }
                if (event.name == 'select' && window.$ && $('.selectbox__title').text() == showText && Lampa.Noty && Lampa.Noty.isShow && Lampa.Noty.isShow()) {
                    if (Lampa.Noty.hide) Lampa.Noty.hide();
                    setTimeout(function() { showMenu(); }, 100);
                }
            });
        }
    }

    // Запуск инициализации
    if (window.appready) {
        safeLog('[menu.js] window.appready true, вызываю initMenu');
        initMenu();
    } else if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('appready', function(event) {
            if (event.type == 'ready') {
                safeLog('[menu.js] appready event, вызываю initMenu');
                initMenu();
            }
        });
    } else {
        // fallback: если нет Lampa.Listener, пробуем через setTimeout
        setTimeout(initMenu, 1000);
    }
})();