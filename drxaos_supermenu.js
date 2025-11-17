(function () {
  'use strict';

  // ============================================================================
  // КОНФИГУРАЦИЯ
  // ============================================================================
  var SuperMenuConfig = {
    pluginName: 'DrxSuperMenu',
    version: '1.0.0',
    
    // Флаги отладки
    debug: true,
    verbose: false,
    
    // Производительность
    performance: {
      debounceDelay: 300,
      throttleLimit: 100,
      mutationThrottle: 50
    },
    
    // Определение платформы
    platform: {
      android: /Android/i.test(navigator.userAgent),
      webos: /webOS/i.test(navigator.userAgent),
      tizen: /Tizen/i.test(navigator.userAgent),
      browser: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
      tv: /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent)
    },
    
    // Цветовые схемы для меток
    colorSchemes: {
      vivid: {
        '4K': '#FFD700',
        'FHD': '#00CED1',
        'HD': '#32CD32',
        'SD': '#FF6347',
        'CAM': '#DC143C',
        'movie': '#4169E1',
        'tv': '#9370DB'
      },
      soft: {
        '4K': '#F0E68C',
        'FHD': '#B0E0E6',
        'HD': '#90EE90',
        'SD': '#FFA07A',
        'CAM': '#CD5C5C',
        'movie': '#6495ED',
        'tv': '#9F7AEA'
      }
    },
    
    // API параметры
    api: {
      kinopoisk: {
        url: 'https://kinopoiskapiunofficial.tech/api/v2.2/films/',
        key: '', // Будет загружен из Storage
        enabled: true
      },
      tmdb: {
        url: 'https://api.themoviedb.org/3/',
        key: '', // Будет загружен из Storage
        enabled: true
      }
    },
    
    // Кеш рейтингов (в памяти на время сессии)
    cache: {
      ratings: {},
      tracking: {}
    },
    
    // Включение функций
    features: {
      ratings: true,
      tracking: true,
      darkTheme: false,
      colorLabels: true,
      panelButton: true
    }
  };

  // ============================================================================
  // УТИЛИТЫ
  // ============================================================================
  
  function log(message, data) {
    if (SuperMenuConfig.debug) {
      console.log('[' + SuperMenuConfig.pluginName + '] ' + message, data || '');
    }
  }

  function logError(message, error) {
    console.error('[' + SuperMenuConfig.pluginName + '] ' + message, error || '');
  }

  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait || SuperMenuConfig.performance.debounceDelay);
    };
  }

  function throttle(func, limit) {
    var inThrottle;
    return function () {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
        }, limit || SuperMenuConfig.performance.throttleLimit);
      }
    };
  }

  // ============================================================================
  // РАСКРАСКА КАРТОЧЕК
  // ============================================================================
  
  function applyCardColoring(cardElement) {
    try {
      if (!cardElement) return;
      
      var scheme = Lampa.Storage.get('drxsupermenu_colorscheme', 'vivid');
      var colors = SuperMenuConfig.colorSchemes[scheme] || SuperMenuConfig.colorSchemes.vivid;
      
      // Качество
      var qualityEl = cardElement.querySelector('.card__quality, .card-quality');
      if (qualityEl) {
        var qualityText = qualityEl.textContent.trim().toUpperCase();
        if (colors[qualityText]) {
          qualityEl.style.color = colors[qualityText];
          qualityEl.style.fontWeight = '700';
        }
      }
      
      // Тип контента
      var typeEl = cardElement.querySelector('.card__type, .card-type');
      if (typeEl) {
        var typeText = typeEl.textContent.trim().toLowerCase();
        if (colors[typeText]) {
          typeEl.style.color = colors[typeText];
          typeEl.style.fontWeight = '700';
        }
      }
      
    } catch (e) {
      logError('Error in applyCardColoring', e);
    }
  }

  // ============================================================================
  // РЕЙТИНГИ КИНОПОИСКА
  // ============================================================================
  
  function fetchKinopoiskRating(kinopoiskId, callback) {
    try {
      if (!SuperMenuConfig.features.ratings) {
        return callback(null);
      }
      
      if (!kinopoiskId) {
        return callback(null);
      }
      
      // Проверка кеша
      if (SuperMenuConfig.cache.ratings[kinopoiskId]) {
        return callback(SuperMenuConfig.cache.ratings[kinopoiskId]);
      }
      
      var apiKey = Lampa.Storage.get('kinopoisk_api_key', '');
      if (!apiKey) {
        log('KinoPoisk API key not found');
        return callback(null);
      }
      
      var url = SuperMenuConfig.api.kinopoisk.url + kinopoiskId;
      
      var network = new Lampa.Reguest();
      network.native(url, function (data) {
        try {
          var rating = data.ratingKinopoisk || data.rating || null;
          SuperMenuConfig.cache.ratings[kinopoiskId] = rating;
          callback(rating);
        } catch (e) {
          logError('Error parsing KP rating', e);
          callback(null);
        }
      }, function (error) {
        logError('Error fetching KP rating', error);
        callback(null);
      }, false, {
        headers: {
          'X-API-KEY': apiKey
        }
      });
      
    } catch (e) {
      logError('Error in fetchKinopoiskRating', e);
      callback(null);
    }
  }

  // ============================================================================
  // ТРЕКИНГ ОЗВУЧЕК
  // ============================================================================
  
  function saveTrackingInfo(itemId, data) {
    try {
      if (!SuperMenuConfig.features.tracking) return;
      
      SuperMenuConfig.cache.tracking[itemId] = {
        voice: data.voice || '',
        season: data.season || 1,
        episode: data.episode || 1,
        timestamp: Date.now()
      };
      
      // Сохранение в Storage
      Lampa.Storage.set('drxsupermenu_tracking', SuperMenuConfig.cache.tracking);
      
    } catch (e) {
      logError('Error in saveTrackingInfo', e);
    }
  }

  function getTrackingInfo(itemId) {
    try {
      if (!SuperMenuConfig.features.tracking) return null;
      
      if (!SuperMenuConfig.cache.tracking[itemId]) {
        var stored = Lampa.Storage.get('drxsupermenu_tracking', {});
        SuperMenuConfig.cache.tracking = stored;
      }
      
      return SuperMenuConfig.cache.tracking[itemId] || null;
      
    } catch (e) {
      logError('Error in getTrackingInfo', e);
      return null;
    }
  }

  // ============================================================================
  // ТЕМА БЕЗ РАМОК
  // ============================================================================
  
  function applyDarkTheme(enable) {
    try {
      var styleId = 'drxsupermenu-dark-theme';
      var existingStyle = document.getElementById(styleId);
      
      if (enable) {
        if (existingStyle) return;
        
        var css = `
          .card {
            border: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          }
          .card--focus, .card.focus {
            box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
          }
        `;
        
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        
        log('Dark theme applied');
        
      } else {
        if (existingStyle) {
          existingStyle.remove();
          log('Dark theme removed');
        }
      }
      
    } catch (e) {
      logError('Error in applyDarkTheme', e);
    }
  }

  // ============================================================================
  // КНОПКА В ПАНЕЛИ
  // ============================================================================
  
  function addPanelButton() {
    try {
      if (!SuperMenuConfig.features.panelButton) return;
      if (!Lampa.Panel) return;
      
      var buttonHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>';
      
      Lampa.Panel.add({
        name: 'drxsupermenu',
        html: buttonHTML,
        position: 'right',
        onClick: function () {
          Lampa.Noty.show('DrxSuperMenu активен!');
        }
      });
      
      log('Panel button added');
      
    } catch (e) {
      logError('Error in addPanelButton', e);
    }
  }

  // ============================================================================
  // НАСТРОЙКИ
  // ============================================================================
  
  function addSettings() {
    try {
      if (!Lampa.SettingsApi) return;
      
      Lampa.SettingsApi.addComponent({
        component: 'drxsupermenu',
        name: 'DrxSuperMenu',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>'
      });
      
      // Цветовая схема
      Lampa.SettingsApi.addParam({
        component: 'drxsupermenu',
        param: {
          name: 'drxsupermenu_colorscheme',
          type: 'select',
          values: {
            'vivid': 'Яркая',
            'soft': 'Мягкая'
          },
          default: 'vivid'
        },
        field: {
          name: 'Цветовая схема',
          description: 'Выберите схему окраски меток качества'
        },
        onChange: function () {
          applyAllSettings();
        }
      });
      
      // Рейтинги
      Lampa.SettingsApi.addParam({
        component: 'drxsupermenu',
        param: {
          name: 'drxsupermenu_ratings',
          type: 'trigger',
          default: true
        },
        field: {
          name: 'Показывать рейтинги',
          description: 'Получать рейтинги КиноПоиска'
        },
        onChange: function (value) {
          SuperMenuConfig.features.ratings = value;
        }
      });
      
      // Трекинг
      Lampa.SettingsApi.addParam({
        component: 'drxsupermenu',
        param: {
          name: 'drxsupermenu_tracking',
          type: 'trigger',
          default: true
        },
        field: {
          name: 'Трекинг озвучек',
          description: 'Отслеживать просмотренные серии и озвучки'
        },
        onChange: function (value) {
          SuperMenuConfig.features.tracking = value;
        }
      });
      
      // Тёмная тема
      Lampa.SettingsApi.addParam({
        component: 'drxsupermenu',
        param: {
          name: 'drxsupermenu_darktheme',
          type: 'trigger',
          default: false
        },
        field: {
          name: 'Тема без рамок',
          description: 'Убрать рамки у карточек'
        },
        onChange: function (value) {
          SuperMenuConfig.features.darkTheme = value;
          applyDarkTheme(value);
        }
      });
      
      log('Settings added');
      
    } catch (e) {
      logError('Error in addSettings', e);
    }
  }

  // ============================================================================
  // ПРИМЕНЕНИЕ ВСЕХ НАСТРОЕК
  // ============================================================================
  
  function applyAllSettings() {
    try {
      // Загрузка настроек
      SuperMenuConfig.features.ratings = Lampa.Storage.get('drxsupermenu_ratings', true);
      SuperMenuConfig.features.tracking = Lampa.Storage.get('drxsupermenu_tracking', true);
      SuperMenuConfig.features.darkTheme = Lampa.Storage.get('drxsupermenu_darktheme', false);
      
      applyDarkTheme(SuperMenuConfig.features.darkTheme);
      
      // Применение окраски ко всем карточкам
      var cards = document.querySelectorAll('.card');
      cards.forEach(function (card) {
        applyCardColoring(card);
      });
      
      log('All settings applied');
      
    } catch (e) {
      logError('Error in applyAllSettings', e);
    }
  }

  // ============================================================================
  // НАБЛЮДАТЕЛЬ ЗА DOM
  // ============================================================================
  
  function initMutationObserver() {
    try {
      var observer = new MutationObserver(throttle(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) {
                if (node.classList && node.classList.contains('card')) {
                  applyCardColoring(node);
                }
                var cards = node.querySelectorAll('.card');
                if (cards.length) {
                  cards.forEach(function (card) {
                    applyCardColoring(card);
                  });
                }
              }
            });
          }
        });
      }, SuperMenuConfig.performance.mutationThrottle));
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      log('MutationObserver initialized');
      
    } catch (e) {
      logError('Error in initMutationObserver', e);
    }
  }

  // ============================================================================
  // ЭКСПОРТ API
  // ============================================================================
  
  window.DrxSuperMenu = {
    version: SuperMenuConfig.version,
    applyCardColoring: applyCardColoring,
    fetchKinopoiskRating: fetchKinopoiskRating,
    saveTrackingInfo: saveTrackingInfo,
    getTrackingInfo: getTrackingInfo,
    applyDarkTheme: applyDarkTheme,
    applyAllSettings: applyAllSettings,
    config: SuperMenuConfig
  };

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================================================
  
  function start() {
    try {
      log('Starting plugin v' + SuperMenuConfig.version);
      
      addSettings();
      addPanelButton();
      applyAllSettings();
      initMutationObserver();
      
      log('Plugin started successfully');
      
    } catch (e) {
      logError('Error starting plugin', e);
    }
  }

  // ============================================================================
  // BOOTSTRAP - ОЖИДАНИЕ LAMPA API
  // ============================================================================
  
  function bootstrap() {
    var checkInterval = setInterval(function () {
      try {
        if (window.Lampa && Lampa.SettingsApi && Lampa.Panel && Lampa.Listener && Lampa.Storage) {
          clearInterval(checkInterval);
          log('Lampa API detected');
          
          if (window.appready === true) {
            start();
          } else {
            Lampa.Listener.follow('app', function (e) {
              if (e.type === 'ready') {
                start();
              }
            });
          }
        }
      } catch (e) {
        logError('Error in bootstrap', e);
      }
    }, 100);
    
    // Таймаут безопасности
    setTimeout(function () {
      clearInterval(checkInterval);
    }, 30000);
  }

  // Запуск
  bootstrap();

})();
