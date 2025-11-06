
/**
 * =====================================================================
 * Lampa Plugin - TV Application Menu Controller
 * =====================================================================
 * 
 * Плагин для управления меню и интеграции сервисов на TV приложениях
 * Поддерживаемые платформы: WebOS, Tizen, Android, Apple TV и др.
 * 
 * Автор: Автоматическая деобфускация
 * Дата: 2025-11-06
 */

// =====================================================================
// 1. КОНСТАНТЫ И КОНФИГУРАЦИЯ
// =====================================================================

const LAMPA_CONFIG = {
  // ============ ТЕКСТЫ ИНТЕРФЕЙСА ============
  UI_TEXTS: {
    EXIT_BTN: "Выход",
    REBOOT_BTN: "Перезагрузить",
    SWITCH_SERVER_BTN: "Сменить сервер",
    CLEAR_CACHE_BTN: "Очистить кэш",
    MENU_TITLE: "Меню",
    SETTINGS_DESCRIPTION: "Настройки отображения пунктов меню",
    INPUT_PLACEHOLDER: "Укажите сервер",
    ERROR_ACCESS_DENIED: "Ошибка доступа",
    SELECT_PROMPT: "Нажмите для выбора"
  },

  // ============ НАЗВАНИЯ СЕРВИСОВ ============
  SERVICES: {
    YOUTUBE: "YouTube",
    RUTUBE: "RuTube", 
    DRM_PLAY: "DRM Play",
    TWITCH: "Twitch",
    FORKPLAYER: "ForkPlayer",
    SPEEDTEST: "Speed Test"
  },

  // ============ URL СЕРВИСОВ ============
  SERVICE_URLS: {
    YOUTUBE: "https://youtube.com/tv",
    RUTUBE: "https://rutube.ru/tv-release/rutube.server-22.0.0/webos/",
    DRM_PLAY: "https://ott.drm-play.com",
    TWITCH: "https://webos.tv.twitch.tv",
    FORKPLAYER: "http://browser.appfxml.com",
    SPEEDTEST: "http://speedtest.vokino.tv/?R=3"
  },

  // ============ КЛЮЧИ ХРАНИЛИЩА ============
  STORAGE_KEYS: {
    EXIT: "exit",
    REBOOT: "reboot",
    SWITCH_SERVER: "switch_server",
    CLEAR_CACHE: "clear_cache",
    BACK_MENU: "back_menu",
    YOUTUBE: "youtube",
    RUTUBE: "rutube",
    DRM_PLAY: "drm_play",
    TWITCH: "twitch",
    FORKPLAYER: "fork_player",
    SPEEDTEST: "speedtest"
  },

  // ============ ПЛАТФОРМЫ ============
  PLATFORMS: {
    WEBOS: "webos",
    TIZEN: "tizen",
    ANDROID: "android",
    APPLE_TV: "apple_tv",
    NETCAST: "netcast",
    ORSAY: "orsay",
    BROWSER: "browser",
    NODEJS: "nw"
  },

  // ============ ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ============
  VISIBILITY: {
    HIDDEN: "1",
    SHOWN: "2"
  }
};

// =====================================================================
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =====================================================================

/**
 * Проверяет, скрыт ли пункт меню (значение = "1")
 * @param {string} key - Ключ localStorage
 * @returns {boolean} true если скрыто
 */
function isMenuItemHidden(key) {
  return localStorage.getItem(key) === LAMPA_CONFIG.VISIBILITY.HIDDEN;
}

/**
 * Переход на URL
 * @param {string} url - адрес
 */
function navigateToUrl(url) {
  window.location.href = url;
}

/**
 * Показать уведомление пользователю
 * @param {string} message - текст сообщения
 */
function showMessage(message) {
  Lampa.Noty.show(message);
}

/**
 * Получить базовый протокол (http или https)
 * @returns {string}
 */
function getBaseProtocol() {
  return location.protocol === "https:" ? "https:" : "http://";
}

// =====================================================================
// 3. ФУНКЦИИ УПРАВЛЕНИЯ ПРИЛОЖЕНИЕМ
// =====================================================================

/**
 * Выход из приложения (с поддержкой разных платформ)
 */
function exitFromApplication() {
  const platform = Lampa.Platform;
  const plat = LAMPA_CONFIG.PLATFORMS;

  if (platform.is(plat.APPLE_TV)) {
    window.location.assign("exit://exit");
  } 
  else if (platform.is(plat.TIZEN)) {
    tizen.webOSSystem["Скрыть"]()["youtube"]();
  } 
  else if (platform.is(plat.BROWSER)) {
    window.close();
  } 
  else if (platform.is(plat.ANDROID)) {
    Lampa.Android.exit();
  } 
  else if (platform.is(plat.ORSAY)) {
    Lampa.Orsay.exit();
  } 
  else if (platform.is(plat.NETCAST)) {
    window.NetCastBack();
  } 
  else if (platform.is(plat.NODEJS)) {
    nw["Input"]["title"]()["prototype"]();
  } 
  else {
    window.close();
  }
}

