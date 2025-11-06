Lampa.Platform.tv();

// Элементы меню (HTML)
const exitHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></div><div style="font-size:1.3em">Закрыть приложение</div></div>';

const rebootHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M11 2a9 9 0 0 0-4.676 1.324l1.461 1.461A7 7 0 0 1 11 4a7 7 0 0 1 7 7 7 7 0 0 1-.787 3.213l1.465 1.465A9 9 0 0 0 20 11a9 9 0 0 0-9-9zM3.322 6.322A9 9 0 0 0 2 11a9 9 0 0 0 9 9 9 9 0 0 0 4.676-1.324l-1.461-1.461A7 7 0 0 1 11 18a7 7 0 0 1-7-7 7 7 0 0 1 .787-3.213z" transform="translate(0 1030.362)"></path></svg></div><div style="font-size:1.3em">Перезагрузить</div></div>';

const switchServerHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.75C10.4142 3.75 10.75 3.41421 10.75 3C10.75 2.58579 10.4142 2.25 10 2.25V3.75ZM14 2.25C13.5858 2.25 13.25 2.58579 13.25 3C13.25 3.41421 13.5858 3.75 14 3.75V2.25Z" fill="currentColor"></path></svg></div><div style="font-size:1.3em">Сменить сервер</div></div>';

const clearCacheHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M26 20h-6v-2h6zm4 8h-6v-2h6zm-2-4h-6v-2h6z"/><path fill="currentColor" d="M17.003 20a4.9 4.9 0 0 0-2.404-4.173L22 3l-1.73-1l-7.577 13.126a5.7 5.7 0 0 0-5.243 1.503C3.706 20.24 3.996 28.682 4.01 29.04a1 1 0 0 0 1 .96h14.991a1 1 0 0 0 .6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11 3.11 0 0 1 15.004 20c0 .038.002.208.017.469l-5.9-2.624a3.8 3.8 0 0 1 2.809-.848M15.45 28A5.2 5.2 0 0 1 14 25h-2a6.5 6.5 0 0 0 .968 3h-2.223A16.6 16.6 0 0 1 10 24H8a17.3 17.3 0 0 0 .665 4H6c.031-1.836.29-5.892 1.803-8.553l7.533 3.35A13 13 0 0 0 17.596 28Z"/></svg></div><div style="font-size:1.3em">Очистить кэш</div></div>';

const youtubeHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.3C.172 2.3 0 3.174 0 10s.172 7.7 10 7.7s10-.874 10-7.7s-.172-7.7-10-7.7m3.205 8.034l-4.49 2.096c-.393.182-.715-.022-.715-.456V8.026c0-.433.322-.638.715-.456l4.49 2.096c.393.184.393.484 0 .668"/></svg></div><div style="font-size:1.3em">YouTube</div></div>';

const rutubeHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="currentColor" d="M128.689 47.57H20.396v116.843h30.141V126.4h57.756l26.352 38.013h33.75l-29.058-38.188c9.025-1.401 15.522-4.73 19.493-9.985 3.97-5.255 5.956-13.664 5.956-24.875v-8.759c0-6.657-.721-11.912-1.985-15.941-1.264-4.029-3.43-7.533-6.498-10.686-3.249-2.978-6.858-5.08-11.19-6.481-4.332-1.226-9.747-1.927-16.424-1.927zm-4.873 53.08H50.537V73.321h73.279c4.15 0 7.038.7 8.482 1.927 1.444 1.226 2.347 3.503 2.347 6.832v9.81c0 3.503-.903 5.78-2.347 7.006s-4.331 1.752-8.482 1.752z" stroke="currentColor" stroke-width="12"></path></svg></div><div style="font-size:1.3em">RuTube</div></div>';

const drmPlayHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg fill="currentColor" width="256px" height="256px" viewBox="0 -6 46 46" xmlns="http://www.w3.org/2000/svg"><path d="M46,37H2a1,1,0,0,1-1-1V8A1,1,0,0,1,2,7H46a1,1,0,0,1,1,1V36A1,1,0,0,1,46,37ZM45,9H3V35H45ZM21,16a.975.975,0,0,1,.563.2l7.771,4.872a.974.974,0,0,1,.261,1.715l-7.974,4.981A.982.982,0,0,1,21,28a1,1,0,0,1-1-1V17A1,1,0,0,1,21,16ZM15,39H33a1,1,0,0,1,0,2H15a1,1,0,0,1,0-2Z" transform="translate(-1 -7)"></path></svg></div><div style="font-size:1.3em">DRM Play</div></div>';

const twitchHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.774 2L2.45 5.452v14.032h4.774V22h2.678l2.548-2.548h3.871l5.226-5.226V2zm15.968 11.323l-3 3h-4.743L9.452 18.87v-2.548H5.42V3.774h14.32zm-2.968-6.097v5.226h-1.775V7.226zm-4.775 0v5.226h-1.774V7.226z"/></svg></div><div style="font-size:1.3em">Twitch</div></div>';

const forkPlayerHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="m32 16c0-8.83636363-7.1636364-16-16-16-8.83636362 0-16 7.16363638-16 16 0 8.8363636 7.16363638 16 16 16 8.8363636 0 16-7.1636364 16-16zm-30.54545453 0c0-8.03345453 6.512-14.54545453 14.54545453-14.54545453 8.0334545 0 14.5454545 6.512 14.5454545 14.54545453 0 8.0334545-6.512 14.5454545-14.5454545 14.5454545-8.03345453 0-14.54545453-6.512-14.54545453-14.5454545z"></path></svg></div><div style="font-size:1.3em">ForkPlayer</div></div>';

const speedTestHTML = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.45 15.5q.625.625 1.575.588T13.4 15.4L19 7l-8.4 5.6q-.65.45-.712 1.362t.562 1.538M5.1 20q-.55 0-1.012-.238t-.738-.712q-.65-1.175-1-2.437T2 14q0-2.075.788-3.9t2.137-3.175T8.1 4.788T12 4q2.05 0 3.85.775T19 6.888t2.15 3.125t.825 3.837q.025 1.375-.312 2.688t-1.038 2.512q-.275.475-.737.713T18.874 20z"/></svg></div><div style="font-size:1.3em">Speed Test</div></div>';

// Инициализация настроек
Lampa.Storage.listener.follow('change', function(event) {});

Lampa.Settings.listener.follow('open', function(event) {
    if (event.name == 'static') {
        Lampa.Controller.addComponent({
            'component': 'back_menu',
            'name': 'BackMenu'
        });
        setTimeout(function() {
            $('div[data-component="back_menu"]').remove();
        }, 0);
    }
});

// Настройка меню
Lampa.SettingsApi.addParam({
    'component': 'main',
    'param': {
        'name': 'back_menu',
        'type': 'static',
        'default': true
    },
    'field': {
        'name': 'Меню Выход',
        'description': 'Настройки отображения пунктов меню'
    },
    'onRender': function(item) {
        item.on('hover:enter', function() {
            Lampa.Settings.create('back_menu');
            Lampa.Controller.enabled().listener.back = function() {
                Lampa.Settings.close('main');
            };
        });
    }
});

