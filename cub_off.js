(function () {
  'use strict';

  // --- НАСТРОЙКИ ---
  var _cleanSettings = {
    lang: 'ru',
    lang_use: true,
    read_only: false,
    account_use: true,
    account_sync: true,
    socket_use: true,
    plugins_use: true,
    plugins_store: true,
    torrents_use: true,
    iptv: false,
    feed: false,
    push_state: true,
    white_use: false,
    dcma: false, 
    developer: { fps: false, log: false, status: false, active: false },
    disable_features: {
      dmca: true,
      ads: true,
      subscribe: true,
      blacklist: true
    }
  };

  window.lampa_settings = _cleanSettings;

  // --- CSS ПАТЧ (Убираем рекламу и серые экраны) ---
  function injectCleanerCSS() {
    var style = document.createElement("style");
    style.innerHTML = `
      /* 1. Убираем интерфейсный мусор Лампы */
      .button--subscribe, 
      .settings--account-premium,
      .ad-server,
      .ad-server-resize,
      div[class*="ad-server"],
      .selectbox-item__lock,
      .black-friday__button,
      .christmas__button,
      .open--notice,
      .card-promo, 
      .promo-block 
      { 
          display: none !important; 
      }

      /* 2. БОРЬБА С СЕРЫМ ЭКРАНОМ "РЕКЛАМА" */
      /* Скрываем слои, которые перекрывают плеер */
      #oframe_player_advertising,
      .player-advertising,
      .ad-preroll-container,
      div[id^="ad_"],
      div[class*="advertising"],
      div:contains("Реклама") 
      {
          display: none !important;
          opacity: 0 !important;
          z-index: -9999 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
      }
      
      /* Если реклама сделана через iframe поверх видео */
      iframe[src*="ad"], iframe[src*="promo"] {
          display: none !important;
      }
    `;
    document.body.appendChild(style);
  }
  
  // --- JS Очистка (на всякий случай) ---
  function removeJunk() {
      // Ищем элементы по тексту "Реклама" и удаляем
      $('div').filter(function() {
          return $(this).text().trim() === 'Реклама';
      }).remove();
  }

  function startPlugin() {
    var time = new Date().getTime();
    localStorage.setItem("region", JSON.stringify({code: "uk", time: time}));

    injectCleanerCSS();

    Lampa.Listener.follow('activity', function (e) {
        if (e.type === 'start') {
           setTimeout(removeJunk, 500);
        }
    });
    
    // Специальный слушатель для плеера (когда открывается видео)
    Lampa.Listener.follow('player', function(e) {
        if(e.type == 'ready' || e.type == 'start') {
            setTimeout(removeJunk, 1000); // Пробуем удалить надпись через секунду после старта
        }
    });
  }

  if (window.appready) startPlugin();
  else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });

})();
