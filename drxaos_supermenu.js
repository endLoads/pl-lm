(function () {
  "use strict";

  // ============================================================================
  // ЛОГИРОВАНИЕ
  // ============================================================================

  function log() {
    try {
      console.log.apply(console, ["[SuperMenu]"].concat(Array.prototype.slice.call(arguments)));
    } catch (e) {}
  }

  function logError(msg, err) {
    try {
      var errorMsg = "[SuperMenu ERROR] " + msg;
      if (err) {
        if (typeof err === "string") {
          errorMsg += ": " + err;
        } else if (err.message) {
          errorMsg += ": " + err.message;
        } else {
          errorMsg += ": " + JSON.stringify(err);
        }
      }
      console.error(errorMsg);
    } catch (e) {}
  }

  // ============================================================================
  // МОДУЛЬНЫЙ ИНИЦИАЛИЗАТОР
  // Каждый модуль может отдельно упасть, не ломая весь плагин
  // ============================================================================

  var modules = {};

  function registerModule(name, initFunc) {
    modules[name] = initFunc;
  }

  function initializeModule(name) {
    try {
      if (modules[name]) {
        log('Initializing module: ' + name);
        modules[name]();
        log('Module initialized successfully: ' + name);
        return true;
      } else {
        logError('Module not found: ' + name);
        return false;
      }
    } catch (e) {
      logError('Module initialization failed: ' + name, e);
      return false;
    }
  }

  // ============================================================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================================================

  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }

  function debounce(func, delay) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, delay);
    };
  }

  // ============================================================================
  // КОНФИГУРАЦИЯ
  // ============================================================================

  var SuperMenuConfig = {
    DEBUG: false,
    VERBOSE_LOGGING: false,
    PERFORMANCE: {
      DEBOUNCE_DELAY: 300,
      THROTTLE_LIMIT: 100,
      MUTATION_THROTTLE: 50
    },
    PLATFORM: {
      isAndroid: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('android') : false,
      isWebOS: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('webos') : false,
      isTizen: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('tizen') : false,
      isBrowser: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('browser') : false
    },
    LABEL_COLORS: {
      vivid: {
        TYPE: {
          movie: '#FFD54F',
          tv: '#4CAF50',
          anime: '#E91E63'
        },
        QUALITY: {
          '4K': '#FF5722',
          '2160p': '#FF5722',
          '1080p': '#03A9F4',
          '720p': '#B0BEC5',
          SD: '#90A4AE',
          CAM: '#FF7043',
          HDR: '#FFC107'
        }
      },
      soft: {
        TYPE: {
          movie: '#FFE082',
          tv: '#A5D6A7',
          anime: '#F48FB1'
        },
        QUALITY: {
          '4K': '#FF9800',
          '2160p': '#FF9800',
          '1080p': '#81D4FA',
          '720p': '#C5E1A5',
          SD: '#BCAAA4',
          CAM: '#FFAB91',
          HDR: '#FFD54F'
        }
      }
    },
    LABEL_SCHEME: 'vivid',
    FEATURES: {
      madness: false,
      madness_level: 'normal',
      ratings_tmdb: true,
      ratings_imdb: true,
      ratings_kp: false,
      label_colors: true,
      topbar_exit_menu: true,
      borderless_dark_theme: false,
      voiceover_tracking: false
    }
  };

  // ============================================================================
  // МОДУЛЬ: РЕГИСТРАЦИЯ НАСТРОЕК
  // ============================================================================

  registerModule('settings', function() {
    try {
      if (!window.Lampa || !Lampa.Storage || !Lampa.SettingsApi) {
        throw new Error('Lampa.SettingsApi not available');
      }

      if (Lampa.SettingsApi.__superMenuSettingsAdded) {
        log('Settings already registered, skipping');
        return;
      }

      if (typeof Lampa.SettingsApi.addComponent !== 'function') {
        throw new Error('addComponent method not available');
      }

      log('Registering SuperMenu component');

      // Инициализация дефолтов
      var defaults = {
        'supermenu_madness': 'false',
        'supermenu_madness_level': 'normal',
        'supermenu_perf_mode': SuperMenuConfig.PLATFORM.isAndroid ? 'android_perf' : 'normal',
        'supermenu_ratings_tmdb': 'true',
        'supermenu_ratings_imdb': 'true',
        'supermenu_ratings_kp': 'false',
        'supermenu_label_colors': 'true',
        'supermenu_label_scheme': 'vivid',
        'supermenu_topbar_exit': 'true',
        'supermenu_borderless_dark': 'false',
        'supermenu_voiceover_tracking': 'false'
      };

      Object.keys(defaults).forEach(function(key) {
        if (!Lampa.Storage.get(key)) {
          Lampa.Storage.set(key, defaults[key]);
        }
      });

      // Создание компонента
      try {
        Lampa.SettingsApi.addComponent({
          component: 'supermenu',
          name: 'SuperMenu',
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>'
        });
      } catch (e) {
        logError('Failed to create component', e);
        return;
      }

      // Параметры
      var params = [
        { name: 'supermenu_madness', type: 'trigger', default: false, field: { name: 'MADNESS режим', description: 'Визуальные эффекты и украшения' } },
        { name: 'supermenu_madness_level', type: 'select', values: { off: 'Выключен', normal: 'Стандартный', full: 'Полный' }, default: 'normal', field: { name: 'Уровень MADNESS', description: 'Интенсивность модификаций' } },
        { name: 'supermenu_perf_mode', type: 'select', values: { normal: 'Обычный', android_perf: 'Щадящий (Android)' }, default: SuperMenuConfig.PLATFORM.isAndroid ? 'android_perf' : 'normal', field: { name: 'Производительность', description: 'Отзывчивость и нагрузка' } },
        { name: 'supermenu_ratings_tmdb', type: 'trigger', default: true, field: { name: 'Рейтинг TMDB', description: 'Показывать на карточках' } },
        { name: 'supermenu_ratings_imdb', type: 'trigger', default: true, field: { name: 'Рейтинг IMDb', description: 'Показывать на карточках' } },
        { name: 'supermenu_ratings_kp', type: 'trigger', default: false, field: { name: 'Рейтинг КиноПоиск', description: 'Показывать на карточках' } },
        { name: 'supermenu_label_colors', type: 'trigger', default: true, field: { name: 'Цветные метки', description: 'Раскраска качества и типа' } },
        { name: 'supermenu_label_scheme', type: 'select', values: { vivid: 'Яркая', soft: 'Мягкая' }, default: 'vivid', field: { name: 'Схема цветов', description: 'Палитра меток' } },
        { name: 'supermenu_topbar_exit', type: 'trigger', default: true, field: { name: 'Меню выхода', description: 'В верхней панели' } },
        { name: 'supermenu_borderless_dark', type: 'trigger', default: false, field: { name: 'Тёмная без рамок', description: 'Сглаженные карточки' } },
        { name: 'supermenu_voiceover_tracking', type: 'trigger', default: false, field: { name: 'Трекинг озвучек (beta)', description: 'Запоминать выбор' } }
      ];

      var added = 0;
      params.forEach(function(p) {
        try {
          Lampa.SettingsApi.addParam({
            component: 'supermenu',
            param: { name: p.name, type: p.type, values: p.values, default: p.default },
            field: p.field
          });
          added++;
        } catch (e) {
          logError('Failed to add param: ' + p.name, e);
        }
      });

      if (added > 0) {
        Lampa.SettingsApi.__superMenuSettingsAdded = true;
        log('Settings registered: ' + added + ' params added');
      }
    } catch (e) {
      logError('Settings module init', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: ПРИМЕНЕНИЕ ПОЛЬЗОВАТЕЛЬСКИХ НАСТРОЕК
  // ============================================================================

  registerModule('applyUserSettings', function() {
    try {
      if (typeof Lampa === 'undefined' || !Lampa.Storage) {
        throw new Error('Lampa or Storage not available');
      }

      log('Applying user settings');

      var madness = Lampa.Storage.get('supermenu_madness', 'false') === 'true';
      var perfMode = Lampa.Storage.get('supermenu_perf_mode', 'normal');
      var ratingsTmdb = Lampa.Storage.get('supermenu_ratings_tmdb', 'true') === 'true';
      var ratingsImdb = Lampa.Storage.get('supermenu_ratings_imdb', 'true') === 'true';

      SuperMenuConfig.FEATURES.madness = madness;
      SuperMenuConfig.FEATURES.ratings_tmdb = ratingsTmdb;
      SuperMenuConfig.FEATURES.ratings_imdb = ratingsImdb;

      log('Settings applied: madness=' + madness + ', perf=' + perfMode);
    } catch (e) {
      logError('Apply user settings', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: ТЁМНАЯ ТЕМА БЕЗ РАМОК
  // ============================================================================

  registerModule('borderlessDarkTheme', function() {
    try {
      if (Lampa.Storage && Lampa.Storage.get('supermenu_borderless_dark') === 'true') {
        var style = document.createElement('style');
        style.textContent = `
          .card { border-radius: 12px !important; }
          body { background: #0a0e27 !important; }
          .cards { background: #0f1424 !important; }
        `;
        document.head.appendChild(style);
        log('Borderless dark theme applied');
      }
    } catch (e) {
      logError('Borderless dark theme', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: КНОПКА В ТОП-БАРЕ
  // ============================================================================

  registerModule('topBarButton', function() {
    try {
      if (Lampa.Storage && Lampa.Storage.get('supermenu_topbar_exit') === 'true') {
        log('Top bar button module loaded');
        // Здесь будет логика добавления кнопки
      }
    } catch (e) {
      logError('Top bar button', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: MADNESS РЕЖИМ
  // ============================================================================

  registerModule('madnessMode', function() {
    try {
      if (Lampa.Storage && Lampa.Storage.get('supermenu_madness') === 'true') {
        log('MADNESS mode enabled');
        // Здесь будет логика MADNESS режима
      }
    } catch (e) {
      logError('MADNESS mode', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: РЕЙТИНГИ И МЕТКИ
  // ============================================================================

  registerModule('ratings', function() {
    try {
      var tmdb = Lampa.Storage && Lampa.Storage.get('supermenu_ratings_tmdb') === 'true';
      var imdb = Lampa.Storage && Lampa.Storage.get('supermenu_ratings_imdb') === 'true';
      var kp = Lampa.Storage && Lampa.Storage.get('supermenu_ratings_kp') === 'true';

      if (tmdb || imdb || kp) {
        log('Ratings module: TMDB=' + tmdb + ', IMDb=' + imdb + ', KP=' + kp);
        // Здесь будет логика добавления рейтингов
      }
    } catch (e) {
      logError('Ratings module', e);
    }
  });

  // ============================================================================
  // МОДУЛЬ: ЦВЕТНЫЕ МЕТКИ
  // ============================================================================

  registerModule('colorLabels', function() {
    try {
      if (Lampa.Storage && Lampa.Storage.get('supermenu_label_colors') === 'true') {
        log('Color labels module loaded');
        // Здесь будет логика раскраски меток
      }
    } catch (e) {
      logError('Color labels', e);
    }
  });

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ И ТОЧКА ВХОДА
  // ============================================================================

  var supermenu_inited = false;

  function supermenu_start() {
    if (supermenu_inited) return;
    supermenu_inited = true;

    try {
      log('=== INITIALIZATION START ===');

      // Регистрируем настройки с задержкой
      setTimeout(function() {
        log('Registering settings...');
        initializeModule('settings');
      }, 200);

      // Инициализируем модули с задержкой, чтобы дать время на загрузку
      setTimeout(function() {
        log('Initializing modules...');

        var modulesToInit = [
          'applyUserSettings',
          'borderlessDarkTheme',
          'topBarButton',
          'madnessMode',
          'ratings',
          'colorLabels'
        ];

        var initialized = 0;
        var failed = 0;

        modulesToInit.forEach(function(moduleName) {
          if (initializeModule(moduleName)) {
            initialized++;
          } else {
            failed++;
          }
        });

        log('=== INITIALIZATION COMPLETE ===');
        log('Modules initialized: ' + initialized + ', failed: ' + failed);

        // Подписка на изменение настроек
        try {
          if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
            Lampa.Storage.listener.follow('change', function(event) {
              log('Settings changed:', event);
            });
          }
        } catch (e) {
          logError('Storage listener', e);
        }
      }, 500);

    } catch (e) {
      logError('Init error', e);
    }
  }

  // ============================================================================
  // ПОДПИСКА НА СОБЫТИЯ LAMPA
  // ============================================================================

  if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
    log('Lampa found, subscribing to app:ready');

    Lampa.Listener.follow('app', function (e) {
      try {
        if (e.type === 'ready') {
          log('app:ready event received');
          supermenu_start();
        }
      } catch (err) {
        logError('app:ready handler error', err);
      }
    });

    // Фолбэк, если приложение уже готово
    if (window.appready) {
      log('App already ready, initializing immediately');
      supermenu_start();
    }
  } else {
    log('Lampa.Listener not found, using DOMContentLoaded');

    document.addEventListener('DOMContentLoaded', function () {
      if (typeof Lampa !== 'undefined') {
        supermenu_start();
      } else {
        logError('Lampa still not found on DOMContentLoaded');
      }
    });
  }

})();
