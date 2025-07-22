/*************************************************************************
 *  LAMPA  |  Ultimate Modular
 *  Автор  |  endLoads  •  github.com/endLoads
 *  Версия |  1.2.0   •  24-07-2025
 *************************************************************************/
(function () {
    'use strict';

    /* ---------- 1. Манифест ------------------------------------------------ */
    const manifest = {
        id          : 'ultimate_modular',
        name        : 'Ultimate Modular',
        version     : '1.2.0',
        description : 'Дополнительные темы и мини-опции',
        icon        : 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png'
    };

    /* ---------- 2. Пути к ресурсам ---------------------------------------- */
    const CSS_URL    = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';

    /* ---------- 3. Подгрузка стилей / скриптов ---------------------------- */
    function loadAssets(){
        if (Lampa?.Utils?.putStyle)  Lampa.Utils.putStyle(CSS_URL);
        if (Lampa?.Utils?.putScript) Lampa.Utils.putScript(THEMES_URL, () =>
            console.log('[Ultimate Modular] themes.js загружен')
        );
    }

    /* ---------- 4. Контент страницы настроек плагина ---------------------- */
    function createSettingsPage(){
        const $body = $('<div class="settings-folder__content">');

        /* инфо-блок */
        $body.append(`
            <div class="settings-folder__content-item">
                <div class="settings-folder__title">О плагине</div>
                <div class="settings-folder__description">
                    Версия: <b>${manifest.version}</b><br>
                    Автор:  <b>endLoads</b><br>
                    Статус: <b style="color:#4CAF50">Активен</b>
                </div>
            </div>`);

        /* кнопка-пример */
        $('<div class="settings-button selector">Показать уведомление</div>')
            .on('hover:enter click', ()=>Lampa.Noty.show('Ultimate Modular работает!'))
            .appendTo( $('<div class="settings-folder__content-item">').appendTo($body) );

        /* вывод тем, если уже подгрузились */
        if (Array.isArray(window.myThemes) && window.myThemes.length){
            $body.append('<hr style="opacity:.1">');
            window.myThemes.forEach(t=>
                $body.append(`<div class="settings-folder__content-item">• ${t.name}</div>`));
        }

        return $body;
    }

    /* ---------- 5. Добавление в меню через SettingsApi -------------------- */
    function addViaSettingsApi(){
        if (Lampa?.SettingsApi?.add){
            Lampa.SettingsApi.add(manifest.id,{
                title    : manifest.name,
                icon     : manifest.icon,
                component: createSettingsPage
            });
            console.log('[Ultimate Modular] зарегистрирован через SettingsApi');
            return true;
        }
        return false;
    }

    /* ---------- 6. Ручное (DOM) добавление, если SettingsApi нет ---------- */
    function addViaDomListener(){
        console.log('[Ultimate Modular] SettingsApi отсутствует – используем DOM-fallback');

        Lampa.Settings.listener.follow('open', e=>{
            if (e.name!=='extensions' && e.name!=='plugins' && e.name!=='main') return;

            const $item = $(`
                <div class="settings-item selector">
                    <div class="settings-item__icon">
                        <img src="${manifest.icon}" style="width:24px;height:24px">
                    </div>
                    <div class="settings-item__name">${manifest.name}</div>
                </div>`);

            $item.on('hover:enter click', ()=>Lampa.Layer.visible(createSettingsPage(), true,true));
            e.body.append($item);
        });
    }

    /* ---------- 7. Основная инициализация плагина ------------------------- */
    function init(){
        loadAssets();

        /* пробуем красивый официальный способ */
        if (!addViaSettingsApi()){
            /* если не получилось – вставляем вручную */
            addViaDomListener();
        }

        console.log('[Ultimate Modular] инициализация завершена');
    }

    /* ---------- 8. Безопасная регистрация (API или fallback) -------------- */
    function safeRegister(){
        if (window.Plugin?.register){
            /* мобильные / десктоп-сборки */
            Plugin.register(manifest, init);
        } else {
            /* веб-версия */
            console.warn('[Ultimate Modular] Plugin.register отсутствует – fallback-режим');
            init();
        }
    }

    /* ---------- 9. Запуск после готовности приложения --------------------- */
    if (window.appready){
        safeRegister();
    } else {
        Lampa.Listener.follow('app', e=>{
            if (e.type==='ready') safeRegister();
        });
    }

})();

