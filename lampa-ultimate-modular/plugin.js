/*************************************************************************
 *  LAMPA  |  Ultimate Modular  (web-версия)
 *  Автор  |  endLoads
 *  Версия |  1.3.0   •  25-07-2025
 *************************************************************************/
(function () {
    'use strict';

    /* ---------- 1. Манифест ------------------------------------------------ */
    const manifest = {
        id         : 'ultimate_modular',
        name       : 'Ultimate Modular',
        version    : '1.3.0',
        icon       : 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png',
        css        : 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css',
        themesJs   : 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js'
    };

    /* ---------- 2. Утилиты -------------------------------------------------- */
    const loadCss = url=>{
        const link = document.createElement('link');
        link.rel   = 'stylesheet';
        link.href  = url;
        document.head.appendChild(link);
    };

    const loadJs = (url,cb)=>{
        fetch(url).then(r=>r.text())
                  .then(code=>{ Function(code)(); cb?.(); })
                  .catch(err=>console.error('[Ultimate Modular] JS load error',err));
    };

    /* ---------- 3. Страница настроек --------------------------------------- */
    function page(){
        const $b = $('<div class="settings-folder__content">');

        $b.append(`
          <div class="settings-folder__content-item">
              <div class="settings-folder__title">О плагине</div>
              <div class="settings-folder__description">
                  Версия: <b>${manifest.version}</b><br>
                  Автор:  <b>endLoads</b><br>
                  Статус: <b style="color:#4CAF50">Активен</b>
              </div>
          </div>`);

        $('<div class="settings-button selector">Показать уведомление</div>')
            .on('hover:enter click',()=>Lampa.Noty.show('Ultimate Modular работает!'))
            .appendTo( $('<div class="settings-folder__content-item">').appendTo($b) );

        if (Array.isArray(window.myThemes)&&window.myThemes.length){
            $b.append('<hr style="opacity:.15">');
            window.myThemes.forEach(t=>
              $b.append(`<div class="settings-folder__content-item">• ${t.name}</div>`));
        }
        return $b;
    }

    /* ---------- 4. Добавление пункта в меню -------------------------------- */
    function addMenuItem(){
        /* 4.1. Пробуем штатный SettingsApi */
        if (Lampa?.SettingsApi?.add){
            Lampa.SettingsApi.add(manifest.id,{
                title    : manifest.name,
                icon     : manifest.icon,
                component: page
            });
            console.log('[Ultimate Modular] добавлен через SettingsApi');
            return;
        }

        /* 4.2. Fallback — «вживляем» пункт в DOM */
        Lampa.Settings.listener.follow('open',e=>{
            if (e.name!=='extensions' && e.name!=='plugins' && e.name!=='main') return;

            const $item = $(`
              <div class="settings-item selector">
                  <div class="settings-item__icon">
                      <img src="${manifest.icon}" style="width:24px;height:24px">
                  </div>
                  <div class="settings-item__name">${manifest.name}</div>
              </div>`);

            $item.on('hover:enter click',()=>Lampa.Layer.visible(page(),true,true));
            e.body.append($item);
        });
        console.log('[Ultimate Modular] добавлен через DOM-fallback');
    }

    /* ---------- 5. Инициализация ------------------------------------------ */
    function init(){
        loadCss(manifest.css);
        loadJs (manifest.themesJs, ()=>console.log('[Ultimate Modular] themes.js загружен'));
        addMenuItem();
        console.log('[Ultimate Modular] готов');
    }

    /* ---------- 6. Запуск после ready -------------------------------------- */
    if (window.appready){
        init();
    } else {
        Lampa.Listener.follow('app',e=>{
            if (e.type==='ready') init();
        });
    }
})();
