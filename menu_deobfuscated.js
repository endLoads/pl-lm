(function() {
    'use strict';

    Lampa.Platform.tv();

    // Деобфуциированный код меню
    function initMenu() {
        // Проверка доступа к Lampa
        if (Lampa.Manifest.get('origin').includes !== 'lampa') {
            Lampa.Noty.create('Ошибка доступа');
            return;
        }

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
        Lampa.Storage.listener.follow('change', function() {});

        // Обработчик настроек
        Lampa.Settings.listener.follow('back_menu', function(event) {
            if (event.name == 'back_menu') {
                Lampa.Settings.create({'component': 'BackMenu', 'name': 'BackMenu'});
                setTimeout(function() {
                    $('div[data-component="back_menu"]').remove();
                }, 0);
            }
        });

        // Добавление параметров настроек
        Lampa.Settings.addParam({
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

        // Добавление остальных параметров настроек
        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'exit',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '2'
            },
            'field': {
                'name': 'Закрыть приложение',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'reboot',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '2'
            },
            'field': {
                'name': 'Перезагрузить',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'switch_server',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '2'
            },
            'field': {
                'name': 'Сменить сервер',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.SettingsApi.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'clear_cache',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '2'
            },
            'field': {
                'name': 'Очистить кэш',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.SettingsApi.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'youtube',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '1'
            },
            'field': {
                'name': 'YouTube',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'rutube',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '1'
            },
            'field': {
                'name': 'RuTube',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'drm_play',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '1'
            },
            'field': {
                'name': 'DRM Play',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'twitch',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '1'
            },
            'field': {
                'name': 'Twitch',
                'description': 'Нажмите для выбора'
            }
        });

        Lampa.Settings.addParam({
            'component': 'back_menu',
            'param': {
                'name': 'speedtest',
                'type': 'select',
                'values': {
                    1: 'Скрыть',
                    2: 'Отобразить'
                },
                'default': '1'
            },
            'field': {
                'name': 'Speed Test',
                'description': 'Нажмите для выбора'
            }
        });

        // Инициализация при готовности Lampa
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
            Lampa.Storage.set('speedtest', '1');
        }

        // Функция для открытия Speed Test
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

        // Функция для очистки кэша
        function clearCache() {
            Lampa.Storage.clear();
        }

        // Определение протокола
        var protocol = location.protocol === 'https:' ? 'https://' : 'http://';

        // Функция для смены сервера
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

        // Функция для выхода из приложения
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

        // Основная функция показа меню
        function showMenu() {
            var currentApp = Lampa.Controller.toggle().name;
            var menuItems = [];

            // Добавление пунктов меню в зависимости от настроек
            if (localStorage.getItem('exit') !== '1') {
                menuItems.push({'title': EXIT_MENU});
            }
            if (localStorage.getItem('reboot') !== '1') {
                menuItems.push({'title': REBOOT_MENU});
            }
            if (localStorage.getItem('switch_server') !== '1') {
                menuItems.push({'title': SWITCH_SERVER});
            }
            if (localStorage.getItem('clear_cache') !== '1') {
                menuItems.push({'title': CLEAR_CACHE});
            }
            if (localStorage.getItem('youtube') !== '1') {
                menuItems.push({'title': YOUTUBE});
            }
            if (localStorage.getItem('rutube') !== '1') {
                menuItems.push({'title': RUTUBE});
            }
            if (localStorage.getItem('drm_play') !== '1') {
                menuItems.push({'title': DRM_PLAY});
            }
            if (localStorage.getItem('twitch') !== '1') {
                menuItems.push({'title': TWITCH});
            }
            if (localStorage.getItem('fork_player') !== '1') {
                menuItems.push({'title': FORK_PLAYER});
            }
            if (localStorage.getItem('speedtest') !== '1') {
                menuItems.push({'title': SPEED_TEST});
            }

            // Показ меню
            Lampa.Noty.show({
                'title': 'Меню Выход',
                'items': menuItems,
                'onBack': function() {
                    Lampa.Controller.toggle('content');
                },
                'onSelect': function(item) {
                    // Обработка выбора пунктов меню
                    if (item.title == EXIT_MENU) {
                        exitApplication();
                    }
                    if (item.title == REBOOT_MENU) {
                        location.reload();
                    }
                    if (item.title == SWITCH_SERVER) {
                        switchServer();
                    }
                    if (item.title == CLEAR_CACHE) {
                        clearCache();
                    }
                    if (item.title == YOUTUBE) {
                        window.location.href = 'https://youtube.com/tv';
                    }
                    if (item.title == RUTUBE) {
                        window.location.href = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
                    }
                    if (item.title == DRM_PLAY) {
                        window.location.href = 'https://ott.drm-play.com';
                    }
                    if (item.title == TWITCH) {
                        window.location.href = 'https://webos.tv.twitch.tv';
                    }
                    if (item.title == FORK_PLAYER) {
                        window.location.href = 'http://browser.appfxml.com';
                    }
                    if (item.title == SPEED_TEST) {
                        openSpeedTest();
                    }
                }
            });
        }

        // Обработчик событий контроллера
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