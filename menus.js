
/**
 * Lampa TV Settings Menu Application
 * Управление пунктами меню настроек
 */

'use strict';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

// HTML templates for menu items
const MENU_ITEMS = {
    YOUTUBE: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path fill="currentColor" d="M31.328 8.271a4 4 0 0 0-2.787-2.781c-2.495-.667-12.525-.667-12.525-.667S6.005 4.807 3.484 5.49A4 4 0 0 0 .703 8.271a41.6 41.6 0 0 0-.697 7.745a42 42 0 0 0 .697 7.708a4.02 4.02 0 0 0 2.781 2.787c2.495.667 12.532.667 12.532.667s10.005 0 12.525-.667a4.02 4.02 0 0 0 2.787-2.787c.459-2.541.683-5.125.667-7.708c.016-2.6-.203-5.188-.667-7.745M12.812 20.803v-9.595l8.349 4.808z"/></svg></div><div style="font-size:1.3em">YouTube</div></div>',

    RUTUBE: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ... >RuTube</svg></div><div style="font-size:1.3em">RuTube</div></div>',

    TWITCH: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>Twitch</svg></div><div style="font-size:1.3em">Twitch</div></div>',

    DRM_PLAY: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>DRM Play</svg></div><div style="font-size:1.3em">DRM Play</div></div>',

    FORK_PLAYER: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>ForkPlayer</svg></div><div style="font-size:1.3em">ForkPlayer</div></div>',

    SPEED_TEST: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>Speed Test</svg></div><div style="font-size:1.3em">Speed Test</div></div>',

    CLEAR_CACHE: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>Clear Cache</svg></div><div style="font-size:1.3em">Очистить кэш</div></div>',

    RELOAD: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg ...>Reload</svg></div><div style="font-size:1.3em">Перезагрузить</div></div>'
};

// API URLs
const URLS = {
    YOUTUBE: 'https://youtube.com/tv',
    RUTUBE: 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/',
    DRM_PLAY: 'https://ott.drm-play.com',
    FORK_PLAYER: 'http://browser.appfxml.com',
    TWITCH: 'https://webos.tv.twitch.tv',
    SPEED_TEST: 'http://speedtest.vokino.tv/?R=3'
};

