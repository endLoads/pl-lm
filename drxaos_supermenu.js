(function () {
  "use strict";

  // Глобальная переменная для предотвращения повторной инициализации
  if (window.drxaos_supermenu_initialized) {
    console.log('[DRXAOS SuperMenu] Plugin already initialized');
    return;
  }

  // ============================================================================
  // БАЗОВАЯ КОНФИГУРАЦИЯ ПЛАГИНА
  // ============================================================================
  var SuperMenuConfig = {
    DEBUG: false,
    VERBOSE_LOGGING: false,

    // Профиль производительности (базовый)
    PERFORMANCE: {
      DEBOUNCE_DELAY: 300,
      THROTTLE_LIMIT: 100,
      MUTATION_THROTTLE: 50
    },

    // Поведение в разных средах
    PLATFORM: {
      isAndroid: false,
      isWebOS: false,
      isTizen: false,
      isBrowser: false,
      isTV: false
    },

    // Цветовые схемы для меток качества и типа
    LABEL_COLORS: {
      vivid: {
        TYPE: {
          movie: "#FFD54F",
          tv: "#4CAF50",
          anime: "#E91E63"
        },
        QUALITY: {
          "4K": "#FF5722",
          "2160p": "#FF5722",
          "1080p": "#03A9F4",
          "720p": "#B0BEC5",
          SD: "#90A4AE",
          CAM: "#FF7043",
          HDR: "#FFC107"
        }
      },
      soft: {
        TYPE: {
          movie: "#FFE082",
          tv: "#A5D6A7",
          anime: "#F48FB1"
        },
        QUALITY: {
          "4K": "#FFAB91",
          "2160p": "#FFAB91",
          "1080p": "#81D4FA",
          "720p": "#CFD8DC",
          SD: "#B0BEC5",
          CAM: "#FFAB91",
          HDR: "#FFD54F"
        }
      }
    },

    LABEL_SCHEME: "vivid",

    // Параметры рейтингов и API
    RATINGS: {
      tmdbApiKey: "",
      kpApiKey: "",
      kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.2/films"
    },

    // Кэш рейтингов на время сессии
    RATING_CACHE: {
      tmdb: {},
      imdb: {},
      kp: {}
    },

    VOICEOVER: {
      enabled: false,
      cache: {}
    },

    // Включение/выключение подсистем
    FEATURES: {
      madness: true,
      madness_level: "normal", // off | normal | full

      ratings_tmdb: true,
      ratings_imdb: true,
      ratings_kp: true,
      ratings_other: false,

      label_colors: true,
      label_quality: true,
      label_type: true,
      label_year: true,
      label_voiceover: true,
      label_duration: true,
      label_genre: true,

      hero_titles: true,
      hero_ratings: true,
      hero_info: true,
      hero_backdrop: true,

      cards_enhanced: true,
      cards_hover: true,
      cards_animations: true,

      menu_enhanced: true,
      menu_compact: false,
      menu_ratings: true,
      menu_quality: true,

      details_expanded: true,
      details_spoilers: false,
      details_crew: true,

      search_enhanced: true,
      search_suggestions: true,

      torretns_quality: true,
      torretns_filter: true,
      torretns_sort: true
    }
  };

  // ============================================================================
  // УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================================================

  // Безопасное логирование
  function log(message, type = 'info') {
    if (!SuperMenuConfig.DEBUG && type !== 'error') return;
    
    const prefix = '[DRXAOS SuperMenu]';
    switch (type) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'warn':
        console.warn(prefix, message);
        break;
      case 'info':
      default:
        console.log(prefix, message);
        break;
    }
  }

  // Безопасная работа с хранилищем
  function safeStorageGet(key, defaultValue = null) {
    try {
      if (window.Lampa && Lampa.Storage) {
        return Lampa.Storage.get(key, defaultValue);
      }
    } catch (e) {
      log('Storage get error: ' + e.message, 'error');
    }
    return defaultValue;
  }

  function safeStorageSet(key, value) {
    try {
      if (window.Lampa && Lampa.Storage) {
        Lampa.Storage.set(key, value);
        return true;
      }
    } catch (e) {
      log('Storage set error: ' + e.message, 'error');
    }
    return false;
  }

  // Debounce функция для оптимизации
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle функция для оптимизации
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ============================================================================
  // ОСНОВНОЙ КЛАСС ПЛАГИНА
  // ============================================================================

  class SuperMenuPlugin {
    constructor() {
      this.initialized = false;
      this.originalCreateMenu = null;
      this.observer = null;
      this.settings = Object.assign({}, SuperMenuConfig);
      
      // Привязка методов
      this.init = this.init.bind(this);
      this.enhanceMenu = this.enhanceMenu.bind(this);
      this.createEnhancedCard = this.createEnhancedCard.bind(this);
      this.applyLabels = this.applyLabels.bind(this);
      this.addQualityIndicators = this.addQualityIndicators.bind(this);
    }

    // Инициализация плагина
    init() {
      if (this.initialized) {
        log('Plugin already initialized');
        return;
      }

      // Проверка доступности Lampa
      if (typeof window.Lampa === 'undefined') {
        log('Lampa API not found', 'error');
        return;
      }

      // Настройка платформы
      this.setupPlatform();
      
      // Загрузка настроек
      this.loadSettings();
      
      // Сохранение оригинальных методов
      this.backupOriginalMethods();
      
      // Применение улучшений
      this.applyEnhancements();
      
      // Настройка наблюдателя
      this.setupObserver();
      
      this.initialized = true;
      log('Plugin initialized successfully');
      
      // Сохраняем флаг инициализации
      window.drxaos_supermenu_initialized = true;
    }

    // Настройка параметров платформы
    setupPlatform() {
      try {
        this.settings.PLATFORM.isAndroid = Lampa.Platform && Lampa.Platform.is("android");
        this.settings.PLATFORM.isWebOS = Lampa.Platform && Lampa.Platform.is("webos");
        this.settings.PLATFORM.isTizen = Lampa.Platform && Lampa.Platform.is("tizen");
        this.settings.PLATFORM.isBrowser = Lampa.Platform && Lampa.Platform.is("browser");
        this.settings.PLATFORM.isTV = this.settings.PLATFORM.isAndroid || 
                                      this.settings.PLATFORM.isTizen || 
                                      this.settings.PLATFORM.isWebOS;
      } catch (e) {
        log('Platform detection error: ' + e.message, 'error');
      }
    }

    // Загрузка настроек из хранилища
    loadSettings() {
      try {
        const savedSettings = safeStorageGet('drxaos_supermenu_settings');
        if (savedSettings) {
          this.settings = Object.assign(this.settings, JSON.parse(savedSettings));
        }
        
        const scheme = safeStorageGet('drxaos_supermenu_label_scheme', this.settings.LABEL_SCHEME);
        this.settings.LABEL_SCHEME = scheme;
        
        log('Settings loaded');
      } catch (e) {
        log('Settings load error: ' + e.message, 'error');
      }
    }

    // Сохранение оригинальных методов
    backupOriginalMethods() {
      try {
        if (window.Lampa && Lampa.Template && Lampa.Template.get) {
          this.originalCreateMenu = Lampa.Template.get;
        }
      } catch (e) {
        log('Backup methods error: ' + e.message, 'error');
      }
    }

    // Применение улучшений
    applyEnhancements() {
      try {
        // Улучшение меню
        if (this.settings.FEATURES.menu_enhanced) {
          this.enhanceMenu();
        }
        
        // Улучшение карточек
        if (this.settings.FEATURES.cards_enhanced) {
          this.enhanceCards();
        }
        
        // Улучшение деталей
        if (this.settings.FEATURES.details_expanded) {
          this.enhanceDetails();
        }
        
        log('Enhancements applied');
      } catch (e) {
        log('Apply enhancements error: ' + e.message, 'error');
      }
    }

    // Улучшение меню
    enhanceMenu() {
      try {
        // Переопределяем метод создания меню
        if (window.Lampa && Lampa.Template && Lampa.Template.get) {
          const originalGet = Lampa.Template.get;
          
          Lampa.Template.get = (name, data = {}) => {
            let result = originalGet.call(Lampa.Template, name, data);
            
            // Добавляем улучшения для меню
            if (name === 'menu' && this.settings.FEATURES.menu_enhanced) {
              result = this.createEnhancedMenu(result, data);
            }
            
            return result;
          };
        }
      } catch (e) {
        log('Enhance menu error: ' + e.message, 'error');
      }
    }

    // Создание улучшенного меню
    createEnhancedMenu(html, data) {
      try {
        // Добавляем CSS классы для улучшенного меню
        const enhancedHtml = html.replace(
          /class="menu"/,
          'class="menu drxaos-supermenu-enhanced"'
        );
        
        return enhancedHtml;
      } catch (e) {
        log('Create enhanced menu error: ' + e.message, 'error');
        return html;
      }
    }

    // Улучшение карточек
    enhanceCards() {
      try {
        // Настраиваем наблюдатель для карточек
        this.setupCardObserver();
      } catch (e) {
        log('Enhance cards error: ' + e.message, 'error');
      }
    }

    // Настройка наблюдателя для карточек
    setupCardObserver() {
      try {
        if (window.MutationObserver) {
          this.observer = new MutationObserver(
            debounce((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                  mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                      this.processCardElement(node);
                    }
                  });
                }
              });
            }, this.settings.PERFORMANCE.DEBOUNCE_DELAY)
          );
          
          // Наблюдаем за контейнером контента
          const contentContainer = document.querySelector('.content');
          if (contentContainer) {
            this.observer.observe(contentContainer, {
              childList: true,
              subtree: true
            });
          }
        }
      } catch (e) {
        log('Setup card observer error: ' + e.message, 'error');
      }
    }

    // Обработка элемента карточки
    processCardElement(element) {
      try {
        // Ищем карточки контента
        const cards = element.querySelectorAll && element.querySelectorAll('.card, .full-card, .torrent-item');
        if (cards && cards.length) {
          Array.from(cards).forEach(card => this.enhanceCard(card));
        }
        
        // Также проверяем сам элемент
        if (element.classList && 
            (element.classList.contains('card') || 
             element.classList.contains('full-card') || 
             element.classList.contains('torrent-item'))) {
          this.enhanceCard(element);
        }
      } catch (e) {
        log('Process card element error: ' + e.message, 'error');
      }
    }

    // Улучшение отдельной карточки
    enhanceCard(card) {
      try {
        if (card.classList.contains('drxaos-enhanced')) return;
        
        card.classList.add('drxaos-enhanced');
        
        // Применяем цветовые метки
        if (this.settings.FEATURES.label_colors) {
          this.applyLabels(card);
        }
        
        // Добавляем индикаторы качества
        if (this.settings.FEATURES.label_quality) {
          this.addQualityIndicators(card);
        }
        
        // Добавляем анимации при наведении
        if (this.settings.FEATURES.cards_hover) {
          this.addHoverEffects(card);
        }
        
      } catch (e) {
        log('Enhance card error: ' + e.message, 'error');
      }
    }

    // Применение цветовых меток
    applyLabels(card) {
      try {
        const colors = this.settings.LABEL_COLORS[this.settings.LABEL_SCHEME];
        if (!colors) return;
        
        // Находим элементы для меток
        const typeElement = card.querySelector('.card-type, .item-type');
        const qualityElement = card.querySelector('.card-quality, .item-quality');
        
        // Применяем цвета типа контента
        if (typeElement) {
          const typeText = typeElement.textContent.toLowerCase();
          if (typeText.includes('фильм') || typeText.includes('movie')) {
            typeElement.style.backgroundColor = colors.TYPE.movie;
          } else if (typeText.includes('сериал') || typeText.includes('tv')) {
            typeElement.style.backgroundColor = colors.TYPE.tv;
          } else if (typeText.includes('аниме') || typeText.includes('anime')) {
            typeElement.style.backgroundColor = colors.TYPE.anime;
          }
        }
        
        // Применяем цвета качества
        if (qualityElement) {
          const qualityText = qualityElement.textContent.toUpperCase();
          if (colors.QUALITY[qualityText]) {
            qualityElement.style.backgroundColor = colors.QUALITY[qualityText];
          }
        }
        
      } catch (e) {
        log('Apply labels error: ' + e.message, 'error');
      }
    }

    // Добавление индикаторов качества
    addQualityIndicators(card) {
      try {
        // Ищем информацию о качестве в карточке
        const titleElement = card.querySelector('.card-title, .item-title, .torrent-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent || '';
        
        // Определяем качество по названию
        const quality = this.detectQuality(title);
        if (quality) {
          // Создаем индикатор качества
          const qualityIndicator = document.createElement('div');
          qualityIndicator.className = 'drxaos-quality-indicator';
          qualityIndicator.textContent = quality;
          qualityIndicator.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: ${this.settings.LABEL_COLORS[this.settings.LABEL_SCHEME].QUALITY[quality] || '#666'};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10;
          `;
          
          // Добавляем индикатор к карточке
          card.style.position = 'relative';
          card.appendChild(qualityIndicator);
        }
        
      } catch (e) {
        log('Add quality indicators error: ' + e.message, 'error');
      }
    }

    // Определение качества по названию
    detectQuality(title) {
      const upperTitle = title.toUpperCase();
      
      if (upperTitle.includes('4K') || upperTitle.includes('2160P')) return '4K';
      if (upperTitle.includes('1080P') || upperTitle.includes('FHD')) return '1080p';
      if (upperTitle.includes('720P') || upperTitle.includes('HD')) return '720p';
      if (upperTitle.includes('CAM') || upperTitle.includes('CAMRIP')) return 'CAM';
      if (upperTitle.includes('HDR')) return 'HDR';
      
      return null;
    }

    // Добавление эффектов при наведении
    addHoverEffects(card) {
      try {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'scale(1.02)';
          card.style.transition = 'transform 0.2s ease';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'scale(1)';
        });
      } catch (e) {
        log('Add hover effects error: ' + e.message, 'error');
      }
    }

    // Улучшение деталей
    enhanceDetails() {
      try {
        // Добавляем CSS для улучшенных деталей
        this.injectCSS();
      } catch (e) {
        log('Enhance details error: ' + e.message, 'error');
      }
    }

    // Внедрение CSS стилей
    injectCSS() {
      try {
        const css = `
          .drxaos-supermenu-enhanced {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          }
          
          .drxaos-enhanced {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
          }
          
          .drxaos-enhanced:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          }
          
          .drxaos-quality-indicator {
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
        log('CSS injected');
      } catch (e) {
        log('Inject CSS error: ' + e.message, 'error');
      }
    }

    // Настройка общего наблюдателя
    setupObserver() {
      try {
        // Наблюдаем за изменениями в DOM для динамического применения улучшений
        if (window.MutationObserver) {
          const observer = new MutationObserver(
            debounce(() => {
              // Применяем улучшения к новым элементам
              const cards = document.querySelectorAll('.card:not(.drxaos-enhanced), .full-card:not(.drxaos-enhanced), .torrent-item:not(.drxaos-enhanced)');
              cards.forEach(card => this.enhanceCard(card));
            }, this.settings.PERFORMANCE.DEBOUNCE_DELAY)
          );
          
          // Наблюдаем за body
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          log('Observer setup complete');
        }
      } catch (e) {
        log('Setup observer error: ' + e.message, 'error');
      }
    }

    // Метод для переключения отладки
    toggleDebug() {
      this.settings.DEBUG = !this.settings.DEBUG;
      safeStorageSet('drxaos_supermenu_debug', this.settings.DEBUG);
      log('Debug mode: ' + (this.settings.DEBUG ? 'ON' : 'OFF'));
    }

    // Метод для переключения цветовой схемы
    toggleColorScheme() {
      this.settings.LABEL_SCHEME = this.settings.LABEL_SCHEME === 'vivid' ? 'soft' : 'vivid';
      safeStorageSet('drxaos_supermenu_label_scheme', this.settings.LABEL_SCHEME);
      
      // Обновляем существующие карточки
      const cards = document.querySelectorAll('.drxaos-enhanced');
      cards.forEach(card => {
        card.classList.remove('drxaos-enhanced');
        this.enhanceCard(card);
      });
      
      log('Color scheme changed to: ' + this.settings.LABEL_SCHEME);
    }

    // Метод для сохранения настроек
    saveSettings() {
      try {
        safeStorageSet('drxaos_supermenu_settings', JSON.stringify(this.settings));
        log('Settings saved');
      } catch (e) {
        log('Save settings error: ' + e.message, 'error');
      }
    }
  }

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ ПЛАГИНА
  // ============================================================================

  // Создаем экземпляр плагина
  const superMenuPlugin = new SuperMenuPlugin();

  // Функция инициализации
  function initializePlugin() {
    try {
      // Проверяем доступность Lampa
      if (typeof window.Lampa === 'undefined') {
        console.error('[DRXAOS SuperMenu] Lampa API not found');
        return;
      }

      // Проверяем доступность критических компонентов
      const requiredComponents = ['Storage', 'Template', 'Platform'];
      const missingComponents = requiredComponents.filter(comp => !window.Lampa[comp]);
      
      if (missingComponents.length > 0) {
        console.warn('[DRXAOS SuperMenu] Missing components:', missingComponents);
      }

      // Инициализируем плагин
      superMenuPlugin.init();

      // Добавляем глобальные методы для управления плагином
      window.DrxaosSuperMenu = {
        plugin: superMenuPlugin,
        toggleDebug: () => superMenuPlugin.toggleDebug(),
        toggleColorScheme: () => superMenuPlugin.toggleColorScheme(),
        saveSettings: () => superMenuPlugin.saveSettings()
      };

      console.log('[DRXAOS SuperMenu] Plugin ready! Use window.DrxaosSuperMenu for control');
      
    } catch (error) {
      console.error('[DRXAOS SuperMenu] Initialization error:', error);
    }
  }

  // Регистрируем слушатель событий Lampa
  if (typeof window.Lampa !== 'undefined' && window.Lampa.Listener) {
    Lampa.Listener.follow('app', function(event) {
      if (event.type === 'ready') {
        // Небольшая задержка для полной загрузки интерфейса
        setTimeout(initializePlugin, 100);
      }
    });
  } else {
    // Резервный вариант: инициализация при загрузке DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
      setTimeout(initializePlugin, 500);
    }
  }

  // Экспортируем плагин для глобального доступа
  window.SuperMenuPlugin = SuperMenuPlugin;

})();