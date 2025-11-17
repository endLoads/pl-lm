(function () {
  "use strict";

  // ============================================================================
  // ЛОГИРОВАНИЕ & CONFIG
  // ============================================================================

  var SuperMenuConfig = {
    DEBUG: true,
    FEATURES: {
      madness: false,
      madness_level: 'normal',
      ratings_tmdb: true,
      ratings_imdb: false,
      ratings_kp: false,
      label_colors: true,
      topbar_exit_menu: true,
      borderless_dark_theme: false,
      voiceover_tracking: false
    },
    PLATFORM: {
      isAndroid: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('android') : false
    }
  };

  function log(msg) {
    if (!SuperMenuConfig.DEBUG) return;
    try {
      console.log("[SuperMenu]", msg);
    } catch (e) {}
  }

  function logError(msg, err) {
    try {
      console.error("[SuperMenu ERROR]", msg, err && err.message ? err.message : err);
    } catch (e) {}
  }

  // ============================================================================
  // УТИЛИТЫ
  // ============================================================================

  function debounce(fn, delay) {
    var timeout;
    return function() {
      var ctx = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        fn.apply(ctx, args);
      }, delay || 300);
    };
  }

  // ============================================================================
  // КНОПКА В ТОПБАРЕ (по паттерну drxaos_theme - initUtilitiesButton)
  // ============================================================================

  var topbarButton = { el: null, menu: null, isOpen: false };

  function injectTopbarButton() {
    try {
      if (!SuperMenuConfig.FEATURES.topbar_exit_menu) return;
      if (topbarButton.el) return;
      if (!Lampa || !Lampa.Head || !Lampa.Head.render) {
        setTimeout(injectTopbarButton, 500);
        return;
      }

      var headActions = Lampa.Head.render.find('.headactions');
      if (!headActions || !headActions.length) {
        setTimeout(injectTopbarButton, 500);
        return;
      }

      // HTML кнопки (SVG + стили, как в drxaos)
      var btnHtml = '<div class="drxaos-exit-btn selector" style="' +
        'position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
        'width:2em;height:2em;border-radius:0.3em;transition:all 0.3s ease;' +
        '">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="width:1.5em;height:1.5em;">' +
        '<path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M22 12C22 16.714 20.536 20.536 16.714 20.536C12.892 20.536 9.171 20.536 5.357 20.536C1.543 20.536 0 20.536 3.464 20.536" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>' +
        '</div>';

      topbarButton.el = $(btnHtml);
      headActions.append(topbarButton.el);

      // Обработчик клика
      topbarButton.el.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleExitMenu();
      });

      // Обработчик Lampa-фокуса
      if (Lampa.Controller && Lampa.Controller.listener) {
        topbarButton.el.on('hover', function(type) {
          if (type === 'enter') {
            topbarButton.el.addClass('focus');
          } else if (type === 'leave') {
            topbarButton.el.removeClass('focus');
          }
        });
      }

      // Стили для фокуса
      if (!document.getElementById('drxaos-exit-btn-styles')) {
        var style = document.createElement('style');
        style.id = 'drxaos-exit-btn-styles';
        style.textContent = '.drxaos-exit-btn { color: #fff; } ' +
          '.drxaos-exit-btn:hover, .drxaos-exit-btn.focus { background-color: rgba(255,255,255,0.1); transform: scale(1.1); }' +
          '.drxaos-exit-menu { position: absolute; top: calc(100% + 0.5em); right: 0; background: rgba(0,0,0,0.95); ' +
          'border: 1px solid #444; border-radius: 0.5em; padding: 0.5em; min-width: 200px; z-index: 10000; }' +
          '.drxaos-exit-menu-item { padding: 0.8em 1em; cursor: pointer; border-radius: 0.3em; ' +
          'transition: all 0.2s ease; color: #fff; } ' +
          '.drxaos-exit-menu-item:hover, .drxaos-exit-menu-item.focus { background-color: #333; }';
        document.head.appendChild(style);
      }

      log('Topbar button injected');
    } catch (e) {
      logError('injectTopbarButton', e);
    }
  }

  function toggleExitMenu() {
    if (topbarButton.isOpen) {
      closeExitMenu();
    } else {
      openExitMenu();
    }
  }

  function openExitMenu() {
    if (!topbarButton.el) return;
    if (topbarButton.menu) {
      topbarButton.menu.show();
      topbarButton.isOpen = true;
      return;
    }

    var menuHtml = '<div class="drxaos-exit-menu">' +
      '<div class="drxaos-exit-menu-item selector" data-action="reload">🔄 Перезагрузить</div>' +
      '<div class="drxaos-exit-menu-item selector" data-action="clear_cache">🗑️ Очистить кэш</div>' +
      '<div class="drxaos-exit-menu-item selector" data-action="exit">🚪 Выход</div>' +
      '</div>';

    topbarButton.menu = $(menuHtml);
    topbarButton.el.append(topbarButton.menu);

    topbarButton.menu.find('.drxaos-exit-menu-item').on('click', function(e) {
      e.preventDefault();
      var action = $(this).data('action');
      handleMenuAction(action);
      closeExitMenu();
    });

    topbarButton.isOpen = true;
    log('Exit menu opened');
  }

  function closeExitMenu() {
    if (topbarButton.menu) {
      topbarButton.menu.hide();
      topbarButton.isOpen = false;
    }
  }

  function handleMenuAction(action) {
    switch(action) {
      case 'reload':
        location.reload();
        break;
      case 'clear_cache':
        try {
          Lampa.Storage.clear();
          Lampa.Noty && Lampa.Noty.show('Кэш очищен');
        } catch(e) {}
        break;
      case 'exit':
        try {
          if (Lampa.Platform && Lampa.Platform.is('android')) {
            Lampa.Android && Lampa.Android.exit();
          } else if (Lampa.Platform && Lampa.Platform.is('webos')) {
            window.close();
          } else {
            window.location.href = 'exit://exit';
          }
        } catch(e) {}
        break;
    }
  }

  // ============================================================================
  // ХУКИ НА КАРТОЧКИ (RATINGS + LABELS)
  // ============================================================================

  try {
    if (Lampa && Lampa.Listener && Lampa.Listener.follow) {
      Lampa.Listener.follow('full', debounce(function(e) {
        if (e.type !== 'complite') return;

        // Получаем активность и рендер
        var activity = e.object && e.object.activity;
        if (!activity || typeof activity.render !== 'function') return;

        var renderContent = activity.render();
        if (!renderContent || !renderContent.find) return;

        var fullStart = renderContent.find('.full-start, .full-info');
        if (!fullStart || !fullStart.length) return;

        // Пытаемся получить данные из разных мест
        var card = e.data && (e.data.movie || e.data.item || e.data.card);
        
        // Если нет, пробуем через Lampa.Background
        if (!card && Lampa.Background && Lampa.Background.current) {
          try {
            var bgData = Lampa.Background.current();
            if (bgData && bgData.card) {
              card = bgData.card;
            }
          } catch(err) {}
        }

        // Если всё ещё нет карточки - берём из активности
        if (!card && e.object && e.object.card) {
          card = e.object.card;
        }

        if (!card) {
          log('No card data found');
          return;
        }

        log('Card found:', card.title || card.name);

        // Добавляем рейтинги
        if (SuperMenuConfig.FEATURES.ratings_tmdb && card.vote_average) {
          var ratingDiv = fullStart.find('.drxaos-rating-tmdb');
          if (!ratingDiv.length) {
            var rating = '<div class="drxaos-rating drxaos-rating-tmdb" style="margin-top:0.5em;font-size:0.9em;color:#03A9F4;">TMDB: ' +
              Number(card.vote_average).toFixed(1) + '</div>';
            fullStart.find('.full-start__detai, .full-info__text').first().append(rating);
          }
        }

        // Добавляем метки
        if (SuperMenuConfig.FEATURES.label_colors) {
          var typeEl = fullStart.find('.card-type, .full-tag.tag--type');
          if (typeEl.length && card.media_type) {
            var colors = { 'movie': '#FFD54F', 'tv': '#4CAF50', 'anime': '#E91E63' };
            var color = colors[card.media_type] || '#fff';
            typeEl.css('color', color);
          }
        }

      }, 150));
      log('Full listener hooks registered');
    }
  } catch (e) {
    logError('Full listener setup', e);
  }

  // ============================================================================
  // СИНХРОНИЗАЦИЯ НАСТРОЕК
  // ============================================================================

  function applyUserSettings() {
    try {
      if (!Lampa || !Lampa.Storage) return;
      SuperMenuConfig.FEATURES.madness = Lampa.Storage.get('supermenu_madness', 'false') === 'true';
      SuperMenuConfig.FEATURES.ratings_tmdb = Lampa.Storage.get('supermenu_ratings_tmdb', 'true') === 'true';
      SuperMenuConfig.FEATURES.label_colors = Lampa.Storage.get('supermenu_label_colors', 'true') === 'true';
      SuperMenuConfig.FEATURES.topbar_exit_menu = Lampa.Storage.get('supermenu_topbar_exit', 'true') === 'true';
      log('Settings applied');
    } catch(err) {
      logError('applyUserSettings', err);
    }
  }

  // ============================================================================
  // РЕГИСТРАЦИЯ НАСТРОЕК
  // ============================================================================

  function addSettings() {
    try {
      if (!Lampa || !Lampa.SettingsApi) return;
      if (Lampa.SettingsApi.__superMenuAdded) return;
      Lampa.SettingsApi.__superMenuAdded = true;

      var defaults = {
        'supermenu_madness': 'false',
        'supermenu_ratings_tmdb': 'true',
        'supermenu_label_colors': 'true',
        'supermenu_topbar_exit': 'true'
      };

      Object.keys(defaults).forEach(function(key) {
        if (!Lampa.Storage.get(key)) {
          Lampa.Storage.set(key, defaults[key]);
        }
      });

      Lampa.SettingsApi.addComponent({
        component: 'supermenu',
        name: 'SuperMenu',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>'
      });

      var params = [
        { name: 'supermenu_madness', type: 'trigger', title: 'MADNESS режим', desc: 'Визуальные эффекты' },
        { name: 'supermenu_ratings_tmdb', type: 'trigger', title: 'Рейтинг TMDB', desc: 'На карточках' },
        { name: 'supermenu_label_colors', type: 'trigger', title: 'Цветные метки', desc: 'Для качества/типа' },
        { name: 'supermenu_topbar_exit', type: 'trigger', title: 'Меню выхода в панели', desc: 'Кнопка сверху' }
      ];

      params.forEach(function(p) {
        try {
          Lampa.SettingsApi.addParam({
            component: 'supermenu',
            param: { name: p.name, type: p.type, default: p.type === 'trigger' ? false : 'default' },
            field: { name: p.title, description: p.desc },
            onChange: function(value) {
              Lampa.Storage.set(p.name, value ? 'true' : 'false');
              applyUserSettings();
              injectTopbarButton(); // Перинициализация кнопки если её настройка изменилась
            }
          });
        } catch(err) {
          logError('Param ' + p.name, err);
        }
      });

      log('Settings registered');
    } catch (e) {
      logError('addSettings', e);
    }
  }

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================================================

  var inited = false;

  function start() {
    if (inited) return;
    inited = true;

    setTimeout(addSettings, 200);
    setTimeout(function() {
      applyUserSettings();
      injectTopbarButton();
      log('SuperMenu started');
    }, 500);
  }

  if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') {
        setTimeout(start, 500);
      }
    });
    if (window.appready) start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }

})();