// Storage keys
const STORAGE_KEYS = {
    BACK_MENU: 'back_menu',
    EXIT_APP: 'exit_app',
    RELOAD_PAGE: 'reload_page',
    SWITCH_SERVER: 'switch_server',
    CLEAR_CACHE: 'clear_cache',
    DISABLE_YOUTUBE: 'youtube',
    DISABLE_RUTUBE: 'rutube',
    DISABLE_TWITCH: 'twitch',
    DISABLE_DRM_PLAY: 'drm_play',
    DISABLE_FORK_PLAYER: 'fork_player',
    DISABLE_SPEED_TEST: 'speedtest',
    INIT_DONE: 'app_initialized'
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Проверяем доступ к приложению
 */
function initializeApp() {
    // Проверка платформы доступа
    if (Lampa.CurrentApplication.id !== 'bylampa') {
        Lampa.Noty.show('Ошибка доступа');
        return;
    }

    // Инициализируем настройки
    initializeSettings();
    setupEventListeners();
    loadDefaultSettings();
}

/**
 * Инициализируем все настройки
 */
function initializeSettings() {
    // Настройка для показа/скрытия кнопки назад в меню
    Lampa.SettingsApi.addParam({
        component: 'back_menu',
        param: {
            name: 'back_menu',
            type: 'select',
            values: { 1: 'Скрыть', 2: 'Отобразить' },
            default: true
        },
        field: {
            name: 'Меню Выход',
            description: 'Настройки отображения пунктов меню'
        },
        onRender: function(element) {
            element.on('hover:enter', function() {
                Lampa.ComponentLoader.create('BackMenu');
                Lampa.Controller.push().then(function() {
                    $('div[data-component="back_menu"]').hide();
                });
            });
        }
    });

    // Компонент для управления выходом
    Lampa.SettingsApi.addParam({
        component: 'back_menu',
        param: {
            name: 'exit_app',
            type: 'select',
            values: { 1: 'Скрыть', 2: 'Отобразить' },
            default: '2'
        },
        field: {
            name: 'Закрыть приложение',
            description: 'Нажмите для выбора'
        }
    });

    // Перезагрузка страницы
    Lampa.SettingsApi.addParam({
        component: 'back_menu',
        param: {
            name: 'reload_page',
            type: 'select',
            values: { 1: 'Скрыть', 2: 'Отобразить' },
            default: '2'
        },
        field: {
            name: 'Перезагрузить',
            description: 'Нажмите для выбора'
        }
    });

    // Смена сервера
    Lampa.SettingsApi.addParam({
        component: 'back_menu',
        param: {
            name: 'switch_server',
            type: 'select',
            values: { 1: 'Скрыть', 2: 'Отобразить' },
            default: '2'
        },
        field: {
            name: 'Сменить сервер',
            description: 'Нажмите для выбора'
        }
    });

    // Очистка кэша
    Lampa.SettingsApi.addParam({
        component: 'back_menu',
        param: {
            name: 'clear_cache',
            type: 'select',
            values: { 1: 'Скрыть', 2: 'Отобразить' },
            default: '2'
        },
        field: {
            name: 'Очистить кэш',
            description: 'Нажмите для выбора'
        }
    });

    // Отображение каналов
    const channels = ['youtube', 'rutube', 'twitch', 'drm_play', 'fork_player', 'speedtest'];

    channels.forEach(function(channel) {
        Lampa.SettingsApi.addParam({
            component: 'back_menu',
            param: {
                name: channel,
                type: 'select',
                values: { 1: 'Скрыть', 2: 'Отобразить' },
                default: '1'
            },
            field: {
                name: channel.charAt(0).toUpperCase() + channel.slice(1),
                description: 'Нажмите для выбора'
            }
        });
    });
}

/**
 * Устанавливаем слушатели событий
 */
function setupEventListeners() {
    // Слушатель изменений в хранилище
    Lampa.Storage.listener.follow('change', function(event) {
        // Обработка изменений
    });

    // Слушатель событий настроек
    Lampa.Settings.listener.follow('select', function(event) {
        if (event.type === 'select') {
            Lampa.ComponentLoader.create('BackMenu');
            setTimeout(function() {
                $('div[data-component="back_menu"]').hide();
            }, 0);
        }
    });

    // Слушатель контроллера
    Lampa.Controller.listener.follow('select', function(event) {
        if (event.name === 'select' && $('.selectbox__title').text() === Lampa.Lang.getItem('title_out')) {
            Lampa.Select.hide();
            setTimeout(function() {
                showMainMenu();
            }, 10);
        }
    });
}

/**
 * Загружаем значения по умолчанию
 */
function loadDefaultSettings() {
    const checkInterval = setInterval(function() {
        if (typeof Lampa !== 'undefined') {
            clearInterval(checkInterval);

            if (!Lampa.Storage.getItem(STORAGE_KEYS.INIT_DONE, 'false')) {
                setDefaultValues();
            }
        }
    }, 200);
}

/**
 * Устанавливаем значения по умолчанию
 */
function setDefaultValues() {
    Lampa.Storage.set(STORAGE_KEYS.INIT_DONE, true);
    Lampa.Storage.set(STORAGE_KEYS.BACK_MENU, '2');
    Lampa.Storage.set(STORAGE_KEYS.EXIT_APP, '2');
    Lampa.Storage.set(STORAGE_KEYS.RELOAD_PAGE, '2');
    Lampa.Storage.set(STORAGE_KEYS.SWITCH_SERVER, '2');
    Lampa.Storage.set(STORAGE_KEYS.CLEAR_CACHE, '2');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_YOUTUBE, '1');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_RUTUBE, '1');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_TWITCH, '1');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_DRM_PLAY, '1');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_FORK_PLAYER, '1');
    Lampa.Storage.set(STORAGE_KEYS.DISABLE_SPEED_TEST, '1');
}

// ============================================================================
// MENU ACTIONS
// ============================================================================

/**
 * Показываем главное меню со всеми доступными пунктами
 */