// Добавление параметров меню
const menuItems = [
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

menuItems.forEach(item => {
    Lampa.SettingsApi.addParam({
        'component': 'back_menu',
        'param': {
            'name': item.name,
            'type': 'select',
            'values': {
                1: 'Скрыть',
                2: 'Отобразить'
            },
            'default': item.name === 'youtube' || item.name === 'rutube' || 
                       item.name === 'drm_play' || item.name === 'twitch' || 
                       item.name === 'fork_player' || item.name === 'speedtest' ? '1' : '2'
        },
        'field': {
            'name': item.title,
            'description': 'Нажмите для выбора'
        }
    });
});

// Инициализация
const initInterval = setInterval(function() {
    if (typeof Lampa !== 'undefined') {
        clearInterval(initInterval);
        if (!Lampa.Storage.get('back_menu', 'false')) {
            initializeDefaults();
        }
    }
}, 200);

function initializeDefaults() {
    Lampa.Storage.set('back_menu', true);
    menuItems.forEach(item => {
        const defaultValue = ['youtube', 'rutube', 'drm_play', 'twitch', 'fork_player', 'speedtest'].includes(item.name) ? '1' : '2';
        Lampa.Storage.set(item.name, defaultValue);
    });
}

// Функция Speed Test
function openSpeedTest() {
    const html = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
    
    Lampa.Modal.open({
        'title': '',
        'html': html,
        'size': 'medium',
        'mask': true,
        'onBack': function() {
            Lampa.Modal.close();
            Lampa.Controller.toggle('content');
        },
        'onSelect': function() {}
    });
    
    const iframe = document.getElementById('speedtest-iframe');
    iframe.src = 'http://speedtest.vokino.tv/?R=3';
}

// Очистка кэша
function clearCache() {
    Lampa.Storage.clear();
}

// Определение протокола
const protocol = location.protocol === 'https:' ? 'https://' : 'http://';

// Смена сервера
function switchServer() {
    Lampa.Input.edit({
        'title': 'Укажите cервер',
        'value': '',
        'free': true
    }, function(newServer) {
        if (newServer !== '') {
            window.location.href = protocol + newServer;
        } else {
            showMainMenu();
        }
    });
}

// Выход из приложения
function exitApp() {
    if (Lampa.Platform.is('webos')) window.location.assign('exit://exit');
    if (Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
    if (Lampa.Platform.is('apple_tv')) window.close();
    if (Lampa.Platform.is('android')) Lampa.Android.exit();
    if (Lampa.Platform.is('orsay')) Lampa.Orsay.exit();
    if (Lampa.Platform.is('netcast')) window.NetCastBack();
    if (Lampa.Platform.is('noname')) window.history.back();
    if (Lampa.Platform.is('browser')) window.close();
    if (Lampa.Platform.is('nw')) nw.Window.get().close();
}

// Главное меню
function showMainMenu() {
    const currentController = Lampa.Controller.enabled().name;
    const items = [];

    // Добавление элементов меню на основе настроек
    if (localStorage.getItem('exit') !== '1') items.push({ 'title': exitHTML });
    if (localStorage.getItem('reboot') !== '1') items.push({ 'title': rebootHTML });
    if (localStorage.getItem('switch_server') !== '1') items.push({ 'title': switchServerHTML });
    if (localStorage.getItem('clear_cache') !== '1') items.push({ 'title': clearCacheHTML });
    if (localStorage.getItem('youtube') !== '1') items.push({ 'title': youtubeHTML });
    if (localStorage.getItem('rutube') !== '1') items.push({ 'title': rutubeHTML });
    if (localStorage.getItem('drm_play') !== '1') items.push({ 'title': drmPlayHTML });
    if (localStorage.getItem('twitch') !== '1') items.push({ 'title': twitchHTML });
    if (localStorage.getItem('fork_player') !== '1') items.push({ 'title': forkPlayerHTML });
    if (localStorage.getItem('speedtest') !== '1') items.push({ 'title': speedTestHTML });

    Lampa.Select.show({
        'title': 'Выход ',
        'items': items,
        'onBack': function() {
            Lampa.Controller.toggle('content');
        },
        'onSelect': function(item) {
            if (item.title == exitHTML) exitApp();
            if (item.title == rebootHTML) location.reload();
            if (item.title == switchServerHTML) switchServer();
            if (item.title == clearCacheHTML) clearCache();
            if (item.title == youtubeHTML) window.location.href = 'https://youtube.com/tv';
            if (item.title == rutubeHTML) window.location.href = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
            if (item.title == drmPlayHTML) window.location.href = 'https://ott.drm-play.com';
            if (item.title == twitchHTML) window.location.href = 'https://webos.tv.twitch.tv';
            if (item.title == forkPlayerHTML) window.location.href = 'http://browser.appfxml.com';
            if (item.title == speedTestHTML) openSpeedTest();
        }
    });
}

// Обработчик переключения контроллера
Lampa.Controller.listener.follow('toggle', function(event) {
    if (event.name == 'select' && $('.selectbox__title').text() == Lampa.Lang.translate('title_out')) {
        Lampa.Select.hide();
        setTimeout(function() {
            showMainMenu();
        }, 100);
    }
});

// Запуск при готовности
if (window.Manifest) {
    // Код уже выполнен
} else {
    Lampa.Listener.follow('app', function(event) {
        if (event.type == 'ready') {
            // Инициализация завершена
        }
    });
}
