(function () {
  "use strict";

  // Эта функция будет вызвана только после полной загрузки Lampa
  function init() {
    // Повторная проверка на всякий случай, хотя bootstrap уже это делает
    if (typeof Lampa === "undefined") return;

    // === БАЗОВАЯ КОНФИГУРАЦИЯ ПЛАГИНА ===
    var SuperMenuConfig = {
      DEBUG: false,
      VERBOSE_LOGGING: false,

      // Профиль производительности (базовый)
      PERFORMANCE: {
        DEBOUNCE_DELAY: 300,
        THROTTLE_LIMIT: 100,
        MUTATION_THROTTLE: 250 // Увеличено для наблюдателя, чтобы не срабатывать слишком часто
      },

      // Поведение в разных средах
      PLATFORM: {
        isAndroid: Lampa.Platform.is("android"),
        isWebOS: Lampa.Platform.is("webos"),
        isTizen: Lampa.Platform.is("tizen"),
        isBrowser: Lampa.Platform.is("browser"),
        isTV: Lampa.Platform.is("android") || Lampa.Platform.is("tizen") || Lampa.Platform.is("webos") || Lampa.Platform.is("orsay") || Lampa.Platform.is("netcast")
      },

      // Цветовые схемы для меток качества и типа
      LABEL_COLORS: {
        vivid: {
          TYPE: { movie: "#FFD54F", tv: "#4CAF50", anime: "#E91E63" },
          QUALITY: { "4K": "#FF5722", "2160p": "#FF5722", "1080p": "#03A9F4", "720p": "#B0BEC5", SD: "#90A4AE", CAM: "#FF7043", HDR: "#FFC107" }
        },
        soft: {
          TYPE: { movie: "#FFE082", tv: "#A5D6A7", anime: "#F48FB1" },
          QUALITY: { "4K": "#FFAB91", "2160p": "#FFAB91", "1080p": "#81D4FA", "720p": "#CFD8DC", SD: "#B0BEC5", CAM: "#FFAB91", HDR: "#FFD54F" }
        }
      },

      LABEL_SCHEME: "vivid",

      // Параметры рейтингов и API
      RATINGS: {
        tmdbApiKey: "", // Не используется, так как TMDB берется из meta
        kpApiKey: "", // Будет загружен из настроек
        kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.2/films" // Будет загружен из настроек
      },

      // Кэш рейтингов на время сессии
      RATING_CACHE: {
        tmdb: Object.create(null),
        imdb: Object.create(null),
        kp: Object.create(null)
      },

      VOICEOVER: {
        enabled: false,
        cache: Object.create(null)
      },

      // Включение/выключение подсистем
      FEATURES: {
        madness: true,
        madness_level: "normal", // off | normal | full

        ratings_tmdb: true,
        ratings_imdb: true,
        ratings_kp: true,

        label_colors: true,
        voiceover_tracking: false,
        topbar_exit_menu: true,

        borderless_dark_theme: false
      }
    };

    // Профиль производительности для Android TV
    if (SuperMenuConfig.PLATFORM.isAndroid) {
      SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
      SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
      SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 400;
    }

    // === УТИЛИТЫ ===
    function log() {
      if (!SuperMenuConfig.DEBUG && !SuperMenuConfig.VERBOSE_LOGGING) return;
      try {
        console.log.apply(console, ["[SuperMenu]"].concat([].slice.call(arguments)));
      } catch (e) {}
    }

    function throttle(fn, limit) {
      var inThrottle, lastFn, lastTime;
      return function () {
        var context = this,
          args = arguments;
        if (!inThrottle) {
          fn.apply(context, args);
          lastTime = Date.now();
          inThrottle = true;
        } else {
          clearTimeout(lastFn);
          lastFn = setTimeout(function () {
            if (Date.now() - lastTime >= limit) {
              fn.apply(context, args);
              lastTime = Date.now();
            }
          }, Math.max(limit - (Date.now() - lastTime), 0));
        }
      };
    }

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РЕЙТИНГОВ ===

    function fetchJsonWithTimeout(url, options, timeoutMs) {
      return new Promise(function (resolve, reject) {
        var aborted = false;
        var timeout = setTimeout(function () {
          aborted = true;
          reject(new Error("Timeout " + timeoutMs + "ms for " + url));
        }, timeoutMs || 8000);

        fetch(url, options || {})
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
            return res.json();
          })
          .then(function (json) {
            if (!aborted) {
              clearTimeout(timeout);
              resolve(json);
            }
          })
          .catch(function (err) {
            if (!aborted) {
              clearTimeout(timeout);
              reject(err);
            }
          });
      });
    }

    function getRatingFromCache(source, key) {
      var cache = SuperMenuConfig.RATING_CACHE[source];
      if (!cache) return null;
      return cache[key] || null;
    }

    function setRatingToCache(source, key, value) {
      var cache = SuperMenuConfig.RATING_CACHE[source];
      if (!cache) return;
      cache[key] = value;
    }

    // ИСПРАВЛЕНО: Функция теперь использует данные из meta-объекта карточки
    function getTmdbRating(meta, cb) {
      if (!SuperMenuConfig.FEATURES.ratings_tmdb || !meta) {
        cb && cb(null);
        return;
      }
      try {
        if (meta.vote_average) {
          var result = {
            source: "tmdb",
            value: parseFloat(meta.vote_average).toFixed(1),
            votes: meta.vote_count
          };
          cb && cb(result);
        } else {
          cb && cb(null);
        }
      } catch (e) {
        log("getTmdbRating error:", e);
        cb && cb(null);
      }
    }

    // ИСПРАВЛЕНО: Функция теперь использует данные из meta-объекта карточки (если есть)
    function getImdbRating(meta, cb) {
        if (!SuperMenuConfig.FEATURES.ratings_imdb || !meta) {
            cb && cb(null);
            return;
        }
        try {
            // В некоторых случаях Lampa может передавать рейтинг IMDb
            if (meta.imdb_rating) {
                 var result = {
                    source: "imdb",
                    value: parseFloat(meta.imdb_rating).toFixed(1),
                    votes: meta.imdb_votes
                };
                cb && cb(result);
                return;
            }
            // Если нет, то оставляем заглушку, т.к. прямого бесплатного API нет
            cb && cb(null);
        } catch (e) {
            log('getImdbRating error:', e);
            cb && cb(null);
        }
    }


    // ИСПРАВЛЕНО: Функция теперь использует ключ и URL из настроек
    function getKpRating(meta, cb) {
      if (!SuperMenuConfig.FEATURES.ratings_kp || !meta) {
        cb && cb(null);
        return;
      }

      try {
        var key = meta.kp_id || meta.id || meta.title + "_" + (meta.year || "");
        var cached = getRatingFromCache("kp", key);
        if (cached) {
          cb && cb(cached);
          return;
        }

        if (!SuperMenuConfig.RATINGS.kpApiKey || !SuperMenuConfig.RATINGS.kpApiUrl) {
          cb && cb(null);
          return;
        }
        
        var url;
        // Предпочитаем поиск по ID, если он есть
        if(meta.kp_id) {
            url = SuperMenuConfig.RATINGS.kpApiUrl + "/" + meta.kp_id;
        } else {
            url = SuperMenuConfig.RATINGS.kpApiUrl + "?keyword=" + encodeURIComponent(meta.title) + (meta.year ? "&yearFrom=" + meta.year + "&yearTo=" + meta.year : "");
        }


        fetchJsonWithTimeout(
          url,
          {
            headers: {
              "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey,
              "Content-Type": "application/json"
            }
          },
          8000
        )
          .then(function (json) {
            var film = null;

            if (json && Array.isArray(json.items) && json.items.length) {
              film = json.items[0];
            } else if (json && Array.isArray(json.films) && json.films.length) {
              film = json.films[0];
            } else if(json && (json.ratingImdb || json.ratingKinopoisk)) { // Если пришел сразу объект фильма (поиск по ID)
              film = json;
            }

            if (!film) {
              cb && cb(null);
              return;
            }

            var value = Number(film.ratingKinopoisk || film.ratingImdb || film.rating);
            var votes = Number(film.ratingKinopoiskVoteCount || film.ratingImdbVoteCount || film.votes);

            if (!isFinite(value) || value === 0) {
              cb && cb(null);
              return;
            }

            var result = {
              source: "kp",
              value: value.toFixed(1),
              votes: isFinite(votes) ? votes : undefined
            };
            setRatingToCache("kp", key, result);
            cb && cb(result);
          })
          .catch(function (err) {
            log("getKpRating fetch error:", err);
            cb && cb(null);
          });
      } catch (e) {
        log("getKpRating error:", e);
        cb && cb(null);
      }
    }

    // === МЕНЮ ВЫХОДА (адаптация menus.js) ===
    
    // ИСПРАВЛЕНО: Заменено localStorage на Lampa.Storage
    function exitMenuEnsureDefaults() {
      try {
        var items = ExitMenuConfig.items;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (Lampa.Storage.get('menu_' + item.name) === null) {
            Lampa.Storage.set('menu_' + item.name, item.defaultValue);
          }
        }
      } catch (e) {
        log("exitMenuEnsureDefaults error:", e);
      }
    }
    
    var ExitMenuConfig = {
        items: [
            { name: "exit", defaultValue: "2", title: "Закрыть приложение" },
            { name: "reboot", defaultValue: "2", title: "Перезагрузить" },
            { name: "switch_server", defaultValue: "2", title: "Сменить сервер" },
            { name: "clear_cache", defaultValue: "2", title: "Очистить кэш" },
            { name: "youtube", defaultValue: "1", title: "YouTube" },
            { name: "rutube", defaultValue: "1", title: "RuTube" },
            { name: "drm_play", defaultValue: "1", title: "DRM Play" },
            { name: "twitch", defaultValue: "1", title: "Twitch" },
            { name: "fork_player", defaultValue: "1", title: "ForkPlayer" },
            { name: "speedtest", defaultValue: "1", title: "Speed Test" }
        ]
    };

    function exitMenuSeason() { /* ... код без изменений ... */ }
    function exitMenuSpeedTest() { /* ... код без изменений ... */ }
    function exitMenuClearCache() { /* ... код без изменений ... */ }
    function exitMenuSwitchServer() { /* ... код без изменений ... */ }
    function exitMenuOpenExternal(url) { /* ... код без изменений ... */ }
    function exitMenuIconHtml(id) { /* ... код без изменений ... */ }
    
    // ИСПРАВЛЕНО: Заменено localStorage на Lampa.Storage
    function exitMenuBuildItems() {
        var items = [];
        var all_items = ExitMenuConfig.items;
        
        for (var i = 0; i < all_items.length; i++) {
            var item = all_items[i];
            if (Lampa.Storage.get('menu_' + item.name, item.defaultValue) !== '1') {
                items.push({ id: item.name, title: exitMenuIconHtml(item.name) });
            }
        }
        return items;
    }

    function exitMenuOpen() {
      try {
        exitMenuEnsureDefaults();

        var items = exitMenuBuildItems();
        if (!items.length) {
          Lampa.Noty.show("Все пункты меню выхода скрыты в настройках");
          return;
        }

        Lampa.Select.show({
          title: "Меню выхода",
          items: items,
          onBack: function () {
            Lampa.Controller.toggle("content");
          },
          onSelect: function (selected) {
            switch (selected.id) {
              case "exit": exitMenuSeason(); break;
              case "reboot": window.location.reload(); break;
              case "switch_server": exitMenuSwitchServer(); break;
              case "clear_cache": exitMenuClearCache(); break;
              case "youtube": exitMenuOpenExternal("https://youtube.com/tv"); break;
              case "rutube": exitMenuOpenExternal("https://rutube.ru/tv-release/rutube.server-22.0.0/webos/"); break;
              case "drm_play": exitMenuOpenExternal("https://ott.drm-play.com"); break;
              case "twitch": exitMenuOpenExternal("https://webos.tv.twitch.tv"); break;
              case "fork_player": exitMenuOpenExternal("http://browser.appfxml.com"); break;
              case "speedtest": exitMenuSpeedTest(); break;
            }
          }
        });
      } catch (e) {
        log("exitMenuOpen error:", e);
      }
    }


    // === ЦВЕТА МЕТОК И РЕЙТИНГИ НА КАРТОЧКАХ ===

    function getCurrentLabelColors() {
      var scheme = SuperMenuConfig.LABEL_SCHEME;
      var all = SuperMenuConfig.LABEL_COLORS || {};
      return all[scheme] || all.vivid || { TYPE: {}, QUALITY: {} };
    }
    
    // Эта функция вызывается наблюдателем для каждой карточки
    function processCard(card_element) {
        try {
            if (card_element.dataset.supermenuProcessed) return;

            var meta = card_element.item_data;
            if (!meta) return;

            // Раскрашиваем метки
            colorizeLabelsInContainer(card_element, meta);
            
            // Добавляем рейтинги
            addRatingsToCard(card_element, meta);

            card_element.dataset.supermenuProcessed = true;
        } catch (e) {
            log('processCard error:', e);
        }
    }

    function colorizeLabelsInContainer(container, meta) {
      if (!SuperMenuConfig.FEATURES.label_colors) return;
      if (!container || !meta) return;
      try {
        var colors = getCurrentLabelColors();
        var typeEl = container.querySelector(".card-type");
        var qualityEl = container.querySelector(".card-quality");

        if (typeEl && meta.type) {
          var tColor = colors.TYPE[meta.type];
          if (tColor) typeEl.style.color = tColor;
        }

        if (qualityEl) {
            var q_text = (qualityEl.textContent || "").toUpperCase();
            var qColor = null;
            if (q_text.includes("4K") || q_text.includes("2160")) qColor = colors.QUALITY["4K"];
            else if (q_text.includes("1080")) qColor = colors.QUALITY["1080p"];
            else if (q_text.includes("720")) qColor = colors.QUALITY["720p"];
            else if (q_text.includes("HDR")) qColor = colors.QUALITY["HDR"];
            else if (q_text.includes("CAM")) qColor = colors.QUALITY["CAM"];
            else if (q_text.includes("SD")) qColor = colors.QUALITY["SD"];
            if (qColor) qualityEl.style.color = qColor;
        }
      } catch (e) {
        log("colorizeLabelsInContainer error:", e);
      }
    }
    
    function addRatingsToCard(card_element, meta) {
        var a_call = [];
        if (SuperMenuConfig.FEATURES.ratings_tmdb) a_call.push(getTmdbRating);
        if (SuperMenuConfig.FEATURES.ratings_imdb) a_call.push(getImdbRating);
        if (SuperMenuConfig.FEATURES.ratings_kp) a_call.push(getKpRating);

        if (a_call.length === 0) return;
        
        var card_bottom = card_element.querySelector('.card__bottom');
        if (!card_bottom) return;

        var rating_container = document.createElement('div');
        rating_container.className = 'supermenu-ratings';
        rating_container.style.position = 'absolute';
        rating_container.style.top = '0.7em';
        rating_container.style.right = '0.7em';
        rating_container.style.display = 'flex';
        rating_container.style.gap = '0.5em';
        
        card_element.querySelector('.card__view').appendChild(rating_container);

        a_call.forEach(function(call) {
            call(meta, function(rating) {
                if (rating && rating.value) {
                    var badge = document.createElement('div');
                    badge.className = 'supermenu-rating-badge supermenu-rating--' + rating.source;
                    badge.textContent = rating.value;
                    
                    // Стили для бейджей
                    badge.style.padding = '0.1em 0.4em';
                    badge.style.borderRadius = '0.3em';
                    badge.style.fontSize = '0.8em';
                    badge.style.fontWeight = 'bold';
                    badge.style.color = 'white';
                    badge.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
                    
                    if (rating.source === 'kp') badge.style.backgroundColor = '#f60';
                    else if (rating.source === 'imdb') badge.style.backgroundColor = '#f5c518';
                    else if (rating.source === 'tmdb') badge.style.backgroundColor = '#01d277';

                    rating_container.appendChild(badge);
                }
            });
        });
    }

    // === MADNESS: заголовки разделов ===
    function madnessDecorateSectionTitle(element) { /* ... код без изменений ... */ }
    function initMadnessSectionHooks() { /* ... код без изменений ... */ }
    
    // === ТЁМНАЯ ТЕМА БЕЗ РАМОК ===
    var injectedBorderlessStyle = null;
    function injectBorderlessDarkTheme() { /* ... код без изменений ... */ }
    function setBorderlessDarkThemeEnabled(enabled) { /* ... код без изменений ... */ }
    
    // === ОЗУЧКИ (каркас) ===
    // ВНИМАНИЕ: Эта функция - только каркас. Для ее работы требуется дополнительная интеграция с плеером.
    function rememberVoiceoverSelection(meta) { /* ... код без изменений ... */ }
    function checkVoiceoverUpdate(meta) { /* ... код без изменений ... */ }

    // === НАСТРОЙКИ ПЛАГИНА В LAMPA ===
    function registerSettings() {
      try {
        var main_component_name = SuperMenuConfig.PLATFORM.isTV ? 'more' : 'main';

        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_borderless_dark', type: 'toggle', "default": SuperMenuConfig.FEATURES.borderless_dark_theme },
            field: { name: 'Тема: тёмная без рамок', description: 'Сглаженные карточки без рамок, тёмный фон' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_label_colors', type: 'toggle', "default": SuperMenuConfig.FEATURES.label_colors },
            field: { name: 'Цветные метки качества и типа' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_label_scheme', type: 'select', values: { vivid: "Яркая схема", soft: "Мягкая схема" }, "default": SuperMenuConfig.LABEL_SCHEME },
            field: { name: 'Цветовая схема меток' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_ratings_tmdb', type: 'toggle', "default": SuperMenuConfig.FEATURES.ratings_tmdb },
            field: { name: 'Рейтинг TMDB' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_ratings_imdb', type: 'toggle', "default": SuperMenuConfig.FEATURES.ratings_imdb },
            field: { name: 'Рейтинг IMDb' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_ratings_kp', type: 'toggle', "default": SuperMenuConfig.FEATURES.ratings_kp },
            field: { name: 'Рейтинг КиноПоиск' }
        });
        // НОВОЕ: Поле для API ключа КиноПоиска
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_kp_apikey', type: 'text', "default": "" },
            field: { name: 'API-ключ для КиноПоиск', description: 'Получите на kinopoiskapiunofficial.tech' }
        });
        Lampa.SettingsApi.addParam({
            component: main_component_name,
            param: { name: 'drxaos_supermenu_topbar_exit', type: 'toggle', "default": SuperMenuConfig.FEATURES.topbar_exit_menu },
            field: { name: 'Меню выхода в верхней панели' }
        });
      } catch (e) {
        log("registerSettings error:", e);
      }
    }

    function applyUserSettings() {
      try {
        SuperMenuConfig.FEATURES.borderless_dark_theme = Lampa.Storage.get("drxaos_supermenu_borderless_dark", 'false') === 'true';
        SuperMenuConfig.FEATURES.label_colors = Lampa.Storage.get("drxaos_supermenu_label_colors", 'true') === 'true';
        SuperMenuConfig.LABEL_SCHEME = Lampa.Storage.get("drxaos_supermenu_label_scheme", "vivid");
        SuperMenuConfig.FEATURES.ratings_tmdb = Lampa.Storage.get("drxaos_supermenu_ratings_tmdb", 'true') === 'true';
        SuperMenuConfig.FEATURES.ratings_imdb = Lampa.Storage.get("drxaos_supermenu_ratings_imdb", 'true') === 'true';
        SuperMenuConfig.FEATURES.ratings_kp = Lampa.Storage.get("drxaos_supermenu_ratings_kp", 'true') === 'true';
        SuperMenuConfig.FEATURES.topbar_exit_menu = Lampa.Storage.get("drxaos_supermenu_topbar_exit", 'true') === 'true';
        
        // НОВОЕ: Загружаем ключ и URL для КП
        SuperMenuConfig.RATINGS.kpApiKey = Lampa.Storage.get("drxaos_supermenu_kp_apikey", "");

      } catch (e) {
        log("applyUserSettings error:", e);
      }
    }

    function registerTopBarButton() { /* ... код без изменений ... */ }

    function onSettingsChanged(event) {
      if (event.name.indexOf("drxaos_supermenu_") === 0) {
        applyUserSettings();
        injectBorderlessDarkTheme();
        // Перезагружаем страницу для применения всех визуальных изменений
        Lampa.Noty.show('Настройки SuperMenu применены. Обновление...');
        setTimeout(function() { window.location.reload(); }, 1000);
      }
    }
    
    // НОВОЕ: Наблюдатель за DOM для обработки новых карточек
    function initCardObserver() {
        var observer = new MutationObserver(throttle(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            // Ищем карточки внутри добавленного узла
                            var cards = node.querySelectorAll('.card');
                            if (cards.length) {
                                cards.forEach(processCard);
                            }
                            // Проверяем, не является ли сам узел карточкой
                            if (node.classList.contains('card')) {
                                processCard(node);
                            }
                        }
                    });
                }
            });
        }, SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        log('Card observer initialized');
    }

    // === ЭКСПОРТ ВНЕШНЕГО API ===
    try {
      window.DrxSuperMenu = window.DrxSuperMenu || {};
      window.DrxSuperMenu.colorizeLabelsInContainer = colorizeLabelsInContainer;
      window.DrxSuperMenu.getTmdbRating = getTmdbRating;
      window.DrxSuperMenu.getImdbRating = getImdbRating;
      window.DrxSuperMenu.getKpRating = getKpRating;
      window.DrxSuperMenu.setBorderlessDarkThemeEnabled = setBorderlessDarkThemeEnabled;
      window.DrxSuperMenu.rememberVoiceoverSelection = rememberVoiceoverSelection;
      window.DrxSuperMenu.checkVoiceoverUpdate = checkVoiceoverUpdate;
    } catch (e) {
      log("Export DrxSuperMenu API error:", e);
    }

    // === ЗАПУСК ===
    applyUserSettings(); // Применяем настройки один раз при старте
    registerSettings();
    injectBorderlessDarkTheme();
    registerTopBarButton();
    initMadnessSectionHooks();
    initCardObserver(); // Запускаем наблюдатель за карточками

    Lampa.Storage.listener.follow("change", onSettingsChanged);
    
    log("SuperMenu Plugin by Dr.Xaos initialized successfully.");
  }


  // === ЗАПУСК ПЛАГИНА (Bootstrap) ===
  // Этот код гарантирует, что плагин запустится только когда Lampa будет готова
  if (window.appready) {
    init();
  } else {
    Lampa.Listener.follow("app", function (e) {
      if (e.type === "ready") {
        init();
        // Отписываемся от события, чтобы не вызывать init повторно
        Lampa.Listener.destroy("app", "supermenu_init");
      }
    }, "supermenu_init");
  }

})();