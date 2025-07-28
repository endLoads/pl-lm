(function() {
    'use strict';

    // Инициализация TV платформы
    Lampa.Platform.tv();

    // Проверка готовности Lampa и инициализация
    function initializeMenus() {
        // Проверка консоли и защита от отладки (оригинальный обфусцированный код имел защиту)
        
        // ПРОВЕРКА АДРЕСА БЫЛА УДАЛЕНА
        // Оригинальная проверка: if(Lampa.Platform.origin.includes !== 'lampa') return;
        
        // HTML шаблоны для меню
        var menuTemplates = {
            exit: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> </g></svg></div><div style="font-size:1.3em">Закрыть приложение</div></div>',
            
            reboot: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:currentColor" d="M11 2a9 9 0 0 0-4.676 1.324l1.461 1.461A7 7 0 0 1 11 4a7 7 0 0 1 7 7 7 7 0 0 1-.787 3.213l1.465 1.465A9 9 0 0 0 20 11a9 9 0 0 0-9-9zM3.322 6.322A9 9 0 0 0 2 11a9 9 0 0 0 9 9 9 9 0 0 0 4.676-1.324l-1.461-1.461A7 7 0 0 1 11 18a7 7 0 0 1-7-7 7 7 0 0 1 .787-3.213z"></path> </g></svg></div><div style="font-size:1.3em">Перезагрузить</div></div>',
            
            switch_server: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 21.75C13.4142 21.75 13.75 21.4142 13.75 21C13.75 20.5858 13.4142 20.25 13 20.25V21.75ZM2 12.75H22V11.25H2V12.75Z" fill="currentColor"></path> </g></svg></div><div style="font-size:1.3em">Сменить сервер</div></div>',
            
            clear_cache: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 20h-6v-2h6zm4 8h-6v-2h6zm-2-4h-6v-2h6z"/><path fill="currentColor" d="M17.003 20a4.9 4.9 0 0 0-2.404-4.173L22 3l-1.73-1l-7.577 13.126a5.7 5.7 0 0 0-5.243 1.503C3.706 20.24 3.996 28.682 4.01 29.04a1 1 0 0 0 1 .96h14.991a1 1 0 0 0 .6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11 3.11 0 0 1 15.004 20c0 .038.002.208.017.469l-5.9-2.624a3.8 3.8 0 0 1 2.809-.848M15.45 28A5.2 5.2 0 0 1 14 25h-2a6.5 6.5 0 0 0 .968 3h-2.223A16.6 16.6 0 0 1 10 24H8a17.3 17.3 0 0 0 .665 4H6c.031-1.836.29-5.892 1.803-8.553l7.533 3.35A13 13 0 0 0 17.596 28Z"/></svg></div><div style="font-size:1.3em">Очистить кэш</div></div>',
            
            youtube: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.3C.172 2.3 0 3.174 0 10s.172 7.7 10 7.7s10-.874 10-7.7s-.172-7.7-10-7.7m3.205 8.034l-4.49 2.096c-.393.182-.715-.022-.715-.456V8.026c0-.433.322-.638.715-.456l4.49 2.096c.393.184.393.484 0 .668"/></svg></div><div style="font-size:1.3em">YouTube</div></div>',
            
            rutube: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="currentColor" d="M128.689 47.57H20.396v116.843h30.141V126.4h57.756l26.352 38.013h33.75l-29.058-38.188c9.025-1.401 15.522-4.73 19.493-9.985 3.97-5.255 5.956-13.664 5.956-24.875v-8.759c0-6.657-.721-11.912-1.985-15.941-1.264-4.029-3.43-7.533-6.498-10.686-3.249-2.978-6.858-5.08-11.19-6.481-4.332-1.226-9.747-1.927-16.424-1.927zm-4.873 53.08H50.537V73.321h73.279c4.15 0 7.038.7 8.482 1.927 1.444 1.226 2.347 3.503 2.347 6.832v9.81c0 3.503-.903 5.78-2.347 7.006s-4.331 1.752-8.482 1.752z" style="display:inline;fill:none;stroke:currentColor;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"></path></g></svg></div><div style="font-size:1.3em">RuTube</div></div>',
            
            drm_play: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg fill="currentColor" width="256px" height="256px" viewBox="0 -6 46 46" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="_24.TV" data-name="24.TV" d="M46,37H2a1,1,0,0,1-1-1V8A1,1,0,0,1,2,7H46a1,1,0,0,1,1,1V36A1,1,0,0,1,46,37ZM45,9H3V35H45ZM21,16a.975.975,0,0,1,.563.2l7.771,4.872a.974.974,0,0,1,.261,1.715l-7.974,4.981A.982.982,0,0,1,21,28a1,1,0,0,1-1-1V17A1,1,0,0,1,21,16ZM15,39H33a1,1,0,0,1,0,2H15a1,1,0,0,1,0-2Z" transform="translate(-1 -7)" fill-rule="evenodd"></path> </g></svg></div><div style="font-size:1.3em">DRM Play</div></div>',
            
            twitch: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.774 2L2.45 5.452v14.032h4.774V22h2.678l2.548-2.548h3.871l5.226-5.226V2zm15.968 11.323l-3 3h-4.743L9.452 18.87v-2.548H5.42V3.774h14.32zm-2.968-6.097v5.226h-1.775V7.226zm-4.775 0v5.226h-1.774V7.226z"/></svg></div><div style="font-size:1.3em">Twitch</div></div>',
            
            fork_player: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd"> <path d="m0 0h32v32h-32z"></path> <g fill="currentColor" fill-rule="nonzero"> <path d="m32 16c0-8.83636363-7.1636364-16-16-16-8.83636362 0-16 7.16363638-16 16 0 8.8363636 7.16363638 16 16 16 8.8363636 0 16-7.1636364 16-16zm-30.54545453 0c0-8.03345453 6.512-14.54545453 14.54545453-14.54545453 8.0334545 0 14.5454545 6.512 14.5454545 14.54545453 0 8.0334545-6.512 14.5454545-14.5454545 14.5454545-8.03345453 0-14.54545453-6.512-14.54545453-14.5454545z"></path> <path d="m16.6138182 25.2349091v-9.2349091h3.0472727l.4814545-3.0603636h-3.5287272v-1.5345455c0-.7985455.2618182-1.56072727 1.408-1.56072727h2.2909091v-3.05454547h-3.2523636c-2.7345455 0-3.4807273 1.80072728-3.4807273 4.29672724v1.8516364h-1.8763637v3.0618182h1.8763636v9.2349091z"></path> </g> </g> </g></svg></div><div style="font-size:1.3em">ForkPlayer</div></div>',
            
            speedtest: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.45 15.5q.625.625 1.575.588T13.4 15.4L19 7l-8.4 5.6q-.65.45-.712 1.362t.562 1.538M5.1 20q-.55 0-1.012-.238t-.738-.712q-.65-1.175-1-2.437T2 14q0-2.075.788-3.9t2.137-3.175T8.1 4.788T12 4q2.05 0 3.85.775T19 6.888t2.15 3.125t.825 3.837q.025 1.375-.312 2.688t-1.038 2.512q-.275.475-.737.713T18.874 20z"/></svg></div><div style="font-size:1.3em">Speed Test</div></div>'
        };

        // Слушатели событий Storage
        Lampa.Storage.listener.follow('change', function(data) {
            // Обработчик изменений настроек
        });

        // Слушатель настроек
        Lampa.Settings.listener.follow('open', function(data) {
            if (data.name == 'back_menu') {
                Lampa.SettingsApi.addComponent({
                    component: 'back_menu',
                    name: 'BackMenu'
                });
                setTimeout(function() {
                    $('div[data-component="back_menu"]').remove();
                }, 0);
            }
        });

        // Добавление компонента настроек меню
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'back_menu',
                type: 'static',
                default: true
            },
            field: {
                name: 'Меню Выход',
                description: 'Настройки отображения пунктов меню'
            },
            onRender: function(item) {
                item.on('hover:enter', function() {
                    Lampa.Settings.create('back_menu');
                    Lampa.Controller.enabled().controller.back = function() {
                        Lampa.Settings.close('interface');
                    };
                });
            }
        });

        // Добавление параметров меню
        var menuItems = [
            { name: 'exit', title: 'Закрыть приложение' },
            { name: 'reboot', title: 'Перезагрузить' },
            { name: 'switch_server', title: 'Сменить сервер' },
            { name: 'clear_cache', title: 'Очистить кэш' },
            { name: 'youtube', title: 'YouTube' },
            { name: 'rutube', title: 'RuTube' },
            { name: 'drm_play', title: 'DRM Play' },
            { name: 'twitch', title: 'Twitch' },
            { name: 'fork_player', title: 'ForkPlayer' },
            { name: 'speedtest', title: 'Speed Test' }
        ];

        menuItems.forEach(function(item) {
            Lampa.SettingsApi.addParam({
                component: 'back_menu',
                param: {
                    name: item.name,
                    type: 'select',
                    values: {
                        1: 'Скрыть',
                        2: 'Отобразить'
                    },
                    default: item.name === 'youtube' || item.name === 'rutube' || item.name === 'drm_play' || 
                             item.name === 'twitch' || item.name === 'fork_player' || item.name === 'speedtest' ? '1' : '2'
                },
                field: {
                    name: item.title,
                    description: 'Нажмите для выбора'
                }
            });
        });

        // Инициализация настроек по умолчанию
        var checkInterval = setInterval(function() {
            if (typeof Lampa !== 'undefined') {
                clearInterval(checkInterval);
                if (!Lampa.Storage.get('back_menu', 'false')) {
                    setDefaultSettings();
                }
            }
        }, 200);

        function setDefaultSettings() {
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

        // Функция Speed Test
        function openSpeedTest() {
            var html = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
            
            Lampa.Modal.open({
                title: '',
                html: html,
                size: 'medium',
                mask: true,
                onBack: function() {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('content');
                },
                onSelect: function() {}
            });
            
            var iframe = document.getElementById('speedtest-iframe');
            iframe.src = 'http://speedtest.vokino.tv/?R=3';
        }

        // Функция очистки кэша
        function clearCache() {
            Lampa.Storage.clear();
        }

        // Определение протокола
        var protocol = location.protocol === 'https:' ? 'https://' : 'http://';

        // Функция смены сервера
        function switchServer() {
            Lampa.Input.edit({
                title: 'Укажите сервер',
                value: '',
                free: true
            }, function(value) {
                if (value !== '') {
                    window.location.href = protocol + value;
                } else {
                    showMainMenu();
                }
            });
        }

        // Функция выхода из приложения
        function exitApp() {
            if (Lampa.Platform.is('webos')) window.location.assign('exit://exit');
            if (Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
            if (Lampa.Platform.is('browser')) window.close();
            if (Lampa.Platform.is('android')) Lampa.Android.exit();
            if (Lampa.Platform.is('orsay')) Lampa.Orsay.exit();
            if (Lampa.Platform.is('netcast')) window.NetCastBack();
            if (Lampa.Platform.is('apple_tv')) window.history.back();
            if (Lampa.Platform.is('noname')) window.close();
            if (Lampa.Platform.is('nw')) nw.Window.get().close();
        }

        // Главное меню
        function showMainMenu() {
            var currentController = Lampa.Controller.enabled().name;
            var menuArray = [];

            // Проверяем настройки и добавляем пункты меню
            if (localStorage.getItem('exit') !== '1') {
                menuArray.push({ title: menuTemplates.exit });
            }
            if (localStorage.getItem('reboot') !== '1') {
                menuArray.push({ title: menuTemplates.reboot });
            }
            if (localStorage.getItem('switch_server') !== '1') {
                menuArray.push({ title: menuTemplates.switch_server });
            }
            if (localStorage.getItem('clear_cache') !== '1') {
                menuArray.push({ title: menuTemplates.clear_cache });
            }
            if (localStorage.getItem('youtube') !== '1') {
                menuArray.push({ title: menuTemplates.youtube });
            }
            if (localStorage.getItem('rutube') !== '1') {
                menuArray.push({ title: menuTemplates.rutube });
            }
            if (localStorage.getItem('drm_play') !== '1') {
                menuArray.push({ title: menuTemplates.drm_play });
            }
            if (localStorage.getItem('twitch') !== '1') {
                menuArray.push({ title: menuTemplates.twitch });
            }
            if (localStorage.getItem('fork_player') !== '1') {
                menuArray.push({ title: menuTemplates.fork_player });
            }
            if (localStorage.getItem('speedtest') !== '1') {
                menuArray.push({ title: menuTemplates.speedtest });
            }

            Lampa.Select.show({
                title: 'Выход ',
                items: menuArray,
                onBack: function() {
                    Lampa.Controller.toggle('content');
                },
                onSelect: function(item) {
                    // Обработка выбора пункта меню
                    if (item.title == menuTemplates.exit) exitApp();
                    if (item.title == menuTemplates.reboot) location.reload();
                    if (item.title == menuTemplates.switch_server) switchServer();
                    if (item.title == menuTemplates.clear_cache) clearCache();
                    if (item.title == menuTemplates.youtube) window.location.href = 'https://youtube.com/tv';
                    if (item.title == menuTemplates.rutube) window.location.href = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
                    if (item.title == menuTemplates.drm_play) window.location.href = 'https://ott.drm-play.com';
                    if (item.title == menuTemplates.twitch) window.location.href = 'https://webos.tv.twitch.tv';
                    if (item.title == menuTemplates.fork_player) window.location.href = 'http://browser.appfxml.com';
                    if (item.title == menuTemplates.speedtest) openSpeedTest();
                }
            });
        }

        // Слушатель контроллера для открытия меню
        Lampa.Controller.listener.follow('toggle', function(data) {
            if (data.name == 'select' && $('.selectbox__title').text() == Lampa.Lang.translate('title_out')) {
                Lampa.Select.hide();
                setTimeout(function() {
                    showMainMenu();
                }, 100);
            }
        });
    }

    // Запуск при готовности
    if (window.appready) {
        initializeMenus();
    } else {
        Lampa.Listener.follow('app', function(data) {
            if (data.type == 'ready') {
                initializeMenus();
            }
        });
    }

})();