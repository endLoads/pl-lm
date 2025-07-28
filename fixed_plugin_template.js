(function() {
    'use strict';
    
    // Проверка готовности Lampa
    if (!window.Lampa) {
        console.error('Lampa not found');
        return;
    }
    
    // Уникальное имя плагина для избежания конфликтов
    var PLUGIN_NAME = 'fixed_plugin_template';
    var PLUGIN_VERSION = '1.0.0';
    
    // Проверка на дублирование запуска
    if (window['plugin_' + PLUGIN_NAME + '_ready']) {
        return;
    }
    
    // Локализация
    Lampa.Lang.add({
        [PLUGIN_NAME + '_title']: {
            ru: 'Исправленный плагин',
            en: 'Fixed Plugin',
            uk: 'Виправлений плагін',
            be: 'Выпраўлены плагін'
        },
        [PLUGIN_NAME + '_description']: {
            ru: 'Описание плагина',
            en: 'Plugin description',
            uk: 'Опис плагіна',
            be: 'Апісанне плагіна'
        }
    });
    
    // Основной объект плагина
    var Plugin = {
        name: PLUGIN_NAME,
        version: PLUGIN_VERSION,
        
        // Инициализация плагина
        init: function() {
            try {
                this.addSettings();
                this.bindEvents();
                this.log('Plugin initialized successfully');
            } catch (error) {
                this.log('Error initializing plugin: ' + error.message, 'error');
            }
        },
        
        // Добавление настроек
        addSettings: function() {
            if (!Lampa.SettingsApi) {
                this.log('SettingsApi not available', 'warn');
                return;
            }
            
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: PLUGIN_NAME + '_enabled',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate(PLUGIN_NAME + '_title'),
                    description: Lampa.Lang.translate(PLUGIN_NAME + '_description')
                },
                onChange: this.onSettingChange.bind(this)
            });
        },
        
        // Привязка событий
        bindEvents: function() {
            // Пример привязки событий
            Lampa.Listener.follow('app', this.onAppEvent.bind(this));
        },
        
        // Обработка изменения настроек
        onSettingChange: function(value) {
            this.log('Setting changed: ' + value);
            if (value) {
                this.enable();
            } else {
                this.disable();
            }
        },
        
        // Включение плагина
        enable: function() {
            this.log('Plugin enabled');
            // Логика включения
        },
        
        // Отключение плагина
        disable: function() {
            this.log('Plugin disabled');
            // Логика отключения
        },
        
        // Обработка событий приложения
        onAppEvent: function(event) {
            this.log('App event: ' + event.type);
        },
        
        // Логирование
        log: function(message, level) {
            level = level || 'info';
            var prefix = '[' + PLUGIN_NAME + ' v' + PLUGIN_VERSION + '] ';
            
            switch(level) {
                case 'error':
                    console.error(prefix + message);
                    break;
                case 'warn':
                    console.warn(prefix + message);
                    break;
                default:
                    console.log(prefix + message);
            }
        },
        
        // Проверка совместимости
        checkCompatibility: function() {
            var required = {
                'Lampa.SettingsApi': !!Lampa.SettingsApi,
                'Lampa.Listener': !!Lampa.Listener,
                'Lampa.Lang': !!Lampa.Lang
            };
            
            for (var api in required) {
                if (!required[api]) {
                    this.log('Required API not available: ' + api, 'error');
                    return false;
                }
            }
            
            return true;
        }
    };
    
    // Функция запуска с проверками
    function startPlugin() {
        if (!Plugin.checkCompatibility()) {
            Plugin.log('Plugin initialization failed due to compatibility issues', 'error');
            return;
        }
        
        Plugin.init();
    }
    
    // Ожидание готовности Lampa
    function waitForLampa() {
        if (Lampa && Lampa.SettingsApi && Lampa.Lang && Lampa.Listener) {
            startPlugin();
        } else {
            setTimeout(waitForLampa, 100);
        }
    }
    
    // Отметка готовности и запуск
    window['plugin_' + PLUGIN_NAME + '_ready'] = true;
    waitForLampa();
    
})();