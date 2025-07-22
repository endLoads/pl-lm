/********************************************************************
 *  Lampa –  Ultimate Modular
 *  Автор:  endLoads
 *  Версия: 1.1.0  (24 июл 2025)
 *******************************************************************/
(function () {
    'use strict';

    /****************************************************************
     * 1. Манифест плагина – именно он делает пункт видимым
     ****************************************************************/
    const manifest = {
        id          : 'ultimate_modular',            // уникальный ID
        version     : '1.1.0',
        name        : 'Ultimate Modular',
        description : 'Дополнительные темы и мини-опции',
        icon        : 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png',
        // если PNG не понравится, раскомментируйте SVG ниже и поменяйте icon:
        // icon     : 'data:image/svg+xml;base64,PD94bWwgdm...',
        author      : { name: 'endLoads', url: 'https://github.com/endLoads' }
    };

    /****************************************************************
     * 2. Пути к ресурсам
     ****************************************************************/
    const CSS_URL   = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const THEMES_URL= 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';

    /****************************************************************
     * 3. Подменю-страница плагина
     ****************************************************************/
    function createSettingsFolder(){
        const body = $('<div class="settings-folder__content">');

        // Информация о плагине
        body.append(`
            <div class="settings-folder__content-item">
                <div class="settings-folder__title">О плагине</div>
                <div class="settings-folder__description">
                    Версия: <b>${manifest.version}</b><br>
                    Автор: <b>endLoads</b><br>
                    Статус: <b style="color:#4CAF50">Активен</b>
                </div>
            </div>
        `);

        // Кнопка-пример
        const btn = $('<div class="settings-button selector">Показать уведомление</div>');
        btn.on('hover:enter click', ()=>Lampa.Noty.show('Ultimate Modular работает!'));
        body.append( $('<div class="settings-folder__content-item">').append(btn) );

        // Если скрипт themes.js уже успел положить темы в window.myThemes
        if(Array.isArray(window.myThemes) && window.myThemes.length){
            body.append('<div class="settings-folder__content-item"><div class="settings-folder__title">Темы</div></div>');
            window.myThemes.forEach(t=>{
                $('<div class="settings-folder__content-item">')
                    .text(`•  ${t.name}`)
                    .appendTo(body);
            });
        }

        return body;
    }

    /****************************************************************
     * 4. Основная точка входа плагина (вызывается Plugin Loader’ом)
     ****************************************************************/
    function init(){

        /**************** 4.1. Подгружаем CSS и JS-темы ****************/
        Lampa.Utils.putStyle(CSS_URL);
        Lampa.Utils.putScript(THEMES_URL,()=>{
            console.log('[Ultimate Modular] themes.js загружен');
        });

        /**************** 4.2. Добавляем пункт в «Настройки → Расширения» */
        Lampa.SettingsApi.add(manifest.id, {
            title     : manifest.name,
            icon      : manifest.icon,
            component : function(){ return createSettingsFolder(); }
        });

        console.log('[Ultimate Modular] инициализирован');
    }

    /****************************************************************
     * 5. Регистрация у ядра LAMPA (делает пункт видимым в списке)
     ****************************************************************/
    if (window.Plugin && typeof Plugin.register === 'function'){
        Plugin.register(manifest, init);
    }
    else{
        console.error('[Ultimate Modular] Plugin API не найдено – устарела ли LAMPA?');
    }
})();