function showMainMenu() {
    const currentApp = Lampa.ComponentLoader.get().name;
    const items = [];

    // Добавляем пункты меню в зависимости от сохраненных настроек
    if (localStorage.getItem(STORAGE_KEYS.BACK_MENU) !== '1') {
        items.push({ title: 'Выход' });
    }

    if (localStorage.getItem(STORAGE_KEYS.RELOAD_PAGE) !== '1') {
        items.push({ title: 'Перезагрузить' });
    }

    if (localStorage.getItem(STORAGE_KEYS.SWITCH_SERVER) !== '1') {
        items.push({ title: 'Сменить сервер' });
    }

    if (localStorage.getItem(STORAGE_KEYS.CLEAR_CACHE) !== '1') {
        items.push({ title: 'Очистить кэш' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_YOUTUBE) !== '1') {
        items.push({ title: 'YouTube' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_RUTUBE) !== '1') {
        items.push({ title: 'RuTube' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_TWITCH) !== '1') {
        items.push({ title: 'Twitch' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_DRM_PLAY) !== '1') {
        items.push({ title: 'DRM Play' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_FORK_PLAYER) !== '1') {
        items.push({ title: 'ForkPlayer' });
    }

    if (localStorage.getItem(STORAGE_KEYS.DISABLE_SPEED_TEST) !== '1') {
        items.push({ title: 'Speed Test' });
    }

    // Показываем меню
    Lampa.Select.show({
        title: 'Меню',
        items: items,
        onBack: function() {
            Lampa.Controller.toggle('content');
        },
        onSelect: function(item) {
            handleMenuSelection(item);
        }
    });
}

/**
 * Обработка выбора пункта меню
 */
function handleMenuSelection(item) {
    const title = item.title;

    // Команды управления приложением
    if (title === 'Выход') {
        exitApplication();
    } else if (title === 'Перезагрузить') {
        location.reload();
    } else if (title === 'Сменить сервер') {
        promptServerSwitch();
    } else if (title === 'Очистить кэш') {
        clearCache();
    } else if (title === 'Speed Test') {
        openSpeedTest();
    }

    // Перенаправление на приложения
    else if (title === 'YouTube') {
        window.location.href = URLS.YOUTUBE;
    } else if (title === 'RuTube') {
        window.location.href = URLS.RUTUBE;
    } else if (title === 'DRM Play') {
        window.location.href = URLS.DRM_PLAY;
    } else if (title === 'ForkPlayer') {
        window.location.href = URLS.FORK_PLAYER;
    } else if (title === 'Twitch') {
        window.location.href = URLS.TWITCH;
    }
}

/**
 * Выход из приложения с учетом платформы
 */
function exitApplication() {
    if (Lampa.Platform.is('apple_tv')) {
        window.location.assign('exit://exit');
    }

    if (Lampa.Platform.is('webos')) {
        tizen.application.getCurrentApplication().exit();
    }

    if (Lampa.Platform.is('tizen')) {
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

    if (Lampa.Platform.is('nw')) {
        nw.gui.Window.get().close();
    }
}

/**
 * Очистка кэша приложения
 */
function clearCache() {
    Lampa.Storage.clear();
}

/**
 * Открытие теста скорости в модальном окне
 */
function openSpeedTest() {
    const testHtml = $(
        '<div style="text-align:right;">' +
        '<div style="min-height:360px;">' +
        '<iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe>' +
        '</div>' +
        '</div>'
    );

    Lampa.Modal.show({
        title: '',
        html: testHtml,
        size: 'medium',
        mask: true,
        onBack: function() {
            Lampa.Modal.close();
            Lampa.Controller.toggle('content');
        },
        onSelect: function() {}
    });

    const iframe = document.getElementById('speedtest-iframe');
    iframe.src = URLS.SPEED_TEST;
}

/**
 * Запрос у пользователя адреса сервера
 */
function promptServerSwitch() {
    const protocol = location.protocol === 'https:' ? 'https://' : 'http://';

    Lampa.Input.create({
        title: 'Укажите сервер',
        value: '',
        free: true
    }, function(server) {
        if (server !== '') {
            window.location.href = protocol + server;
        } else {
            showMainMenu();
        }
    });
}

// ============================================================================
// ENTRY POINT
// ============================================================================

// Проверяем готовность Lampa
if (window.Lampa) {
    initializeApp();
} else {
    Lampa.Listener.follow('app:ready', function(payload) {
        if (payload.type === 'appready') {
            initializeApp();
        }
    });
}
