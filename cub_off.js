(function () {
  'use strict';

  // ========================================================================
  // 1. НАСТРОЙКИ (Config)
  // Безопасная конфигурация для Lampa 2024-2025
  // ========================================================================
  var _cleanSettings = {
    // --- Основные ---
    lang: 'ru',
    lang_use: true,
    read_only: false,
    
    // --- Аккаунт и CUB (Оставляем включенным для истории) ---
    account_use: true,
    account_sync: true,  
    socket_use: true,    
    
    // --- Плагины ---
    plugins_use: true,
    plugins_store: true,
    
    // --- Контент ---
    torrents_use: true,
    iptv: false,
    feed: false,      
    push_state: true, 

    // --- Блокировки ---
    white_use: false, 
    dcma: false,      
    
    // --- Developer (Чтобы не было ошибок при старте) ---
    developer: {
      fps: false,
      log: false,
      status: false,
      active: false
    },

    // --- Отключение функций (Disable Features) ---
    disable_features: {
      dmca: true,        // Скрыть "удалено правообладателем"
      ads: true,         // Глобальное отключение рекламы
      trailers: false,   
      reactions: false,  
      discuss: false,    
      ai: true,          
      subscribe: true,   // Скрыть меню "Подписка"
      blacklist: true,   
      persons: true      
    }
  };

  // Применяем настройки
  window.lampa_settings = _cleanSettings;


  // ========================================================================
  // 2. CSS ПАТЧ (Visual Cleaner)
  // Скрывает интерфейсный мусор и рекламные слои
  // ========================================================================
  function injectCleanerCSS() {
    var style = document.createElement("style");
    style.innerHTML = `
      /* Скрываем кнопки покупки и баннеры */
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
      .promo-block,
      [data-component="ad"] 
      { 
          display: none !important; 
          width: 0 !important; 
          height: 0 !important; 
          pointer-events: none !important;
      }

      /* Скрываем серые экраны "Реклама" поверх плеера */
      #oframe_player_advertising,
      .player-advertising,
      .ad-preroll-container,
      div[id^="ad_"],
      div[class*="advertising"],
      .layer--advertising
      {
          display: none !important;
          opacity: 0 !important;
          z-index: -9999 !important;
          pointer-events: none !important;
      }
    `;
    document.body.appendChild(style);
  }


  // ========================================================================
  // 3. ПЕРЕХВАТЧИК ЛОГИКИ (Logic Killer)
  // Подменяет функции вызова рекламы, чтобы они сразу завершались
  // ========================================================================
  function killAdsLogic() {
      console.log('[Plugin] Запуск перехватчика рекламы...');
      
      // 1. Подмена стандартного модуля рекламы Lampa
      if (Lampa.Ad) {
          Lampa.Ad.launch = function (data) {
              console.log('[Plugin] Lampa.Ad.launch заблокирован');
              // Сразу сообщаем плееру, что реклама "просмотрена"
              if (data && data.callback) data.callback();
          };
      }
      
      // 2. Постоянная очистка DOM (на случай динамической подгрузки)
      setInterval(function() {
          // Ищем элементы с текстом "Реклама" или классом advertising
          var ads = $('.player-advertising, .layer--advertising');
          
          if (ads.length > 0) {
              console.log('[Plugin] Найден рекламный слой - удаляем');
              ads.remove();
              
              // Если видео на паузе - запускаем
              var video = $('video');
              if (video.length > 0 && video[0].paused) {
                  video[0].play();
              }
          }
          
          // Удаляем текстовые плашки "Реклама"
          $('div').filter(function() {
             return $(this).text().trim() === 'Реклама' && $(this).css('position') === 'absolute';
          }).remove();

      }, 1000); // Проверка каждую секунду
  }


  // ========================================================================
  // 4. ИНИЦИАЛИЗАЦИЯ (Start)
  // ========================================================================
  function startPlugin() {
    // Хак региона для постеров (UK)
    var time = new Date().getTime();
    localStorage.setItem("region", JSON.stringify({code: "uk", time: time}));

    injectCleanerCSS();
    killAdsLogic();
    
    // Дополнительная зачистка при смене экранов
    Lampa.Listener.follow('activity', function (e) {
        if (e.type === 'start') {
            $('.ad-server').remove();
        }
    });
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow("app", function (e) {
      if (e.type == "ready") startPlugin();
    });
  }

})();