/**
 * Перезагрузить приложение
 */
function rebootApplication() {
  location.reload();
}

/**
 * Показать диалог для ввода сервера
 */
function openServerInputDialog() {
  const baseProto = getBaseProtocol();

  Lampa.Input.show({
    title: LAMPA_CONFIG.UI_TEXTS.INPUT_PLACEHOLDER,
    value: "",
    free: true
  }, function(inputValue) {
    if (inputValue !== "") {
      navigateToUrl(baseProto + inputValue);
    } else {
      displayMainMenu();
    }
  });
}

/**
 * Очистить кэш и localStorage
 */
function clearApplicationCache() {
  Lampa.Storage.clear();
}

/**
 * Открыть Speed Test в модальном окне
 */
function launchSpeedTest() {
  const htmlContent = $(
    '<div style="text-align:right;"><div style="min-height:360px;">' +
    '<iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe>' +
    '</div></div>'
  );

  Lampa.Modal.show({
    title: "",
    html: htmlContent,
    size: "browser",
    mask: true,
    onBack: function() {
      Lampa.Modal.close();
      Lampa.Controller.toggle("listener");
    },
    onSelect: function() {}
  });

  const iframeEl = document.getElementById("speedtest-iframe");
  iframeEl.src = LAMPA_CONFIG.SERVICE_URLS.SPEEDTEST;
}

// =====================================================================
// 4. ГЛАВНОЕ МЕНЮ
// =====================================================================

/**
 * Построить массив пунктов меню на основе настроек
 * @returns {Array} массив пунктов меню
 */
function buildMenuItems() {
  const items = [];
  const cfg = LAMPA_CONFIG;

  if (!isMenuItemHidden(cfg.STORAGE_KEYS.EXIT)) {
    items.push({ title: cfg.UI_TEXTS.EXIT_BTN });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.REBOOT)) {
    items.push({ title: cfg.UI_TEXTS.REBOOT_BTN });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.SWITCH_SERVER)) {
    items.push({ title: cfg.UI_TEXTS.SWITCH_SERVER_BTN });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.CLEAR_CACHE)) {
    items.push({ title: cfg.UI_TEXTS.CLEAR_CACHE_BTN });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.RUTUBE)) {
    items.push({ title: cfg.SERVICES.RUTUBE });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.DRM_PLAY)) {
    items.push({ title: cfg.SERVICES.DRM_PLAY });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.TWITCH)) {
    items.push({ title: cfg.SERVICES.TWITCH });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.FORKPLAYER)) {
    items.push({ title: cfg.SERVICES.FORKPLAYER });
  }
  if (!isMenuItemHidden(cfg.STORAGE_KEYS.SPEEDTEST)) {
    items.push({ title: cfg.SERVICES.SPEEDTEST });
  }

  return items;
}

/**
 * Обработать выбор пункта меню
 * @param {string} selectedTitle - выбранный пункт
 */
function handleMenuItemSelection(selectedTitle) {
  const ui = LAMPA_CONFIG.UI_TEXTS;
  const svc = LAMPA_CONFIG.SERVICES;
  const urls = LAMPA_CONFIG.SERVICE_URLS;

  if (selectedTitle === ui.EXIT_BTN) {
    exitFromApplication();
  } 
  else if (selectedTitle === ui.REBOOT_BTN) {
    rebootApplication();
  } 
  else if (selectedTitle === ui.SWITCH_SERVER_BTN) {
    openServerInputDialog();
  } 
  else if (selectedTitle === ui.CLEAR_CACHE_BTN) {
    clearApplicationCache();
  } 
  else if (selectedTitle === svc.YOUTUBE) {
    navigateToUrl(urls.YOUTUBE);
  } 
  else if (selectedTitle === svc.RUTUBE) {
    navigateToUrl(urls.RUTUBE);
  } 
  else if (selectedTitle === svc.DRM_PLAY) {
    navigateToUrl(urls.DRM_PLAY);
  } 
  else if (selectedTitle === svc.TWITCH) {
    navigateToUrl(urls.TWITCH);
  } 
  else if (selectedTitle === svc.FORKPLAYER) {
    navigateToUrl(urls.FORKPLAYER);
  } 
  else if (selectedTitle === svc.SPEEDTEST) {
    launchSpeedTest();
  }
}

/**
 * Показать главное меню
 */
