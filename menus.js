(function() {
    'use strict';

    Lampa.Platform.tv();

    // HTML шаблоны для меню
    const exitHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const rebootHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const switchServerHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const clearCacheHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const youtubeHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const rutubeHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const drmPlayHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const twitchHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const forkPlayerHTML = '<div class="settings-folder" style="padding:0!important">...</div>';
    const speedTestHTML = '<div class="settings-folder" style="padding:0!important">...</div>';

    // ПРОВЕРКА СЕРВЕРА УДАЛЕНА
    // if(Lampa.Platform.origin !== 'bylampa'){ ... }

    // Слушатели событий
    Lampa.Storage.listener.follow('change', function(event){});
    
    Lampa.Settings.listener.follow('open', function(data){
        if(data.name == 'main'){
            Lampa.Modal.addComponent({
                'component': 'back_menu',
                'name': 'BackMenu'
            });
            setTimeout(function(){
                $('div[data-component="back_menu"]').remove();
            }, 0);
        }
    });

    // Добавление параметров в настройки
    Lampa.SettingsApi.addParam({
        'component': 'more',
        'param': {
            'name': 'back_menu',
            'type': 'static',
            'default': true
        },
        'field': {
            'name': 'Меню Выход',
            'description': 'Настройки отображения пунктов меню'
        },
        'onRender': function(item){
            item.on('hover:enter', function(){
                Lampa.Settings.create('back_menu');
                Lampa.Controller.enabled().listener.back = function(){
                    Lampa.Settings.close('more');
                };
            });
        }
    });

    // Добавление всех опций меню
    Lampa.SettingsApi.addParam({
        'component': 'back_menu',
        'param': {'name': 'exit', 'type': 'select', 'values': {1: 'Скрыть', 2: 'Отобразить'}, 'default': '2'},
        'field': {'name': 'Закрыть приложение', 'description': 'Нажмите для выбора'}
    });

    // ... остальные параметры (reboot, switch_server, clear_cache, youtube, rutube, drm_play, twitch, fork_player, speedtest)

    // Инициализация настроек по умолчанию
    var initInterval = setInterval(function(){
        if(typeof Lampa !== 'undefined'){
            clearInterval(initInterval);
            if(!Lampa.Storage.get('title_out', 'false')) initDefaults();
        }
    }, 200);

    function initDefaults(){
        Lampa.Storage.set('title_out', true);
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

    // Функции действий
    function showSpeedTest(){
        var html = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
        Lampa.Modal.open({
            'title': '',
            'html': html,
            'size': 'medium',
            'mask': true,
            'onBack': function(){
                Lampa.Modal.close();
                Lampa.Controller.toggle('content');
            }
        });
        document.getElementById('speedtest-iframe').src = 'http://speedtest.vokino.tv/?R=3';
    }

    function clearCache(){
        Lampa.Storage.clear();
    }

    function switchServer(){
        Lampa.Input.create({
            'title': 'Укажите сервер',
            'value': '',
            'free': true
        }, function(value){
            if(value !== '') window.location.href = (location.protocol === 'https:' ? 'https://' : 'http://') + value;
            else showMainMenu();
        });
    }

    function exitApp(){
        // Логика выхода для разных платформ
        if(Lampa.Platform.is('webos')) window.location.assign('exit://exit');
        if(Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
        if(Lampa.Platform.is('apple_tv')) window.close();
        // ... и т.д.
    }

    function showMainMenu(){
        var items = [];
        if(localStorage.getItem('exit') !== '1') items.push({'title': exitHTML});
        if(localStorage.getItem('reboot') !== '1') items.push({'title': rebootHTML});
        // ... добавление остальных пунктов

        Lampa.Select.show({
            'title': 'Выход',
            'items': items,
            'onSelect': function(item){
                // Обработка выбора
            }
        });
    }

    // Слушатель для открытия меню
    Lampa.Controller.listener.follow('toggle', function(event){
        if(event.name == 'select' && $('.selectbox__title').text() == Lampa.Lang.translate('title_out')){
            Lampa.Select.hide();
            setTimeout(function(){ showMainMenu(); }, 100);
        }
    });

    if(window.app) initPlugin();
    else Lampa.Listener.follow('app', function(e){
        if(e.type == 'ready') initPlugin();
    });

})();
