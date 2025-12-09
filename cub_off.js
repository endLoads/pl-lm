(function () {
  'use strict';

  // 1. Ждем загрузки платформы, если нужно
  if(Lampa.Platform) Lampa.Platform.tv();

  // 2. Полная перезапись настроек (АКТУАЛЬНАЯ СТРУКТУРА 2025)
  // Мы добавляем недостающие поля, чтобы Lampa не падала
  var _cleanSettings = {
    // --- Основные ---
    lang: 'ru', // Язык (по умолчанию русский)
    lang_use: true,
    read_only: false, // Разрешаем сохранять изменения
    
    // --- Аккаунт и Синхронизация ---
    account_use: true,
    account_sync: true,
    socket_use: true, // ВАЖНО: true, иначе не работает пульт и CUB
    socket_url: 'wss://cub.red/socket', // Стандартный сокет
    
    // --- Контент и Плагины ---
    plugins_use: true,
    plugins_store: true,
    torrents_use: true, // Торренты включены
    iptv: false,
    feed: false,      // Лента рекомендаций (обычно false в модах)
    push_state: true, // Сохранение истории в браузере

    // --- Безопасность и Анти-блок ---
    white_use: false, // Белые списки выкл
    dcma: false,      // Антипиратская заглушка выкл (важно!)
    
    // --- То, из-за чего была ошибка (Developer Mode) ---
    developer: {
      fps: false,
      log: false,
      status: false,
      active: false
    },

    // --- Скрытые функции (Disable Features) ---
    // Это то, что реально выключает рекламу и кнопки
    disable_features: {
      dmca: true,        // Скрывать заглушки "удалено правообладателем"
      ads: true,         // Блокировать рекламу
      trailers: false,   // Трейлеры оставить
      reactions: false,  // Реакции (лайки/дизлайки) - по желанию
      discuss: false,    // Обсуждения/комменты
      ai: true,          // AI рекомендации (иногда глючат)
      subscribe: true,   // Скрыть меню "Подписка"
      blacklist: true,   // Скрыть черный список
      persons: true      // Персоны (актеры) - можно true или false
    }
  };

  // ПРИМЕНЯЕМ НАСТРОЙКИ (Перезапись)
  window.lampa_settings = _cleanSettings;

  // 3. CSS-патч (Лучший способ скрыть мусор)
  // Это работает быстрее и надежнее, чем скрипт удаления
  function injectCSS() {
    var style = document.createElement("style");
    style.innerHTML = `
      .button--subscribe, 
      .settings--account-premium,
      .ad-server,
      .selectbox-item__lock,
      .black-friday__button,
      .christmas__button,
      .open--notice { display: none !important; }
    `;
    document.body.appendChild(style);
  }

  // 4. Хак региона (Для постеров)
  function applyRegionHack() {
    // Ставим UK (Великобритания) или UA для обхода блоков
    var time = new Date().getTime();
    localStorage.setItem("region", JSON.stringify({code: "uk", time: time}));
  }

  // 5. Инициализация
  function startPlugin() {
    injectCSS();
    applyRegionHack();
    
    // Очистка интерфейса при старте (если что-то успело проскочить)
    if (window.$) {
        $(document).ready(function() {
            $(".ad-server").remove();
        });
    }
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow("app", function (e) {
      if (e.type == "ready") startPlugin();
    });
  }

})();