function displayMainMenu() {
  const items = buildMenuItems();

  Lampa.Select.show({
    title: LAMPA_CONFIG.UI_TEXTS.MENU_TITLE,
    items: items,
    onBack: function() {
      Lampa.Controller.toggle("content");
    },
    onSelect: function(selectedItem) {
      handleMenuItemSelection(selectedItem.title);
    }
  });
}

// =====================================================================
// 5. ИНИЦИАЛИЗАЦИЯ ПАРАМЕТРОВ
// =====================================================================

/**
 * Регистрировать все параметры приложения
 */
function registerApplicationSettings() {
  const cfg = LAMPA_CONFIG;

  const settingsList = [
    { key: cfg.STORAGE_KEYS.EXIT, label: "Кнопка выхода" },
    { key: cfg.STORAGE_KEYS.REBOOT, label: "Кнопка перезагрузки" },
    { key: cfg.STORAGE_KEYS.SWITCH_SERVER, label: "Смена сервера" },
    { key: cfg.STORAGE_KEYS.CLEAR_CACHE, label: "Очистка кэша" },
    { key: cfg.STORAGE_KEYS.RUTUBE, label: "RuTube" },
    { key: cfg.STORAGE_KEYS.DRM_PLAY, label: "DRM Play" },
    { key: cfg.STORAGE_KEYS.TWITCH, label: "Twitch" },
    { key: cfg.STORAGE_KEYS.FORKPLAYER, label: "ForkPlayer" },
    { key: cfg.STORAGE_KEYS.SPEEDTEST, label: "Speed Test" }
  ];

  settingsList.forEach(setting => {
    Lampa.SettingsApi.addParam({
      component: "Settings",
      param: {
        name: setting.key,
        type: "select",
        values: {
          1: "Скрыть",
          2: "Показать"
        },
        default: "2"
      },
      field: {
        name: setting.label,
        description: cfg.UI_TEXTS.SELECT_PROMPT
      }
    });
  });
}

/**
 * Установить значения по умолчанию в localStorage
 */
function initializeDefaultValues() {
  const cfg = LAMPA_CONFIG;

  const keysToInitialize = [
    cfg.STORAGE_KEYS.EXIT,
    cfg.STORAGE_KEYS.REBOOT,
    cfg.STORAGE_KEYS.SWITCH_SERVER,
    cfg.STORAGE_KEYS.CLEAR_CACHE,
    cfg.STORAGE_KEYS.RUTUBE,
    cfg.STORAGE_KEYS.DRM_PLAY,
    cfg.STORAGE_KEYS.TWITCH,
    cfg.STORAGE_KEYS.FORKPLAYER,
    cfg.STORAGE_KEYS.SPEEDTEST
  ];

  keysToInitialize.forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, cfg.VISIBILITY.SHOWN);
    }
  });
}

// =====================================================================
// 6. ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ ПЛАГИНА
// =====================================================================

/**
 * Инициализировать плагин Lampa
 */
function initializeLampaMenuPlugin() {
  console.log("🚀 Инициализация Lampa Menu Plugin...");

  // Проверка манифеста (безопасность)
  if (Lampa.Manifest.name === "noname") {
    showMessage(LAMPA_CONFIG.UI_TEXTS.ERROR_ACCESS_DENIED);
    console.error("❌ Доступ запрещен: неизвестный манифест");
    return;
  }

  // Регистрируем настройки
  registerApplicationSettings();

  // Инициализируем значения по умолчанию
  initializeDefaultValues();

  // Слушаем события изменения настроек
  Lampa.Settings.on("follow", function(event) {
    if (event.name === LAMPA_CONFIG.STORAGE_KEYS.SWITCH_SERVER) {
      Lampa.Controller.addComponent({
        component: "BackMenu",
        name: "reboot"
      });
    }
  });

  // Слушаем события контроллера
  Lampa.Controller.on("toggle", function(event) {
    if (event.name === "select") {
      const selectTitle = $(".selectbox__title").text();
      if (selectTitle === LAMPA_CONFIG.UI_TEXTS.MENU_TITLE) {
        Lampa.Select.hide();
        setTimeout(() => {
          displayMainMenu();
        }, 10);
      }
    }
  });

  console.log("✅ Lampa Menu Plugin инициализирован успешно!");
}

// =====================================================================
// 7. ТОЧКА ВХОДА ПРИЛОЖЕНИЯ
// =====================================================================

if (window["twitch"]) {
  // Lampa уже инициализирована
  initializeLampaMenuPlugin();
} else {
  // Ждем события готовности Lampa
  Lampa.on("appready", function(event) {
    if (event.exit === "protocol" || event.ready) {
      initializeLampaMenuPlugin();
    }
  });
}

// =====================================================================
// Конец плагина
// =====================================================================
