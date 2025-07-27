(function() {
    'use strict';

    // Инициализация платформы
    Lampa.Platform.tv();

    // Универсальная функция для добавления параметров меню
    function addMenuParam(param) {
        if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addParam === 'function') {
            Lampa.SettingsApi.addParam(param);
        } else if (Lampa.Settings && typeof Lampa.Settings.addParam === 'function') {
            Lampa.Settings.addParam(param);
        } else {
            console.error('Не найден метод addParam для настроек Lampa');
        }
    }

    // Основная функция инициализации меню
    function initMenu() {
        // Константы для пунктов меню
        const EXIT_MENU = 'Выход';
        const REBOOT_MENU = 'Перезагрузить';
        const SWITCH_SERVER = 'Сменить сервер';
        const CLEAR_CACHE = 'Очистить кэш';
        const YOUTUBE = 'YouTube';
        const RUTUBE = 'RuTube';
        const DRM_PLAY = 'DRM Play';
        const TWITCH = 'Twitch';
        const FORK_PLAYER = 'ForkPlayer';
        const SPEED_TEST = 'Speed Test';

        // Слушатель изменений хранилища
        Lampa.Storage.listener.follow('change', function() {});

        // Слушатель настроек
        Lampa.Settings.listener.follow('back_menu', function(event) {
            if (event.name == 'back_menu') {
                Lampa.Settings.create({'component': 'BackMenu', 'name': 'BackMenu'});
                setTimeout(function() {
                    $('div[data-component="back_menu"]').remove();
                }, 0);
            }
        });

        // Добавление параметров меню в настройки
        addMenuParam({
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
                field.on('hover:enter', function() {
                    Lampa.Settings.create('back_menu');
                    Lampa.Controller.toggle().name.back = function() {
                        Lampa.Settings.hide('back_menu');
                    };
                });
            }
        });
        function addSimpleMenuParam(name, title, def) {
            addMenuParam({
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
        addSimpleMenuParam('exit', 'Закрыть приложение', '2');
        addSimpleMenuParam('reboot', 'Перезагрузить', '2');
        addSimpleMenuParam('switch_server', 'Сменить сервер', '2');
        addSimpleMenuParam('clear_cache', 'Очистить кэш', '2');
        addSimpleMenuParam('youtube', 'YouTube', '1');
        addSimpleMenuParam('rutube', 'RuTube', '1');
        addSimpleMenuParam('drm_play', 'DRM Play', '1');
        addSimpleMenuParam('twitch', 'Twitch', '1');
        addSimpleMenuParam('fork_player', 'ForkPlayer', '1');
        addSimpleMenuParam('speedtest', 'Speed Test', '1');

        // Инициализация значений по умолчанию
        var initInterval = setInterval(function() {
            if (typeof Lampa !== 'undefined') {
                clearInterval(initInterval);
                if (!Lampa.Storage.get('back_menu', 'false')) {
                    initializeDefaultSettings();
                }
            }
        }, 200);

        function initializeDefaultSettings() {
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

        // Speed Test
        function openSpeedTest() {
            var speedTestHtml = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
            Lampa.Modal.show({
                'title': '',
                'html': speedTestHtml,
                'size': 'medium',
                'mask': true,
                'onBack': function() {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('content');
                },
                'onSelect': function() {}
            });
            var iframe = document.getElementById('speedtest-iframe');
            iframe.src = 'http://speedtest.vokino.tv/?R=3';
        }

        // Очистка кэша
        function clearCache() {
            Lampa.Storage.clear();
        }

        // Смена сервера
        var protocol = location.protocol === 'https:' ? 'https://' : 'http://';
        function switchServer() {
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

        // Выход из приложения
        function exitApplication() {
            if (Lampa.Platform.is('webos')) {
                window.location.assign('exit://exit');
            }
            if (Lampa.Platform.is('tizen')) {
                tizen.application.getCurrentApplication().exit();
            }
            if (Lampa.Platform.is('android')) {
                window.close();
            }
            if (Lampa.Platform.is('android')) {
                Lampa.Android.exit();
            }
            if (Lampa.Platform.is('orsay')) {
                Lampa.Orsay.exit();
            }
            if (Lampa.Platform.is('netcast')) {
                window.NetCastBack();
            }
            if (Lampa.Platform.is('browser')) {
                window.history.back();
            }
            if (Lampa.Platform.is('browser')) {
                window.close();
            }
            if (Lampa.Platform.is('nw')) {
                nw.Window.get().close();
            }
        }

        // Показ меню
        function showMenu() {
            var currentApp = Lampa.Controller.toggle().name;
            var menuItems = [];
            if (localStorage.getItem('exit') !== '1') menuItems.push({'title': EXIT_MENU});
            if (localStorage.getItem('reboot') !== '1') menuItems.push({'title': REBOOT_MENU});
            if (localStorage.getItem('switch_server') !== '1') menuItems.push({'title': SWITCH_SERVER});
            if (localStorage.getItem('clear_cache') !== '1') menuItems.push({'title': CLEAR_CACHE});
            if (localStorage.getItem('youtube') !== '1') menuItems.push({'title': YOUTUBE});
            if (localStorage.getItem('rutube') !== '1') menuItems.push({'title': RUTUBE});
            if (localStorage.getItem('drm_play') !== '1') menuItems.push({'title': DRM_PLAY});
            if (localStorage.getItem('twitch') !== '1') menuItems.push({'title': TWITCH});
            if (localStorage.getItem('fork_player') !== '1') menuItems.push({'title': FORK_PLAYER});
            if (localStorage.getItem('speedtest') !== '1') menuItems.push({'title': SPEED_TEST});

            Lampa.Noty.show({
                'title': 'Меню Выход',
                'items': menuItems,
                'onBack': function() {
                    Lampa.Controller.toggle('content');
                },
                'onSelect': function(item) {
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

        // Слушатель контроллера
        Lampa.Controller.listener.follow('content', function(event) {
            if (event.name == 'select' && $('.selectbox__title').text() == Lampa.Lang.translate('Отобразить') && Lampa.Noty.isShow()) {
                Lampa.Noty.hide();
                setTimeout(function() {
                    showMenu();
                }, 100);
            }
        });
    }

    // Запуск инициализации
    if (window.appready) {
        initMenu();
    } else {
        Lampa.Listener.follow('appready', function(event) {
            if (event.type == 'ready') {
                initMenu();
            }
        });
    }
})();